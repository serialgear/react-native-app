import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { selectAuth } from "../redux/auth/authSelectors";
import { updateAvatar } from "../redux/auth/authOperations";
import { db } from "../firebase/config";
import LogOut from "../components/LogOut";

const ProfileScreen = ({ navigation }) => {
  const { id, name, email, avatar } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [avatarImg, setAvatarImg] = useState(avatar);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const queryObj = query(collection(db, "posts"), where("userId", "==", id));
    const unsubscribe = onSnapshot(queryObj, (querySnapshot) => {
      const postsList = [];
      querySnapshot.forEach((doc) =>
        postsList.push({ ...doc.data(), id: doc.id })
      );
      setPosts(postsList);
    });
    return () => {
      unsubscribe();
    };    
  }, []);

    const addAvatar = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatarImg(result.assets[0].uri);
        dispatch(updateAvatar(result.assets[0].uri));
      }
    };

  return (
    <ImageBackground
      source={require("../assets/images/background_img_2x.jpg")}
      style={styles.bgImg}
    >
      <View style={styles.container}>
        <View style={styles.logOut}>
          <LogOut />
        </View>
        <View style={styles.userImgContainer}>
          <Image source={{ uri: avatarImg }} style={styles.userImg} />
          <Pressable
            style={[
              styles.avatarBtn,
              { borderColor: avatarImg ? "#E8E8E8" : "#FF6C00" },
            ]}
            onPress={addAvatar}
          >
            <View
              style={[
                styles.avatarBtnIconV,
                {
                  backgroundColor: avatarImg ? "#BDBDBD" : "#FF6C00",
                  transform: [{ rotate: avatarImg ? "45deg" : "0deg" }],
                },
              ]}
            ></View>
            <View
              style={[
                styles.avatarBtnIconH,
                {
                  backgroundColor: avatarImg ? "#BDBDBD" : "#FF6C00",
                  transform: [{ rotate: avatarImg ? "45deg" : "0deg" }],
                },
                ,
              ]}
            ></View>
          </Pressable>
        </View>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>{name}</Text>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.imgContainer}>
                <Image style={styles.img} source={{ uri: item.photo }} />
              </View>
              <Text style={styles.caption}>{item.caption}</Text>
              <View style={styles.signatureContainer}>
                <Pressable
                  style={styles.commentsContainer}
                  onPress={() => navigation.navigate("Comments", item)}
                >
                  <MaterialCommunityIcons
                    name="comment-outline"
                    color="#FF6C00"
                    size={24}
                  />
                  <Text style={styles.commentsCount}>
                    {item.commentCounter}
                  </Text>
                </Pressable>
                <Pressable style={styles.likesContainer} disabled>
                  <AntDesign name="like2" color={"#FF6C00"} size={24} />
                  <Text style={[styles.likesCount]}>{item.likesCounter}</Text>
                </Pressable>
                <Pressable
                  style={styles.locationContainer}
                  onPress={() => navigation.navigate("Map", item.location)}
                  disabled={!item.location}
                >
                  <SimpleLineIcons
                    name="location-pin"
                    color="#BDBDBD"
                    size={24}
                  />
                  <Text style={styles.locationName}>{item.locationName}</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    justifyContent: "flex-end",
    resizeMode: "cover",
  },
  container: {
    position: "relative",
    flexGrow: 1,
    marginTop: 307,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  logOut: {
    position: "absolute",
    top: 22,
    right: 16,
  },
  userImgContainer: {
    position: "relative",
    alignSelf: "center",
    width: 120,
    height: 120,
    marginTop: -60,
    borderRadius: 16,
  },
  userImg: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  avatarBtn: {
    position: "absolute",
    bottom: 14,
    right: -12.5,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12.5,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },
  avatarBtnIconV: {
    position: "absolute",
    width: 13,
    height: 1.5,
    backgroundColor: "#FF6C00",
  },
  avatarBtnIconH: {
    position: "absolute",
    width: 1.5,
    height: 13,
    backgroundColor: "#FF6C00",
  },
  userNameContainer: {
    width: "100%",
    marginVertical: 32,
  },
  userName: {
    fontSize: 36,
    fontWeight: 500,
    color: "#212121",
    textAlign: "center",
  },
  postContainer: {
    height: 300,
    marginBottom: 32,
  },
  imgContainer: {
    justifyContent: "center",
    width: "100%",
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  caption: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: 500,
    color: "#212121",
  },
  signatureContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  commentsContainer: {
    flex: 0,
    flexDirection: "row",
  },
  commentsCount: {
    marginLeft: 6,
    fontSize: 16,
    color: "#212121",
  },
  likesContainer: {
    flex: 0,
    flexDirection: "row",
  },
  likesCount: {
    marginLeft: 6,
    fontSize: 16,
    color: "#212121",
  },
  locationContainer: {
    flex: 0,
    flexDirection: "row",
    gap: 4,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  locationName: {
    fontSize: 16,
    fontWeight: 500,
    color: "#212121",
    textDecorationLine: "underline",
  },
});

export default ProfileScreen;
