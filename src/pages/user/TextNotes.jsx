import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import IconButton from "../../components/ui/buttons/IconButton";
import NoteForm from "../../components/ui/NoteForm";
import { Tooltip } from "react-tooltip";
import NoteCardSkeleton from "../../components/ui/skeleton/NoteCardSkeleton";
import { getAllUserNotes, getTextNoteApi } from "../../services/api.service";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";

const MyNotes = () => {
  const [activeNote, setActiveNote] = useState();
  const [isInitialLoadingNotes, setIsInitialLoadingNotes] = useState(true);
  const [isLoadMoreNotes, setIsLoadMoreNotes] = useState(false);
  const [notesListData, setNotesListData] = useState([]);
  const [nextCursor, setNextCursor] = useState();
  const [totalNotes, setTotalNotes] = useState(0);

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

  const handleActiveNote = async (note) => {
    const res = await getTextNoteApi(note.id);
    if (res.data) {
      setActiveNote({
        id: res.data.id,
        note_id: note.id,
        title: note.title,
        date: note.created_at,
        text_content: res.data.text_content,
      });
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
              onClick={() => setActiveNote(null)}
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
                  onClick={() => handleActiveNote(note)}
                  className={`mb-3 cursor-pointer rounded-md border px-4 py-3 ${note.id === activeNote?.note_id ? "bg-hawkes-blue/30 border-indigo/10 dark:bg-[#0A0930]" : "border-gallery"}`}
                >
                  <h3
                    className={`font-body line-clamp-1 text-base font-medium transition-all duration-300 ease-in-out ${note.id === activeNote?.note_id ? "text-indigo dark:text-white" : "text-ebony-clay"}`}
                  >
                    {note.title}
                  </h3>
                  <span
                    className={`font-body mt-1.5 text-xs transition-all duration-300 ease-in-out ${note.id === activeNote?.note_id ? "text-indigo dark:text-white" : "text-silver-chalice"}`}
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

      {/* Write note */}
      <div className="w-full rounded-md bg-white p-8 dark:bg-[#16163B]">
        <NoteForm activeNote={activeNote} loadNotesList={loadNotesList} />
      </div>
    </div>
  );
};

export default MyNotes;
