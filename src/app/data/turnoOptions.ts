export interface TurnoOption {
  /** Valor enviado em GET /schedule?diaTurno= */
  value: string;
  /** Rótulo exibido no filtro */
  label: string;
}

// O backend ainda não define um enum fixo para diaTurno: é uma string livre no
// formato TURMA_DIAS (o seed usa "LM_SEGQUA"). Estes valores seguem esse padrão
// e devem ser alinhados quando o enum for fechado no backend. A lista foi pensada
// para crescer (basta adicionar novas entradas aqui).
export const TURNO_OPTIONS: TurnoOption[] = [
  { value: "JK_SEGQUA", label: "Segunda e Quarta · JK" },
  { value: "LM_SEGQUA", label: "Segunda e Quarta · LM" },
  { value: "JK_TERQUI", label: "Terça e Quinta · JK" },
  { value: "LMNP_SEXTA", label: "Sexta - LM/NP" },
];

// Único turno com dados semeados no backend hoje.
export const DEFAULT_TURNO = "LM_SEGQUA";

export function turnoLabel(value: string): string {
  return TURNO_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
