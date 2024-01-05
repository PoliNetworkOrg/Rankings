import School from "@/utils/types/data/School";
import { Link } from "@tanstack/react-router";
import { LuHome, LuArrowRight } from "react-icons/lu";

type Props = {
  school?: School;
  year?: number;
};

export default function PathBreadcrumb({ school, year }: Props) {
  if (!school) return <></>;
  return (
    <div className="flex h-8 w-full items-center gap-2 text-lg">
      <Link to="/home">
        <LuHome size={18} />
      </Link>
      {school && (
        <>
          <LuArrowRight size={18} />
          <Link to="/home/$school" params={{ school }}>
            {school}
          </Link>
        </>
      )}
      {year && (
        <>
          <LuArrowRight size={18} />
          <Link to="/home/$school" params={{ school }}>
            {year}
          </Link>
        </>
      )}
    </div>
  );
}
