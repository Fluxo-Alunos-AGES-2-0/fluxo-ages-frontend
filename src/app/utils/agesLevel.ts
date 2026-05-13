const ROMAN = ["I", "II", "III", "IV"];

export function toAgesLevel(level?: number): string {
    if (!level || level < 1 || level > 4) {
        return "AGES inválido";
    }

    return `AGES ${ROMAN[level - 1]}`;
}