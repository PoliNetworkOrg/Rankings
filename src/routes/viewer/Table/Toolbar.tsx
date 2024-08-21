import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdDownload } from "react-icons/md";
import { FilterBtn } from "./FilterBtn";
import { enrollStatusOpts, enrollAllowedOpts } from "./columns";
import { StudentResultKeys } from ".";
import StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult";
import { sha256 } from "@/utils/strings/crypto";

type Props = {
  has: Record<StudentResultKeys, boolean>;
  table: Table<StudentResult>;
  onCsvClick: () => void;
};

export function Toolbar({ has, onCsvClick, table }: Props) {
  const enrollStatusCol = table.getColumn("enrollStatus");
  const enrollAllowedCol = table.getColumn("enrollAllowed");

  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-4 max-sm:items-start max-2xs:flex-col">
      {table.getColumn("id") && (
        <Input
          className="w-full sm:max-w-[300px]"
          placeholder="Filter per matricola..."
          onChange={async (event) => {
            const input = event.target.value;
            const hash = await sha256(event.target.value);
            table.getColumn("id")?.setFilterValue(input ? hash : undefined);
          }}
        />
      )}
      <div className="flex flex-1 justify-start gap-4 max-xs:flex-wrap">
        {has.enrollAllowed && enrollAllowedCol && (
          <FilterBtn
            column={enrollAllowedCol}
            title="Immatricolabile"
            options={enrollAllowedOpts}
          />
        )}
        {has.enrollStatus && enrollStatusCol && (
          <FilterBtn
            column={enrollStatusCol}
            title="Stato"
            options={enrollStatusOpts}
          />
        )}
      </div>
      <div className="flex justify-end ">
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={onCsvClick}
        >
          <MdDownload size={20} />
          <span className="max-sm:hidden">Download CSV</span>
        </Button>
      </div>
    </div>
  );
}
