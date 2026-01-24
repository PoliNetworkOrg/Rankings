export function containsOnlyNumbers(input?: string): boolean {
  if (!input) return false
  return /^[0-9]+$/.test(input)
}

type Final = "o" | "a" | "i" | "e"
export function numberToOrdinalString(num: number, final: Final): string {
  if (num === 0 || num > ORDINAL.length - 1) return `${num}-esim${final}`
  return ORDINAL[num - 1] + final
}

export function numberToRoman(num: number): string {
  return ROMAN[num]
}

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

const ORDINAL = [
  "prim",
  "second",
  "terz",
  "quart",
  "quint",
  "sest",
  "settim",
  "ottav",
  "non",
  "decim",
  "undicesim",
  "dodicesim",
  "tredicesim",
  "quattordicesim",
  "quindicesim",
  "sedicesim",
  "diciassettesim",
  "diciottesim",
  "diciannovesim",
  "ventesim",
]
