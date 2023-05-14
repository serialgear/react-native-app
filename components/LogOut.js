import { StyleSheet, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { singOut } from "../redux/auth/authOperations";

const LogOut = () => {
  const dispatch = useDispatch()

  return (
    <Pressable onPress={() => dispatch(singOut())}>
      <MaterialIcons
        style={styles.icon}
        name="logout"
        size={24}
        color="#BDBDBD"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 16,
    padding: 4,
  },
});

export default LogOut;
