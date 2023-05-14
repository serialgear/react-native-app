import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { addDoc, collection } from "firebase/firestore";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { uploadPhotoToStorage } from "../redux/auth/authOperations";
import { selectAuth } from "../redux/auth/authSelectors";
import { db } from "../firebase/config";

const CreatePostsScreen = ({ navigation }) => {
  const { id, name } = useSelector(selectAuth);
  const [caption, setCaption] = useState("");
  const [locationName, setLocationName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      const currentlocation = await Location.getCurrentPositionAsync({});
      setLocation(currentlocation);
    })();
  }, []);

  const reffreshCam = () => {
    if (!photo) setPhoto(" ");
    if (photo) setPhoto(null);
  };

  const takePhoto = async () => {
    const { uri } = await cameraRef.takePictureAsync();
    setPhoto(uri);

    const currentlocation = await Location.getCurrentPositionAsync({});
    setLocation(currentlocation);
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const uploadPostToStorage = async () => {
    const image = await uploadPhotoToStorage(photo, "photos");
    try {
      const postObj = {
        userId: id,
        name,
        caption,
        locationName,
        photo: image,
        commentCounter: 0,
        likesCounter: 0,
        likers: [id],
      };
      if (location) postObj.location = location.coords;
      const docRef = await addDoc(collection(db, "posts"), postObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onSubmit = () => {
    uploadPostToStorage();
    const data = { caption, locationName, photo, location };
    setCaption("");
    setLocationName("");
    setPhoto(null);
    navigation.navigate("Posts", data);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            {photo ? (
              <Image style={styles.camera} source={{ uri: photo }} />
            ) : (
              <Camera style={styles.camera} ref={setCameraRef} type={type}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={takePhoto}
                >
                  <Entypo name="camera" color="#fff" size={24} />
                </TouchableOpacity>
              </Camera>
            )}
          </View>
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>
              {photo ? "Edit photo" : "Upload photo"}
            </Text>
            {photo ? (
              <TouchableOpacity
                style={styles.flipContainer}
                onPress={() => setPhoto(null)}
              >
                <MaterialCommunityIcons
                  name="image-remove"
                  color="#BDBDBD"
                  size={32}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.flipContainer}
                onPress={toggleCameraType}
              >
                <MaterialIcons
                  name="flip-camera-android"
                  color="#BDBDBD"
                  size={32}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              value={caption}
              onChangeText={(value) => setCaption(value)}
              style={[styles.input, { fontWeight: "500" }]}
              placeholder="Title..."
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              value={locationName}
              onChangeText={(value) => setLocationName(value)}
              style={[styles.input, { paddingLeft: 28 }]}
              placeholder="Location..."
            />
            <SimpleLineIcons
              style={styles.locationIcon}
              name="location-pin"
              color="#BDBDBD"
              size={24}
            />
          </View>
          <Pressable
            onPress={onSubmit}
            disabled={!(photo && caption)}
            style={({ pressed }) => [
              {
                backgroundColor: !(photo && caption)
                  ? "#F6F6F6"
                  : pressed
                  ? "#EA5700"
                  : "#FF6C00",
              },
              styles.button,
            ]}
          >
            <Text
              style={[
                { color: photo && caption ? "#fff" : "#BDBDBD" },
                styles.buttonTitle,
              ]}
            >
              Publish
            </Text>
          </Pressable>
          <View style={styles.treshContainer}>
            <Pressable onPress={reffreshCam} style={[styles.tresh]}>
              <MaterialCommunityIcons
                name={"camera-flip-outline"}
                color={"#BDBDBD"}
                size={24}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    justifyContent: "flex-end",
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  cameraContainer: {
    justifyContent: "center",
    width: "100%",
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
  },
  camera: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "200%",
  },
  cameraButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff4d",
  },
  captionContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flipContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: "50%",
    transform: [{ translateX: 20 }],
    width: 40,
    height: 40,
  },
  caption: {
    marginTop: 8,
    marginBottom: 32,
    fontSize: 16,
    color: "#BDBDBD",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    height: 50,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: "100%",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    fontSize: 16,
    color: "#212121",
  },
  locationIcon: {
    position: "absolute",
    top: 12,
  },
  button: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
    padding: 16,
    borderRadius: 25,
  },
  buttonTitle: {
    fontSize: 16,
  },
  treshContainer: {
    marginBottom: 56,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tresh: {
    marginTop: 9,
    marginBottom: 6,
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
});

export default CreatePostsScreen;
