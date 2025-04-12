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
  const [cursorList, setCursorList] = useState([""]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const [totalResources, setTotalResources] = useState(0);

  const loadArchivedResourcesList = async (pageIndex, pageSize) => {
    const cursor = cursorList[pageIndex];
    const res = await getAllUserArchivedResourcesApi(
      cursor,
      pagination.pageSize,
    );
    if (res.data) {
      setArchivedResourcesListData(res.data);
      setTotalResources(res.paging.total);
      const nextCursor = res.paging.next_cursor;
      if (nextCursor && !cursorList.includes(nextCursor)) {
        setCursorList((prev) => [...prev, nextCursor]);
      }
    }
  };

  useEffect(() => {
    loadArchivedResourcesList(pagination.pageIndex);
  }, [pagination.pageIndex]);

  const columns = useMemo(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
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
        cell: ({ row }) => {
          return (
            <div className="flex gap-10">
              <IconButton
                size="w-5 h-5"
                data-tooltip-id="restore-tooltip"
                data-tooltip-content="Restore"
                onClick={() => handleRestore(row.original.id)}
                icon={ArchiveRestore}
              />
              <IconButton
                size="w-5 h-5"
                data-tooltip-id="delete-tooltip"
                data-tooltip-content="Delete"
                onClick={() => handleDelete(row.original.id)}
                icon={Trash2}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const handleRestore = async (noteId) => {
    const res = await unArchiveNoteApi(noteId);
    if (res.data) {
      notify("success", "Note restored!", "", "var(--color-silver-tree)");
      await loadArchivedResourcesList();
    } else {
      notify("error", "Restore note failed", "", "var(--color-crimson-red)");
    }
  };

  const handleDelete = async (noteId) => {
    const res = await deleteNoteApi(noteId);
    if (res.data) {
      notify("success", "Note deleted!", "", "var(--color-silver-tree)");
      await loadArchivedResourcesList();
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
