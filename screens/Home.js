import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import LogOut from "../components/LogOut";
import AntDesign from "react-native-vector-icons/AntDesign";

const Tabs = createBottomTabNavigator();

const Home = ({ navigation }) => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#212121cc",
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Posts") {
            iconName = "view-grid-outline";
          } else if (route.name === "CreatePosts") {
            iconName = "plus";
          } else if (route.name === "Profile") {
            iconName = "account-outline";
          }

          return (
            <View
              style={[
                styles.tab,
                { backgroundColor: focused ? "#FF6C00" : "#fff" },
              ]}
            >
              <MaterialCommunityIcons name={iconName} color={color} size={24} />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerTitleAlign: "center",
          headerRight: () => <LogOut />,
        }}
      />
      <Tabs.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          headerTitleAlign: "center",
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign
                style={{ marginHorizontal: 16 }}
                name={"arrowleft"}
                color={"#212121cc"}
                size={24}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tab: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
