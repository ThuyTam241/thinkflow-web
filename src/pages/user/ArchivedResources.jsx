import { ArchiveRestore, Trash2 } from "lucide-react";
import {
  deleteNoteApi,
  getAllUserArchivedResourcesApi,
  unArchiveNoteApi,
} from "../../services/api.service";
import { useEffect, useMemo, useState } from "react";
import IconButton from "../../components/ui/buttons/IconButton";
import notify from "../../components/ui/CustomToast";
import Table from "../../components/ui/Table";

const ArchivedResources = () => {
  const [archivedResourcesListData, setArchivedResourcesListData] = useState(
    [],
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const [totalResources, setTotalResources] = useState(0);

  const loadArchivedResourcesList = async (pageIndex) => {
    const page = pageIndex + 1;
    const res = await getAllUserArchivedResourcesApi(page, pagination.pageSize);

    if (res.data) {
      setArchivedResourcesListData(res.data);
      setTotalResources(res.paging.total);
    }
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
    <div className="h-full rounded-md bg-white px-10 py-8 dark:bg-[#16163B]">
      <Table
        data={archivedResourcesListData}
        columns={columns}
        totalCount={totalResources}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default ArchivedResources;
