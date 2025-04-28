import { ArchiveRestore, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  deleteNoteApi,
  getAllUserArchivedResourcesApi,
  unArchiveNoteApi,
} from "../../services/api.service";
import { useEffect, useMemo, useState } from "react";
import IconButton from "../../components/ui/buttons/IconButton";
import notify from "../../components/ui/CustomToast";
import Table from "../../components/ui/Table";
import { useOutletContext } from "react-router";

const ArchivedResources = () => {
  const { isExpanded, setIsExpanded } = useOutletContext();
  const [archivedResourcesListData, setArchivedResourcesListData] = useState(
    [],
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const [totalResources, setTotalResources] = useState(0);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const loadArchivedResourcesList = async (pageIndex) => {
    setIsLoadingTable(true);
    const page = pageIndex + 1;
    const res = await getAllUserArchivedResourcesApi(page, pagination.pageSize);

    if (res.data) {
      setArchivedResourcesListData(res.data);
      setTotalResources(res.paging.total);
    }
    setIsLoadingTable(false);
  };

  useEffect(() => {
    loadArchivedResourcesList(pagination.pageIndex);
  }, [pagination.pageIndex]);

  const startIndex = pagination.pageIndex * pagination.pageSize;

  const columns = useMemo(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => startIndex + row.index + 1,
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "created_at",
        header: "Date Created",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-10">
            <IconButton
              size="w-5 h-5"
              onClick={() => handleRestore(row.original.id)}
              icon={ArchiveRestore}
            />
            <IconButton
              size="w-5 h-5"
              onClick={() => handleDelete(row.original.id)}
              icon={Trash2}
            />
          </div>
        ),
      },
    ],
    [pagination.pageIndex],
  );

  const refreshListAfterChange = async () => {
    const totalAfter = totalResources - 1;
    const maxPage = Math.ceil(totalAfter / pagination.pageSize);

    let newPageIndex = pagination.pageIndex;

    if (pagination.pageIndex >= maxPage && maxPage > 0) {
      newPageIndex = Math.max(0, maxPage - 1);
    }

    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));

    await loadArchivedResourcesList(newPageIndex);
  };

  const handleRestore = async (noteId) => {
    const res = await unArchiveNoteApi(noteId);
    if (res.data) {
      notify("success", "Note restored!", "", "var(--color-silver-tree)");
      await refreshListAfterChange();
    } else {
      notify("error", "Restore note failed", "", "var(--color-crimson-red)");
    }
  };

  const handleDelete = async (noteId) => {
    const res = await deleteNoteApi(noteId);
    if (res.data) {
      notify("success", "Note deleted!", "", "var(--color-silver-tree)");
      await refreshListAfterChange();
    } else {
      notify("error", "Delete note failed", "", "var(--color-crimson-red)");
    }
  };

  return (
    <div className="h-full rounded-md p-6 ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2.5">
          <IconButton
            customStyle="text-ebony-clay stroke-2"
            size="w-5 h-5"
            onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? ChevronLeft : ChevronRight}
          />
          <h2 className="font-body text-ebony-clay text-xl font-semibold">
            Archived Notes
          </h2>
        </div>
      </div>
      <Table
        data={archivedResourcesListData}
        columns={columns}
        totalCount={totalResources}
        pagination={pagination}
        setPagination={setPagination}
        isLoadingTable={isLoadingTable}
      />
    </div>
  );
};

export default ArchivedResources;
