import { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../constants/theme";
import { formatarDataLegivel, ehHojePorChave } from "../utils/calendario";
import BottomNav from "../components/BottomNav";
import { supabase } from "../supabase";

const LARGURA = Dimensions.get("window").width;
const MARGEM = 16;
const GAP = 8;
const LARGURA_COLUNA = (LARGURA - MARGEM * 2 - GAP) / 2;

const ALTURAS_VARIAVEIS = [220, 160, 280, 200, 240, 180, 260, 150, 300, 190];

function distribuirEmColunas(fotos) {
  const colunaEsquerda = [];
  const colunaDireita = [];
  let alturaEsquerda = 0;
  let alturaDireita = 0;

  fotos.forEach((foto, indice) => {
    const altura = ALTURAS_VARIAVEIS[indice % ALTURAS_VARIAVEIS.length];
    if (alturaEsquerda <= alturaDireita) {
      colunaEsquerda.push({ uri: foto, altura });
      alturaEsquerda += altura + GAP;
    } else {
      colunaDireita.push({ uri: foto, altura });
      alturaDireita += altura + GAP;
    }
  });

  return { colunaEsquerda, colunaDireita };
}

export default function FeedScreen({
  chave,
  fotosLocais,
  onVoltar,
  onIrCamera,
  onIrCalendario,
}) {
  const ehHoje = ehHojePorChave(chave);
  const dataLegivel = formatarDataLegivel(chave);

  const [fotos, setFotos] = useState(fotosLocais ?? []);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarFotos() {
      setCarregando(true);
      try {
        const inicioDia = `${chave}T00:00:00.000Z`;
        const fimDia = `${chave}T23:59:59.999Z`;

        const { data, error } = await supabase
          .from("fotos")
          .select("img_url")
          .gte("data_foto", inicioDia)
          .lte("data_foto", fimDia)
          .order("data_foto", { ascending: true });

        if (error) {
          console.log("Erro ao buscar fotos:", error);
          return;
        }

        const urls = (data ?? []).map((item) => item.img_url).filter(Boolean);
        setFotos(urls);
      } catch (err) {
        console.log("Erro em buscarFotos:", err);
      } finally {
        setCarregando(false);
      }
    }

    buscarFotos();
  }, [chave]);

  const { colunaEsquerda, colunaDireita } = useMemo(
    () => distribuirEmColunas(fotos),
    [fotos]
  );

  function renderizarColuna(itens) {
    return itens.map((item, indice) => (
      <View
        key={`${item.uri}-${indice}`}
        style={[styles.card, { height: item.altura }]}
      >
        <Image source={{ uri: item.uri }} style={styles.imagemCard} />
        <View style={styles.overlayCard} />
      </View>
    ));
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
        <View style={styles.secaoData}>
          {ehHoje ? (
            <Text style={styles.rotuloHoje}>HOJE</Text>
          ) : null}
          <Text style={styles.dataTexto}>{dataLegivel}</Text>
          {!carregando ? (
            <Text style={styles.contagemFotos}>
              {fotos.length} {fotos.length === 1 ? "foto" : "fotos"}
            </Text>
          ) : null}
        </View>

        {carregando ? (
          <View style={styles.semFotos}>
            <ActivityIndicator color={cores.destaque} size="large" />
          </View>
        ) : fotos.length === 0 ? (
          <View style={styles.semFotos}>
            <Ionicons
              name="image-outline"
              size={52}
              color={cores.textoSecundario}
            />
            <Text style={styles.semFotosTexto}>
              Nenhuma fotografia no dia selecionado
            </Text>
          </View>
        ) : (
          <View style={styles.grade}>
            <View style={styles.coluna}>{renderizarColuna(colunaEsquerda)}</View>
            <View style={styles.coluna}>{renderizarColuna(colunaDireita)}</View>
          </View>
        )}
      </ScrollView>

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
    paddingBottom: 24,
  },
  secaoData: {
    marginTop: 8,
    marginBottom: 20,
  },
  rotuloHoje: {
    color: cores.destaque,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  dataTexto: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  contagemFotos: {
    color: cores.textoSecundario,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  grade: {
    flexDirection: "row",
    gap: GAP,
  },
  coluna: {
    flex: 1,
    gap: GAP,
  },
  card: {
    width: LARGURA_COLUNA,
    backgroundColor: cores.celula,
    overflow: "hidden",
  },
  imagemCard: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlayCard: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  semFotos: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 16,
  },
  semFotosTexto: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: "center",
  },
});