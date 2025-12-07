import type { NewPhase } from "@/utils/types/data/json/new-ranking"

export default function PhaseFlag({ phase }: { phase: NewPhase }) {
  return phase.language === "EN" ? (
    <span>&#x1F1EC;&#x1F1E7;</span>
  ) : (
    <span>&#x1F1EE;&#x1F1F9;</span>
  )
}
