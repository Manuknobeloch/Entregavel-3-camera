const MESES = [
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

const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export function formatarChaveData(ano, mes, dia) {
  const m = String(mes + 1).padStart(2, "0");
  const d = String(dia).padStart(2, "0");
  return `${ano}-${m}-${d}`;
}

export function nomeMesAno(ano, mes) {
  return `${MESES[mes]} ${ano}`;
}

export { DIAS_SEMANA };

export function montarGradeCalendario(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasNoMes = ultimoDia.getDate();
  const inicioSemana = primeiroDia.getDay();

  const diasMesAnterior = new Date(ano, mes, 0).getDate();
  const celulas = [];

  for (let i = inicioSemana - 1; i >= 0; i--) {
    celulas.push({
      dia: diasMesAnterior - i,
      mesAtual: false,
      chave: formatarChaveData(
        mes === 0 ? ano - 1 : ano,
        mes === 0 ? 11 : mes - 1,
        diasMesAnterior - i
      ),
    });
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    celulas.push({
      dia,
      mesAtual: true,
      chave: formatarChaveData(ano, mes, dia),
    });
  }

  const totalCelulas = Math.ceil((inicioSemana + diasNoMes) / 7) * 7;
  let diaProximoMes = 1;
  const anoProximo = mes === 11 ? ano + 1 : ano;
  const mesProximo = mes === 11 ? 0 : mes + 1;

  while (celulas.length < totalCelulas) {
    celulas.push({
      dia: diaProximoMes,
      mesAtual: false,
      chave: formatarChaveData(anoProximo, mesProximo, diaProximoMes),
    });
    diaProximoMes += 1;
  }

  return celulas;
}

export function ehHoje(ano, mes, dia) {
  const hoje = new Date();
  return (
    hoje.getFullYear() === ano &&
    hoje.getMonth() === mes &&
    hoje.getDate() === dia
  );
}

export function ehHojePorChave(chave) {
  const hoje = new Date();
  return chave === formatarChaveData(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
}

export function formatarDataLegivel(chave) {
  const [ano, mes, dia] = chave.split("-").map(Number);
  return `${dia} de ${MESES[mes - 1].toLowerCase()} de ${ano}`;
}

export function chaveParaPartes(chave) {
  const [ano, mes, dia] = chave.split("-").map(Number);
  return { ano, mes: mes - 1, dia };
}
