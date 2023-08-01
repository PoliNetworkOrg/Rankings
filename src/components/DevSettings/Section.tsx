import Separator from "./Separator";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  showHr?: boolean;
};

export default function Section({
  title,
  children,
  showHr = true,
}: SectionProps) {
  return (
    <>
      {showHr && <Separator />}
      <div className="flex w-full flex-col items-start gap-2">
        <h4 className="text-lg font-bold">{title}</h4>
        {children}
      </div>
    </>
  );
}
