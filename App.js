import { useState } from "react";
import CameraScreen from "./screens/CameraScreen";
import CalendarScreen from "./screens/CalendarScreen";
import { formatarChaveData } from "./utils/calendario";

function chaveHoje() {
  const hoje = new Date();
  return formatarChaveData(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
}

export default function App() {
  const [tela, setTela] = useState("camera");
  const [fotosPorDia, setFotosPorDia] = useState({});
  const [diaSelecionado, setDiaSelecionado] = useState(chaveHoje());

  function salvarFoto(chave, uri) {
    setFotosPorDia((anterior) => ({
      ...anterior,
      [chave]: uri,
    }));
  }

  if (tela === "calendario") {
    return (
      <CalendarScreen
        fotosPorDia={fotosPorDia}
        diaSelecionado={diaSelecionado}
        onSelecionarDia={setDiaSelecionado}
        onVoltar={() => setTela("camera")}
        onIrCamera={() => setTela("camera")}
        onIrCalendario={() => setTela("calendario")}
      />
    );
  }

  return (
    <CameraScreen
      diaSelecionado={diaSelecionado}
      onSalvarFoto={salvarFoto}
      onIrCamera={() => setTela("camera")}
      onIrCalendario={() => setTela("calendario")}
    />
  );
}