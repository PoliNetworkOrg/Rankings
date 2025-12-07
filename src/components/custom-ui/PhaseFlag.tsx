import type { PhaseLink } from "@/utils/types/data/parsed/Index/RankingFile"

export default function PhaseFlag({ phase }: { phase: PhaseLink }) {
  return phase.order.isEnglish ? (
    <span>&#x1F1EC;&#x1F1E7;</span>
  ) : (
    <span>&#x1F1EE;&#x1F1F9;</span>
  )
}
