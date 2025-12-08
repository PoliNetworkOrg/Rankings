import type CustomMap from "@/utils/CustomMap"

export type Phase = {
  raw: string
  stripped: string
  primary: number
  secondary: number
  language: "IT" | "EN"
  isExtraEu: boolean
}

export type PhaseLink = Phase & { id: string }
export type PhaseGroups = CustomMap<number, PhaseLink[]>
