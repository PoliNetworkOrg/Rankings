import CustomMap from "./CustomMap"
import { capitaliseWords } from "./strings/capitalisation"
import { numberToOrdinalString, numberToRoman } from "./strings/numbers"
import type { PhaseGroups, PhaseLink } from "./types/data/phase"
import type { IndexEntry } from "./types/data/ranking"

export function getPhaseGroups(index: IndexEntry[]): PhaseGroups {
  const phaseGroups = new CustomMap<number, PhaseLink[]>()

  index.forEach((entry) => {
    const primary = entry.phase.primary
    const arr = phaseGroups.get(primary) ?? []
    arr.push({ ...entry.phase, id: entry.id })
    phaseGroups.set(primary, arr)
  })

  console.debug({ phaseGroups: phaseGroups })
  return phaseGroups
}

export const phaseGroupLabel = (primary: number) =>
  primary === 0
    ? "Fase Generale"
    : capitaliseWords(`${numberToOrdinalString(primary, "a")} fase`)

export const phaseLinkLabel = (p: PhaseLink) =>
  p.secondary === 0
    ? p.stripped
    : `${numberToRoman(p.secondary)} Graduatoria ${p.isExtraEu ? "(Extra-EU)" : ""}`.trimEnd()
