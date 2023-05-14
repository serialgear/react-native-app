import { useState } from "react";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  ImageBackground,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import { singUp, uploadPhotoToStorage } from "../redux/auth/authOperations";

const RegistrationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isFocusedLogin, setIsFocusedLogin] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [passDisplay, setPassDisplay] = useState(true);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const passDisplayToggle = () => setPassDisplay((prevState) => !prevState);

  const onSignUp = () => {
    if (!(login && email && password)) {
      Alert.alert("Please, fill in all fields!");
    }

    dispatch(singUp({ login, email, password, avatar }));
  };

  const addAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setAvatar(await uploadPhotoToStorage(result.assets[0].uri));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../assets/images/background_img_2x.jpg")}
        style={styles.bgImg}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "heigth"}
        >
          <View style={styles.container}>
            <View style={styles.avatarWrapper}>
              <Image style={styles.avatarImg} source={{ uri: photo }} />
              <Pressable
                style={[
                  styles.avatarBtn,
                  { borderColor: photo ? "#E8E8E8" : "#FF6C00" },
                ]}
                onPress={addAvatar}
              >
                <View
                  style={[
                    styles.avatarBtnIconV,
                    {
                      backgroundColor: photo ? "#BDBDBD" : "#FF6C00",
                      transform: [{ rotate: photo ? "45deg" : "0deg" }],
                    },
                  ]}
                ></View>
                <View
                  style={[
                    styles.avatarBtnIconH,
                    {
                      backgroundColor: photo ? "#BDBDBD" : "#FF6C00",
                      transform: [{ rotate: photo ? "45deg" : "0deg" }],
                    },
                    ,
                  ]}
                ></View>
              </Pressable>
            </View>
            <Text style={styles.title}>Sign up</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={login}
                onChangeText={(value) => setLogin(value)}
                placeholder="Login"
                style={[
                  styles.input,
                  isFocusedLogin && {
                    backgroundColor: "#FFF",
                    borderColor: "#FF6C00",
                  },
                ]}
                onBlur={() => setIsFocusedLogin(false)}
                onFocus={() => setIsFocusedLogin(true)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={email}
                onChangeText={(value) => setEmail(value)}
                placeholder="Email"
                inputMode="email"
                style={[
                  styles.input,
                  isFocusedEmail && {
                    backgroundColor: "#FFF",
                    borderColor: "#FF6C00",
                  },
                ]}
                onBlur={() => setIsFocusedEmail(false)}
                onFocus={() => setIsFocusedEmail(true)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={password}
                onChangeText={(value) => setPassword(value)}
                placeholder="Password"
                secureTextEntry={passDisplay}
                style={[
                  styles.input,
                  isFocusedPass && {
                    backgroundColor: "#FFF",
                    borderColor: "#FF6C00",
                  },
                ]}
                onBlur={() => setIsFocusedPass(false)}
                onFocus={() => setIsFocusedPass(true)}
              />
              <Pressable onPress={passDisplayToggle} style={styles.passDisplay}>
                <Text style={styles.passDisplayText}>
                  {passDisplay ? "Show" : "Hide"}
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={onSignUp}
              style={({ pressed }) => [
                { backgroundColor: pressed ? "#EA5700" : "#FF6C00" },
                styles.button,
              ]}
            >
              <Text style={styles.buttonTitle}>Sign up</Text>
            </Pressable>
            <View
              style={[
                styles.subscribe,
                {
                  marginBottom:
                    isFocusedLogin || isFocusedEmail || isFocusedPass
                      ? -104
                      : 45,
                },
              ]}
            >
              <Pressable
                onPress={() => navigation.navigate("Login")}
                style={styles.loginLink}
              >
                <Text style={styles.loginLinkText}>
                  Already have an account? Sign in
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 92,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    fontFamily: "Roboto-Regular",
  },
  avatarWrapper: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
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
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 32,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    height: 50,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: "100%",
    padding: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    fontSize: 16,
    color: "#212121",
  },
  passDisplay: {
    position: "absolute",
    right: 4,
    padding: 12,
  },
  passDisplayText: {
    color: "#1B4371",
    fontSize: 16,
  },
  button: {
    width: "100%",
    alignItems: "center",
    marginTop: 27,
    marginBottom: 12,
    padding: 16,
    borderRadius: 25,
  },
  buttonTitle: {
    color: "#FFF",
  },
  subscribe: {
    flexDirection: "row",
    marginBottom: 110,
  },
  loginLink: {
    padding: 4,
  },
  loginLinkText: {
    color: "#1B4371",
    fontSize: 16,
  },
});

export default RegistrationScreen;
