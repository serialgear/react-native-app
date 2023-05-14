import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { selectAuth } from "./redux/auth/authSelectors";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import Home from "./screens/Home";
import CommentsScreen from "./screens/CommentsScreen";
import MapScreen from "./screens/MapScreen";
import { refreshUser } from "./redux/auth/authSlice";

const Stack = createStackNavigator();

const Router = () => {
  const { isLogedIn } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL, accessToken } = user;
        dispatch(
          refreshUser({
            id: uid,
            name: displayName,
            email: email,
            avatar: photoURL,
            token: accessToken,
          })
        );
      } else {
        console.log("User is signed out");
      }
    });
  }, []);

  if (!isLogedIn) {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{ headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    );
  }
};

export default Router;
