import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdDownload } from "react-icons/md";
import { FilterBtn } from "./FilterBtn";
import { enrollStatusOpts, enrollAllowedOpts } from "./columns";
import { StudentResultKeys } from ".";
import StudentResult from "@/utils/types/data/parsed/Ranking/StudentResult";

type Props = {
  has: Record<StudentResultKeys, boolean>;
  table: Table<StudentResult>;
  onCsvClick: () => void;
};

export function Toolbar({ has, onCsvClick, table }: Props) {
  const enrollStatusCol = table.getColumn("enrollStatus");
  const enrollAllowedCol = table.getColumn("enrollAllowed");

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex flex-1 items-center justify-start gap-4">
        {table.getColumn("matricola-hash") && (
          <Input
            className="max-w-[300px]"
            placeholder="Filter per matricola..."
            value={
              (table.getColumn("matricola-hash")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("matricola-hash")
                ?.setFilterValue(event.target.value)
            }
          />
        )}
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
            title="Stato immatricolazione"
            options={enrollStatusOpts}
          />
        )}
      </div>
      <Button
        variant="outline"
        className="whitespace-nowrap"
        onClick={onCsvClick}
      >
        <MdDownload size={20} />
        <span className="max-sm:hidden">Download CSV</span>
      </Button>
    </div>
  );
}
