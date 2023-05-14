import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FlatList,
  Image,
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
} from "firebase/firestore";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { selectAuth } from "../redux/auth/authSelectors";
import { db } from "../firebase/config";

const PostsScreen = ({ navigation }) => {
  const { id, name, email, avatar } = useSelector(selectAuth);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const queryObj = query(collection(db, "posts"));
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

  const onLikePress = async (item) => {
    // if (item.userId === id) return;

    if (item.likers.includes(id)) {
      item.likers = item.likers.filter((likerId) => likerId !== id);
      const likeRef = doc(db, "posts", item.id);
      await updateDoc(likeRef, {
        likesCounter: increment(-1),
        likers: item.likers,
      });
    } else {
      item.likers.push(id);
      const likeRef = doc(db, "posts", item.id);
      await updateDoc(likeRef, {
        likesCounter: increment(1),
        likers: item.likers,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image source={{ uri: avatar }} style={styles.userImg} />
        <View style={styles.userSignature}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
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
                  color="#BDBDBD"
                  size={24}
                />
                <Text style={styles.commentsCount}>{item.commentCounter}</Text>
              </Pressable>
              <Pressable
                style={styles.likesContainer}
                onPress={() => onLikePress(item)}
                disabled={item.userId === id}
              >
                <AntDesign
                  name="like2"
                  color={item.likers.includes(id) ? "#FF6C00" : "#BDBDBD"}
                  size={24}
                />
                <Text
                  style={[
                    styles.likesCount,
                    { color: item.likers.includes(id) ? "#212121" : "#BDBDBD" },
                  ]}
                >
                  {item.likesCounter}
                </Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  userContainer: {
    flex: 0,
    flexDirection: "row",
    gap: 8,
    height: 60,
    marginBottom: 32,
  },
  userImg: {
    width: 60,
    height: 60,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  userSignature: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#212121",
  },
  userEmail: {
    fontSize: 11,
    color: "#212121CC",
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
    color: "#BDBDBD",
  },
  likesContainer: {
    flex: 0,
    flexDirection: "row",
  },
  likesCount: {
    marginLeft: 6,
    fontSize: 16,
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

export default PostsScreen;
