import CustomMap from "../CustomMap";
import { PhaseLink } from "../types/data/parsed/Index/RankingFile";

export function sortIngArcPhases(a: PhaseLink, b: PhaseLink): number {
  if (a.order.primary && b.order.primary && a.order.primary !== b.order.primary)
    return a.order.primary - b.order.primary;

  if (!a.order.secondary || !b.order.secondary) {
    // check if anticipata
    return 0;
  }
  if (a.order.secondary !== b.order.secondary)
    return a.order.secondary - b.order.secondary;

  if (a.order.extraEu) return 1; // put a after b
  if (b.order.extraEu) return -1; // put a before b

  return 0;
}

export function sortDesUrbPhases(a: PhaseLink, b: PhaseLink): number {
  if (a.order.primary && b.order.primary && a.order.primary !== b.order.primary)
    return a.order.primary - b.order.primary;

  if (a.order.anticipata) return -1;
  if (b.order.anticipata) return 1;

  const ap = a.order.phase.toLowerCase();
  const bp = b.order.phase.toLowerCase();

  const aNum = DesUrbPhaseMap.get(ap);
  const bNum = DesUrbPhaseMap.get(bp);

  if (!aNum && !bNum) return 0;
  if (!aNum) return 1;
  if (!bNum) return -1;

  return aNum - bNum;
}

const DesUrbPhaseMap = new CustomMap<string, number>([
  ["anticipata", 1],
  ["anticipato", 1],
  ["standard", 2],
  ["ripescaggio", 3],
  ["extra-ue", 4],
]);
