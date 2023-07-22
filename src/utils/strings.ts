export function containsOnlyNumbers(input?: string): boolean {
  if (!input) return false;
  return /^[0-9]+$/.test(input);
}

