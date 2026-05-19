import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function App() {
  const [ultimaFoto, setUltimaFoto] = useState(null);
  const [filtro, setFiltro] = useState("normal");
  const cameraRef = useRef(null);
  const [permission, requestCameraPermission] = useCameraPermissions();

  async function quandoInicializa() {
    await requestCameraPermission();
  }

  async function quandoPressionaObturador() {
    const camera = cameraRef.current;
    const foto = await camera.takePictureAsync();
    setUltimaFoto(foto.uri);
  }

  useEffect(() => {
    quandoInicializa();
  }, []);

  if (permission === null || !permission.granted) {
    return (
      <View>
        <Text>Permissão de câmera não foi concedida :(</Text>
      </View>
    );
  }

  const cameraPreview = ultimaFoto !== null && (
    <Image
      style={styles.cameraPreview}
      source={{
        uri: ultimaFoto,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
  <CameraView
  style={styles.camera}
  facing="back"
  ref={cameraRef}
/>


  {filtro === "vintage" && (
    <View style={styles.vintageFilter} />
  )}

  {filtro === "neon" && (
    <View style={styles.neonFilter} />
  )}

  {filtro === "dark" && (
    <View style={styles.darkFilter} />
  )}
</View>

<View style={styles.filtrosContainer}>
  <TouchableOpacity onPress={() => setFiltro("normal")}>
    <Text style={styles.filtroTexto}>Normal</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setFiltro("vintage")}>
    <Text style={styles.filtroTexto}>Vintage</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setFiltro("neon")}>
    <Text style={styles.filtroTexto}>Neon</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setFiltro("dark")}>
    <Text style={styles.filtroTexto}>Dark</Text>
  </TouchableOpacity>
</View>
      <TouchableOpacity
        style={styles.obturador}
        onPress={quandoPressionaObturador}
      >
        <AntDesign name="aim" size={64} color="red" />
      </TouchableOpacity>
      {cameraPreview}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  vintageFilter: {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(120, 80, 40, 0.25)",
},

neonFilter: {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 120, 255, 0.15)",
},

darkFilter: {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.35)",
},
filtrosContainer: {
  position: "absolute",
  bottom: 140,
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-evenly",
  zIndex: 20,
},

filtroTexto: {
  color: "white",
  fontSize: 16,
  backgroundColor: "rgba(0,0,0,0.5)",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
},
  camera: {
    width: "100%",
    height: "100%",
  },
  obturador: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    zIndex: 10,
    backgroundColor: "transparent",
    width: 96,
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -52,
    borderRadius: 48,
    borderWidth: 8,
    borderColor: "red",
  },
  cameraPreview: {
    width: 200,
    height: 150,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
});
