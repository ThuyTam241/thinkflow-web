import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import PrimaryButton from "./buttons/PrimaryButton";

const Table = ({ data, columns, totalCount, pagination, setPagination }) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(next);
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(totalCount / pagination.pageSize),
  });

  return (
    <>
      {data ? (
        <div className="space-y-10 h-full flex flex-col px-10">
          <table className="w-full border-collapse">
            <thead className="border-gallery border-b text-left">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      colSpan={header.colSpan}
                      key={header.id}
                      className="text-ebony-clay font-body px-5 py-4 text-sm font-bold uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-gallery divide-y">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="odd:bg-hawkes-blue/15">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="font-body text-gravel p-5 text-base"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-gravel font-body text-base">
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
              of <strong>{table.getPageCount()}</strong>
            </span>

            <div className="flex items-center gap-4">
              <PrimaryButton
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                color="blue"
                label="<"
              />
              <PrimaryButton
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                color="blue"
                label=">"
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="font-body text-ebony-clay text-center text-sm italic">
          You don't have any archived resources yet.
        </p>
      )}
    </>
  );
};

export default Table;
