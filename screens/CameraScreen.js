import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import BottomNav from "../components/BottomNav";
import { formatarDataLegivel } from "../utils/calendario";
import { cores } from "../constants/theme";

export default function CameraScreen({
  diaSelecionado,
  onSalvarFoto,
  onIrCalendario,
  onIrCamera,
}) {
  const [ultimaFoto, setUltimaFoto] = useState(null);
  const [filtro, setFiltro] = useState("normal");
  const cameraRef = useRef(null);
  const [permission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  async function quandoPressionaObturador() {
    const camera = cameraRef.current;
    if (!camera) return;

    const foto = await camera.takePictureAsync();
    setUltimaFoto(foto.uri);

    onSalvarFoto(diaSelecionado, foto.uri);
  }

  if (permission === null || !permission.granted) {
    return (
      <View style={styles.semPermissao}>
        <Text style={styles.textoPermissao}>
          Permissão de câmera não foi concedida :(
        </Text>
      </View>
    );
  }

  const preview = ultimaFoto ? (
    <Image style={styles.cameraPreview} source={{ uri: ultimaFoto }} />
  ) : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {diaSelecionado ? (
        <View style={styles.faixaDia}>
          <Text style={styles.faixaDiaTexto}>
            Salvando em: {formatarDataLegivel(diaSelecionado)}
          </Text>
        </View>
      ) : null}

      <View style={styles.areaCamera}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />

        {filtro === "vintage" && <View style={styles.vintageFilter} />}
        {filtro === "neon" && <View style={styles.neonFilter} />}
        {filtro === "dark" && <View style={styles.darkFilter} />}
      </View>

      <View style={styles.filtrosContainer}>
        {["normal", "vintage", "neon", "dark"].map((nome) => (
          <TouchableOpacity key={nome} onPress={() => setFiltro(nome)}>
            <Text
              style={[
                styles.filtroTexto,
                filtro === nome && styles.filtroAtivo,
              ]}
            >
              {nome.charAt(0).toUpperCase() + nome.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {preview}

      <View style={styles.navInferior}>
        <BottomNav
          telaAtiva="camera"
          onIrCamera={onIrCamera}
          onIrCalendario={onIrCalendario}
          onObturador={quandoPressionaObturador}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  semPermissao: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.fundo,
  },
  textoPermissao: {
    color: cores.texto,
    fontSize: 16,
  },
  faixaDia: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    zIndex: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderWidth: 1,
    borderColor: cores.destaque,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  faixaDiaTexto: {
    color: cores.destaque,
    fontSize: 13,
    textAlign: "center",
    textTransform: "capitalize",
  },
  areaCamera: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  vintageFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(120, 80, 40, 0.25)",
  },
  neonFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 120, 255, 0.15)",
  },
  darkFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  filtrosContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    zIndex: 20,
  },
  filtroTexto: {
    color: cores.texto,
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  filtroAtivo: {
    backgroundColor: "rgba(196, 165, 116, 0.4)",
  },
  cameraPreview: {
    width: 100,
    height: 75,
    position: "absolute",
    top: 56,
    right: 16,
    zIndex: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  navInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
