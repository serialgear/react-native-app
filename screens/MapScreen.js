import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ route }) => {
  const { latitude, longitude } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
