import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Feather from '@expo/vector-icons/Feather';
import { supabase } from '../supabase';
import BottomNav from "../components/BottomNav";

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

export default function CameraScreen({ diaSelecionado, onSalvarFoto, onIrCalendario, onIrCamera }) {
  const [ultimaFoto, setUltimaFoto] = useState(null);
  const [filtro, setFiltro] = useState("normal");
  const [dataHora, setDataHora] = useState(formataDataHora(new Date()));
  const cameraRef = useRef(null);
  const [permission, requestCameraPermission] = useCameraPermissions();

  async function carregarImagem(uri) {
     try {
    const nomeArquivo = `${Date.now()}.jpg`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: nomeArquivo,
      type: 'image/jpeg',
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(nomeArquivo, formData, { contentType: 'multipart/form-data' });

      if (uploadError) {
        console.log('Erro ao enviar arquivo:', uploadError);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('fotos')
        .getPublicUrl(nomeArquivo);

      const publicUrl = publicUrlData?.publicUrl ?? null;

      const dataAtual = new Date().toISOString();

      const { data: insertData, error: insertError } = await supabase
        .from('fotos')
        .insert({
          img_url: publicUrl,
          data_foto: dataAtual,
          latitude: null,
          longitude: null,
        });

      if (insertError) {
        console.log('Erro ao inserir no banco:', insertError);
      }

      return publicUrl;
    } catch (err) {
      console.log('Erro em carregarImagem:', err);
      return null;
    }
  }

  async function quandoInicializa() {
    await requestCameraPermission();
  }

  async function quandoPressionaObturador() {
    console.log('Tirando foto...');
    const camera = cameraRef.current;
    const foto = await camera.takePictureAsync();
    setUltimaFoto(foto.uri);
    const url = await carregarImagem(foto.uri);
    console.log('URL da imagem enviada:', url);
      if (url) {
        onSalvarFoto(diaSelecionado, url);
      }
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
      <View style={styles.navInferior}>
        <BottomNav
          telaAtiva="camera"
          onIrCamera={onIrCamera}
          onIrCalendario={onIrCalendario}
          onObturador={quandoPressionaObturador}
        />
      </View>
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
  navInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});