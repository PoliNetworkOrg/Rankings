export function convertQuoteToAccent(str: string): string {
  return str
    .replaceAll(/(A'|a'|À|Á)/g, "à")
    .replaceAll(/(E'|e'|È|É)/g, "è")
    .replaceAll(/(I'|i'|Ì)/g, "ì")
    .replaceAll(/(O'|o'|Ò)/g, "ò")
    .replaceAll(/(U'|u'|Ù)/g, "ù")
}

export function capitaliseWords(
  str: string,
  doConvertQuoteToAccent = true
): string {
  const words = str.toLowerCase().split(/\b/)
  const capitalizedWords = words.map((word) => capitaliseWithRules(word))
  const joined = capitalizedWords.join("")
  return doConvertQuoteToAccent ? convertQuoteToAccent(joined) : joined
}

function capitaliseWithRules(word: string): string {
  if (DO_NOT_CAPITALISE.includes(word)) return word
  if (DO_UPPER.includes(word)) return word.toUpperCase()
  return capitalise(word)
}

function capitalise(word: string): string {
  const firstLetter = word.charAt(0).toUpperCase()
  const restOfWord = word.slice(1).toLowerCase()
  return firstLetter + restOfWord
}

const DO_UPPER = ["ue", "eu"]

const DO_NOT_CAPITALISE = [
  "e",
  "il",
  "lo",
  "l",
  "la",
  "i",
  "gli",
  "le",
  "di",
  "del",
  "dello",
  "dell",
  "della",
  "dei",
  "degli",
  "delle",
  "a",
  "al",
  "allo",
  "all",
  "alla",
  "ai",
  "agli",
  "alle",
  "da",
  "dal",
  "dallo",
  "dall",
  "dalla",
  "dai",
  "dagli",
  "dalle",
  "in",
  "nel",
  "nello",
  "nell",
  "nella",
  "nei",
  "negli",
  "nelle",
  "su",
  "sul",
  "sullo",
  "sull",
  "sulla",
  "sui",
  "sugli",
  "sulle",
  "per",
  "pei",
  "con",
  "coi",
  "col",
  "sopra",
  "sotto",
  "dentro",
  "fuori",
  "vicino",
  "lontano",
  "davanti",
  "ietro",
  "presso",
  "verso",
  "oltre",
  "attraverso",
  "lungo",
  "durante",
  "entro",
  "avanti",
  "oltre",
  "senza",
  "eccetto",
  "tranne",
  "fuorché",
  "salvo",
  "contro",
  "incontro",
  "insieme",
  "malgrado",
  "nonostante",
  "secondo",
  "circa",
  "non",
  "chè",
  "perché",
  "giacché",
  "poiché",
  "siccome",
  "perocché",
  "che",
  "benché",
  "sebbene",
  "quantunque",
  "se",
  "ove",
  "quando",
  "purché",
  "qualora",
  "seppure",
  "cosicché",
  "sicché",
  "talché",
  "come",
  "fuorché",
  "senonché",
  "nonché",
  "tranne",
  "quale",
  "così",
  "siccome",
  "comunque",
  "allorché",
  "finché",
  "dacché",
  "appena",
  "allorquando",
]
