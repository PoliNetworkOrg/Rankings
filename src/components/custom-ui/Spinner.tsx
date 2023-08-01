import { HTMLAttributes, useContext } from "react";
import { PuffLoader } from "react-spinners";
import DarkModeContext from "@/contexts/DarkModeContext";
import { cn } from "@/utils/ui";

type Props = HTMLAttributes<HTMLDivElement> & {
  loading?: boolean;
};

export default function Spinner({
  loading = true,
  className,
  ...props
}: Props) {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div
      className={cn("flex flex-1 items-center justify-center", className)}
      {...props}
    >
      <PuffLoader
        color={isDarkMode ? "#ffffff" : "#333333"}
        loading={loading}
      />
    </div>
  );
}
