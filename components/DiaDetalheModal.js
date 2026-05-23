import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../constants/theme";
import { formatarDataLegivel, ehHojePorChave } from "../utils/calendario";

export default function DiaDetalheModal({
  visivel,
  chave,
  foto,
  onFechar,
  onTirarFoto,
}) {
  if (!chave) return null;

  const ehHoje = ehHojePorChave(chave);

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <Pressable style={styles.fundo} onPress={onFechar}>
        <Pressable style={styles.cartao} onPress={() => {}}>
          <View style={styles.cabecalhoModal}>
            <View>
              {ehHoje ? <Text style={styles.rotuloHoje}>HOJE</Text> : null}
              <Text style={styles.dataTitulo}>{formatarDataLegivel(chave)}</Text>
            </View>
            <TouchableOpacity onPress={onFechar} hitSlop={12}>
              <Ionicons name="close" size={28} color={cores.texto} />
            </TouchableOpacity>
          </View>

          {foto ? (
            <Image source={{ uri: foto }} style={styles.fotoGrande} />
          ) : (
            <View style={styles.semFoto}>
              <Ionicons
                name="image-outline"
                size={48}
                color={cores.textoSecundario}
              />
              <Text style={styles.semFotoTexto}>
                Nenhuma foto registrada neste dia
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.botaoPrincipal} onPress={onTirarFoto}>
            <Ionicons name="camera-outline" size={22} color={cores.fundo} />
            <Text style={styles.botaoPrincipalTexto}>
              {foto ? "Tirar nova foto" : "Tirar foto"}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 24,
  },
  cartao: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 20,
  },
  cabecalhoModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  rotuloHoje: {
    color: cores.destaque,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dataTitulo: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  fotoGrande: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: cores.celula,
    marginBottom: 20,
  },
  semFoto: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: cores.celula,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 12,
  },
  semFotoTexto: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  botaoPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: cores.texto,
    paddingVertical: 14,
  },
  botaoPrincipalTexto: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: "600",
  },
});
