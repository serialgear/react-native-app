import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import AntDesign from "react-native-vector-icons/AntDesign";
import { selectAuth } from "../redux/auth/authSelectors";
import { db } from "../firebase/config";
import date from "date-and-time";

const CommentsScreen = ({ route }) => {
  const { id, photo, userId } = route.params;
  const { id: currentId, avatar } = useSelector(selectAuth);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isFocusedComment, setIsFocusedComment] = useState(false);
  const flatList = useRef(null);

  useEffect(() => {
    (async () => {
      const queryObj = query(
        collection(db, "posts", id, "comments"), orderBy("time")
      );
      const commentRef = doc(db, "posts", id);
      const unsubscribe = onSnapshot(queryObj, (querySnapshot) => {
        const commentsList = [];
        querySnapshot.forEach((doc) =>
          commentsList.push({ ...doc.data(), id: doc.id })
        );
        updateDoc(commentRef, { commentCounter: commentsList.length });
        setAllComments(commentsList);
      });

      return () => {
        unsubscribe();
      };
    })();
  }, []);

  const createPost = async () => {
    if (!comment) {
      Alert.alert("Please, leave a comment!");
    }

    try {
      const time = date.format(new Date(), "D MMMM YYYY | HH:mm");
      const commentDocRef = await addDoc(
        collection(db, "posts", id, "comments"),
        { avatar, comment, time, userId: currentId }
      );
    } catch (error) {
      console.log(error.message);
    }
    setComment("");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "heigth"}
      >
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={{ uri: photo }} />
          </View>
          <SafeAreaView style={styles.commentsContainer}>
            <FlatList
              ref={flatList}
              // onContentSizeChange={() => {
              //   flatList.current.scrollToEnd();
              // }}
              data={allComments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.commentContainer,
                    {
                      flexDirection:
                        item.userId === currentId ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      style={styles.userImg}
                      source={{ uri: item.avatar }}
                    />
                  </View>
                  <View
                    style={[
                      styles.massageContainer,
                      {
                        borderTopRightRadius: item.userId === currentId ? 0 : 6,
                        borderTopLeftRadius: item.userId === currentId ? 6 : 0,
                      },
                    ]}
                  >
                    <Text style={styles.comment}>{item.comment}</Text>
                    <Text
                      style={[
                        styles.time,
                        {
                          textAlign:
                            item.userId === currentId ? "left" : "right",
                        },
                      ]}
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              )}
            ></FlatList>
          </SafeAreaView>

          <View style={styles.inputWrapper}>
            <TextInput
              value={comment}
              onChangeText={(value) => setComment(value)}
              placeholder="Comment..."
              inputMode="text"
              style={[
                styles.input,
                isFocusedComment && {
                  backgroundColor: "#FFF",
                  borderColor: "#FF6C00",
                },
              ]}
              onBlur={() => setIsFocusedComment(false)}
              onFocus={() => setIsFocusedComment(true)}
            />
            <Pressable
              onPress={createPost}
              style={({ pressed }) => [
                { backgroundColor: pressed ? "#EA5700" : "#FF6C00" },
                styles.button,
              ]}
            >
              <AntDesign name="arrowup" size={18} color={"#FFF"} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
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
  inputWrapper: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
  },
  input: {
    width: "100%",
    height: "100%",
    padding: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 25,
    fontSize: 16,
    color: "#212121",
  },
  button: {
    position: "absolute",
    right: 8,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  commentsContainer: {
    flex: 1,
    marginTop: 32,
    backgroundColor: "#FFF",
  },
  commentContainer: {
    gap: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
  },
  userImg: {
    width: "100%",
    height: "100%",
  },
  massageContainer: {
    flexGrow: 1,
    padding: 16,
    borderRadius: 6,
    backgroundColor: "#00000008",
  },
  comment: {
    marginBottom: 8,
    fontSize: 13,
    color: "#212121",
  },
  time: {
    fontSize: 10,
    color: "#BDBDBD",
  },
});

export default CommentsScreen;
