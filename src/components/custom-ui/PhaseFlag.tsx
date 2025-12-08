import type { Phase } from "@/utils/types/data/phase"

export default function PhaseFlag({ phase }: { phase: Phase }) {
  return phase.language === "EN" ? (
    <span>&#x1F1EC;&#x1F1E7;</span>
  ) : (
    <span>&#x1F1EE;&#x1F1F9;</span>
  )
}
