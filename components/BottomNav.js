import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../constants/theme";

export default function BottomNav({
  telaAtiva,
  onIrCamera,
  onIrCalendario,
  onObturador,
}) {
  return (
    <View style={styles.barra}>
      <TouchableOpacity style={styles.icone} onPress={onIrCamera}>
        <Ionicons
          name="grid-outline"
          size={26}
          color={telaAtiva === "camera" ? cores.destaque : cores.textoSecundario}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.obturador}
        onPress={telaAtiva === "camera" && onObturador ? onObturador : onIrCamera}
      >
        <View style={styles.obturadorInterno} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconeCalendario} onPress={onIrCalendario}>
        <View
          style={[
            styles.botaoCalendario,
            telaAtiva === "calendario" && styles.botaoCalendarioAtivo,
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color={cores.texto}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: cores.fundo,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  icone: {
    padding: 8,
    minWidth: 48,
    alignItems: "center",
  },
  obturador: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: cores.texto,
    alignItems: "center",
    justifyContent: "center",
  },
  obturadorInterno: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: cores.texto,
  },
  iconeCalendario: {
    minWidth: 48,
    alignItems: "center",
  },
  botaoCalendario: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoCalendarioAtivo: {
    borderColor: cores.destaque,
  },
});
