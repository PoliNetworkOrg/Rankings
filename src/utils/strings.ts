export function capitalizeWords(str: string): string {
  const words = str.split(/\b/)
  const capitalizedWords = words.map(word => {
    const firstLetter = word.charAt(0).toUpperCase()
    const restOfWord = word.slice(1).toLowerCase()
    return firstLetter + restOfWord
  })
  return capitalizedWords.join("")
}

export function containsOnlyNumbers(input?: string): boolean {
  if (!input) return false
  return /^[0-9]+$/.test(input)
}
