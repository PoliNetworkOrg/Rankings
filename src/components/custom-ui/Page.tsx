import { cn } from "@/utils/ui";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  paddingTop?: boolean;
}

export default function Page({
  children,
  className = "",
  fullWidth = false,
  paddingTop = true,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col items-center px-4",
        fullWidth ? "max-w-full" : "mx-auto max-w-7xl",
        paddingTop ? "py-4 max-sm:py-3" : "pb-4 max-sm:pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
