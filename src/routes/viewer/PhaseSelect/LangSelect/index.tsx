import { Removable } from "@/components/custom-ui/Removable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Lang = "ITA" | "ENG";
const langs: { label: JSX.Element; value: Lang }[] = [
  {
    label: <span>&#x1F1EE;&#x1F1F9;</span>,
    value: "ITA",
  },
  {
    label: <span>&#x1F1EC;&#x1F1E7;</span>,
    value: "ENG",
  },
];

export type LangSelectProps = {
  canChoose: boolean;
  selectedLang: Lang;
  onChange: (newLang: Lang) => void;
};

export default function LangSelect({
  canChoose,
  selectedLang,
  onChange,
}: LangSelectProps) {
  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Lingua</p>
      {canChoose ? (
        <Tabs
          value={selectedLang}
          onValueChange={(v) => onChange(v as Lang)}
          className="flex flex-1"
        >
          <TabsList className="flex overflow-x-hidden">
            {langs.map((lang) => (
              <TabsTrigger
                className="block"
                value={lang.value}
                key={lang.value}
              >
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : (
        <Removable showRemove={false}>
          {langs.find((l) => l.value === selectedLang).label}
        </Removable>
      )}
    </div>
  );
}
