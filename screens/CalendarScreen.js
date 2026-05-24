import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../constants/theme";
import {
  DIAS_SEMANA,
  ehHoje,
  montarGradeCalendario,
  nomeMesAno,
} from "../utils/calendario";
import BottomNav from "../components/BottomNav";
import DiaDetalheModal from "../components/DiaDetalheModal";
import { chaveParaPartes } from "../utils/calendario";

const LARGURA = Dimensions.get("window").width;
const MARGEM = 16;
const TAMANHO_CELULA = (LARGURA - MARGEM * 2) / 7;

export default function CalendarScreen({
  fotosPorDia,
  diaSelecionado,
  onSelecionarDia,
  onVoltar,
  onIrCamera,
  onIrCalendario,
}) {
  const hoje = new Date();
  const [anoVisivel, setAnoVisivel] = useState(hoje.getFullYear());
  const [mesVisivel, setMesVisivel] = useState(hoje.getMonth());
  const [diaModal, setDiaModal] = useState(null);

  const celulas = useMemo(
    () => montarGradeCalendario(anoVisivel, mesVisivel),
    [anoVisivel, mesVisivel]
  );

  function mesAnterior() {
    if (mesVisivel === 0) {
      setMesVisivel(11);
      setAnoVisivel((a) => a - 1);
    } else {
      setMesVisivel((m) => m - 1);
    }
  }

  function proximoMes() {
    if (mesVisivel === 11) {
      setMesVisivel(0);
      setAnoVisivel((a) => a + 1);
    } else {
      setMesVisivel((m) => m + 1);
    }
  }

  function aoPressionarDia(celula) {
    if (!celula.mesAtual) {
      const { ano, mes } = chaveParaPartes(celula.chave);
      setAnoVisivel(ano);
      setMesVisivel(mes);
    }
    onSelecionarDia(celula.chave);
    setDiaModal(celula.chave);
  }

  function aoTirarFotoNoDia() {
    setDiaModal(null);
    onIrCamera();
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={onVoltar} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back" size={28} color={cores.texto} />
        </TouchableOpacity>
        <Text style={styles.tituloApp}>SEJA REAL</Text>
        <View style={styles.espacoDireita} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollConteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.secaoMes}>
          <View style={styles.infoMes}>
            <Text style={styles.rotuloArquivo}>ARQUIVO HISTÓRICO</Text>
            <Text style={styles.mesAno}>
              {nomeMesAno(anoVisivel, mesVisivel)}
            </Text>
          </View>
          <View style={styles.navegacaoMes}>
            <TouchableOpacity style={styles.botaoNav} onPress={mesAnterior}>
              <Ionicons name="chevron-back" size={20} color={cores.texto} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoNav} onPress={proximoMes}>
              <Ionicons name="chevron-forward" size={20} color={cores.texto} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.linhaDias}>
          {DIAS_SEMANA.map((dia) => (
            <Text key={dia} style={styles.diaSemana}>
              {dia}
            </Text>
          ))}
        </View>

        <View style={styles.grade}>
          {celulas.map((celula, indice) => {
            const foto = fotosPorDia[celula.chave];
            const hojeCelula =
              celula.mesAtual &&
              ehHoje(anoVisivel, mesVisivel, celula.dia);
            const selecionado = diaSelecionado === celula.chave;

            return (
              <TouchableOpacity
                key={`${celula.chave}-${indice}`}
                activeOpacity={0.7}
                onPress={() => aoPressionarDia(celula)}
                style={[
                  styles.celula,
                  !celula.mesAtual && styles.celulaForaMes,
                  hojeCelula && styles.celulaHoje,
                  selecionado && !hojeCelula && styles.celulaSelecionada,
                ]}
              >
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.fotoCelula} />
                ) : null}
                {foto ? <View style={styles.overlayFoto} /> : null}

                <View style={styles.conteudoCelula}>
                  {hojeCelula ? (
                    <Text style={styles.textoHoje}>HOJE</Text>
                  ) : null}
                  <Text
                    style={[
                      styles.numeroDia,
                      !celula.mesAtual && styles.numeroDiaInativo,
                      foto && styles.numeroDiaSobreFoto,
                    ]}
                  >
                    {celula.dia}
                  </Text>
                </View>

                {foto && !hojeCelula ? (
                  <View style={styles.pontoIndicador} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <DiaDetalheModal
        visivel={diaModal !== null}
        chave={diaModal}
        foto={diaModal ? fotosPorDia[diaModal] : null}
        onFechar={() => setDiaModal(null)}
        onTirarFoto={aoTirarFotoNoDia}
      />

      <BottomNav
        telaAtiva="calendario"
        onIrCamera={onIrCamera}
        onIrCalendario={onIrCalendario}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  botaoVoltar: {
    width: 40,
    padding: 4,
  },
  tituloApp: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 2,
  },
  espacoDireita: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollConteudo: {
    paddingHorizontal: MARGEM,
    paddingBottom: 16,
  },
  secaoMes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
    marginTop: 8,
  },
  infoMes: {
    flex: 1,
  },
  rotuloArquivo: {
    color: cores.destaque,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  mesAno: {
    color: cores.texto,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  navegacaoMes: {
    flexDirection: "row",
    gap: 8,
  },
  botaoNav: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: "center",
    justifyContent: "center",
  },
  linhaDias: {
    flexDirection: "row",
    marginBottom: 8,
  },
  diaSemana: {
    width: TAMANHO_CELULA,
    textAlign: "center",
    color: cores.textoSecundario,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: cores.borda,
  },
  celula: {
    width: TAMANHO_CELULA,
    height: TAMANHO_CELULA * 1.15,
    backgroundColor: cores.celula,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: cores.borda,
    overflow: "hidden",
    position: "relative",
  },
  celulaForaMes: {
    backgroundColor: cores.celulaInativa,
  },
  celulaHoje: {
    borderWidth: 2,
    borderColor: cores.bordaHoje,
    zIndex: 1,
  },
  celulaSelecionada: {
    borderWidth: 2,
    borderColor: cores.destaque,
  },
  fotoCelula: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlayFoto: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  conteudoCelula: {
    flex: 1,
    padding: 6,
    justifyContent: "flex-start",
    zIndex: 2,
  },
  textoHoje: {
    color: cores.texto,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  numeroDia: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: "500",
  },
  numeroDiaInativo: {
    color: cores.textoSecundario,
  },
  numeroDiaSobreFoto: {
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pontoIndicador: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: cores.texto,
    zIndex: 3,
  },
});
