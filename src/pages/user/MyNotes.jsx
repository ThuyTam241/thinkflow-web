import { useEffect, useState } from "react";
import { Archive, CalendarDays, CirclePlus } from "lucide-react";
import IconButton from "../../components/ui/buttons/IconButton";
import TextNotes from "../../components/ui/TextNotes";
import { Tooltip } from "react-tooltip";
import NoteCardSkeleton from "../../components/ui/skeleton/NoteCardSkeleton";
import {
  archiveNoteApi,
  createNewNoteApi,
  getAllUserNotes,
  getTextNoteByNoteIdApi,
  updateNoteApi,
} from "../../services/api.service";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";
import TextInput from "../../components/ui/inputs/TextInput";
import { useForm } from "react-hook-form";
import notify from "../../components/ui/CustomToast";
import Skeleton from "react-loading-skeleton";

const MyNotes = () => {
  const [activeNoteId, setActiveNoteId] = useState(
    sessionStorage.getItem("activeNoteId") || null,
  );
  const [noteDetail, setNoteDetail] = useState(null);

  const [isInitialLoadingNotes, setIsInitialLoadingNotes] = useState(true);
  const [isLoadMoreNotes, setIsLoadMoreNotes] = useState(false);

  const [notesListData, setNotesListData] = useState([]);
  const [nextCursor, setNextCursor] = useState();
  const [totalNotes, setTotalNotes] = useState(0);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const { register, reset, getValues } = useForm({
    defaultValues: {
      title: "",
      date: today,
    },
  });

  const loadNotesList = async (nextCursor, isInitial = false) => {
    if (isInitial) {
      setIsInitialLoadingNotes(true);
    } else {
      setIsLoadMoreNotes(true);
    }

    const res = await getAllUserNotes(nextCursor);

    if (isInitial) {
      setIsInitialLoadingNotes(false);
    } else {
      setIsLoadMoreNotes(false);
    }

    if (res.data) {
      setNotesListData(isInitial ? res.data : (prev) => [...prev, ...res.data]);
      setNextCursor(res.paging.next_cursor);
      setTotalNotes(res.paging.total);
    }
  };

  const handleLoadMoreNotes = async () => {
    if (!nextCursor) return;
    loadNotesList(nextCursor);
  };

  useEffect(() => {
    loadNotesList(undefined, true);
  }, []);

  const getNoteDetail = async () => {
    const note = notesListData.find((note) => note.id === activeNoteId);
    if (!note) return;

    setNoteDetail({
      id: note.id,
      title: note.title,
      date: note.created_at,
      text_note: null,
      audio_note: [
        {
          id: "",
          file_url: "",
          transcript: null,
          summary: null,
        },
      ],
    });

    const textContent = await getTextNoteByNoteIdApi(note.id);
    if (textContent.data) {
      setNoteDetail((prev) => ({
        ...prev,
        text_note: {
          id: textContent.data.id,
          text_content: textContent.data.text_content,
          summary: textContent.data.summary,
        },
      }));
    }
  };

  useEffect(() => {
    if (notesListData.length > 0) {
      if (!activeNoteId) {
        const firstId = notesListData[0]?.id;
        sessionStorage.setItem("activeNoteId", firstId);
        setActiveNoteId(firstId);
        return;
      }
      sessionStorage.setItem("activeNoteId", activeNoteId);
      getNoteDetail();
    } else {
      sessionStorage.removeItem("activeNoteId");
      setNoteDetail(null);
    }
  }, [activeNoteId, notesListData]);

  useEffect(() => {
    if (noteDetail) {
      reset({
        title: noteDetail.title,
      });
    }
  }, [noteDetail]);

  const handleCreateNote = async () => {
    const res = await createNewNoteApi();
    if (res.data) {
      notify("success", "Note created!", "", "var(--color-silver-tree)");
      await loadNotesList(undefined, true);
      setActiveNoteId(res.data);
    } else {
      notify("error", "Create note failed", "", "var(--color-crimson-red)");
    }
  };

  const updateTitleNote = async () => {
    const updatedTitle = getValues("title");
    const res = await updateNoteApi(updatedTitle, activeNoteId);
    if (!res.data) {
      notify(
        "error",
        "Updated title note failed",
        "",
        "var(--color-crimson-red)",
      );
      return;
    }
    setNotesListData((prev) =>
      prev.map((note) =>
        note.id === activeNoteId ? { ...note, title: updatedTitle } : note,
      ),
    );
  };

  const handleArchiveNote = async () => {
    const res = await archiveNoteApi(activeNoteId);
    if (res.data) {
      notify("success", "Note archived!", "", "var(--color-silver-tree)");
      setActiveNoteId(null);
      await loadNotesList(undefined, true);
    } else {
      notify("error", "Archive note failed", "", "var(--color-crimson-red)");
    }
  };

  return (
    <div className="flex h-full gap-6">
      <div className="h-fit w-[280px] rounded-md bg-white p-6 dark:bg-[#16163B]">
        <div className="mb-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-ebony-clay text-lg font-semibold">
              All Notes
            </h2>
            <IconButton
              onClick={handleCreateNote}
              data-tooltip-id="add-note-tooltip"
              data-tooltip-content="Add New Note"
              size="w-6 h-6"
              icon={CirclePlus}
            />
            <Tooltip
              id="add-note-tooltip"
              place="top"
              style={{
                backgroundColor: "#6368d1",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
              }}
              className="font-body"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body text-silver-chalice text-sm/[20px]">
              {notesListData.length}/{totalNotes} notes
            </span>
            {isLoadMoreNotes && (
              <PulseLoader color="var(--color-cornflower-blue)" size={5} />
            )}
          </div>
        </div>
        <div
          id="scrollableDiv"
          className="no-scrollbar max-h-[calc(100vh-232px)] space-y-3 overflow-y-auto"
        >
          {isInitialLoadingNotes ? (
            Array(8)
              .fill(0)
              .map((_, index) => <NoteCardSkeleton key={index} />)
          ) : notesListData.length > 0 ? (
            <InfiniteScroll
              dataLength={notesListData.length}
              next={handleLoadMoreNotes}
              hasMore={!!nextCursor}
              endMessage={
                <p className="font-body text-ebony-clay text-center text-sm italic">
                  No more notes.
                </p>
              }
              scrollableTarget="scrollableDiv"
            >
              {notesListData.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                  }}
                  className={`mb-3 cursor-pointer rounded-md border px-4 py-3 ${note.id === activeNoteId ? "bg-hawkes-blue/30 border-indigo/10 dark:bg-[#0A0930]" : "border-gallery"}`}
                >
                  <h3
                    className={`font-body line-clamp-1 text-base font-medium transition-all duration-300 ease-in-out ${note.id === activeNoteId ? "text-indigo dark:text-white" : "text-ebony-clay"}`}
                  >
                    {note.title}
                  </h3>
                  <span
                    className={`font-body mt-1.5 text-xs transition-all duration-300 ease-in-out ${note.id === activeNoteId ? "text-indigo dark:text-white" : "text-silver-chalice"}`}
                  >
                    {note.created_at}
                  </span>
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <p className="font-body text-ebony-clay text-center text-sm italic">
              You don't have any notes yet.
            </p>
          )}
        </div>
      </div>

      <div className="w-full space-y-6 rounded-md bg-white p-8 dark:bg-[#16163B]">
        <div className="relative flex cursor-pointer items-center justify-between gap-10">
          {noteDetail ? (
            <>
              <TextInput
                style="text-2xl px-0! font-body font-semibold outline-none focus:shadow-none"
                placeholder="Title"
                {...register("title")}
                onBlur={updateTitleNote}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              />
              <div className="border-silver-chalice absolute top-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border p-1">
                <IconButton
                  customStyle="text-silver-chalice stroke-[1.5]"
                  size="w-5 h-5"
                  icon={Archive}
                  onClick={handleArchiveNote}
                />
              </div>
            </>
          ) : (
            <Skeleton height={24} containerClassName="flex-1" />
          )}
        </div>

        <div className="border-b-gallery flex items-center gap-10 border-b pb-2">
          <div className="font-body text-silver-chalice flex items-start text-base whitespace-nowrap">
            <CalendarDays className="mr-2 h-5 w-5 stroke-[1.8]" />
            <h3>Date created:</h3>
          </div>
          {noteDetail ? (
            <span className="font-body text-gravel text-base">
              {noteDetail.date}
            </span>
          ) : (
            <Skeleton height={16} width={120} />
          )}
        </div>

        {noteDetail && <TextNotes noteDetail={noteDetail} />}
      </div>
    </div>
  );
};

export default MyNotes;
