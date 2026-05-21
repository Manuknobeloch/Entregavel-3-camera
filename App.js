import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Feather from '@expo/vector-icons/Feather';

function formataDataHora(agora) {
  const meses = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ];
  const dia = agora.getDate();
  const mes = meses[agora.getMonth()];
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  return `${dia} DE ${mes}, ${hora}:${minuto}`;
}

export default function App() {
  const [ultimaFoto, setUltimaFoto] = useState(null);
  const [filtro, setFiltro] = useState("normal");
  const [dataHora, setDataHora] = useState(formataDataHora(new Date()));
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
    const interval = setInterval(() => {
      setDataHora(formataDataHora(new Date()));
    }, 60000);

    return () => clearInterval(interval);
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
      <View style={styles.seloDataHora}>
        <Feather name="clock" size={12} color="#D2F000" />
        <Text style={styles.seloTexto}>{dataHora}</Text>
      </View>
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
        activeOpacity={0.8}
      >
        <View style={styles.obturadorInner}>
        </View>
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
    width: 110,
    height: 110,
    marginLeft: -55,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  obturadorInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },

  cameraPreview: {
    width: 200,
    height: 150,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  seloDataHora: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    top: 50,
    left: 16,
    zIndex: 30,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  seloTexto: {
    color: "#C6C9AB",
    fontSize: 12,
    letterSpacing: 0.4,
    fontWeight: "600",
  },
});
