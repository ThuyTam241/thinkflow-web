import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import CreateNoteIcon from "../../assets/icons/create-note-icon.svg";
import NoteCardSkeleton from "./skeleton/NoteCardSkeleton";
import { Tooltip } from "react-tooltip";
import SearchBar from "./SearchBar";
import IconButton from "./buttons/IconButton";
import { PulseLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fragment } from "react";

const ListNotes = ({
  isExpanded,
  setIsExpanded,
  isInitialLoadingNotes,
  notesListData,
  totalNotes,
  handleCreateNote,
  isLoadMoreNotes,
  handleLoadMoreNotes,
  nextCursor,
  isFetchingNote,
  activeNoteId,
  setActiveNoteId,
}) => {
  return (
    <>
      {isInitialLoadingNotes ? (
        <NoteCardSkeleton />
      ) : (
        <div className="h-screen w-80 shrink-0 border-r border-gray-200 bg-slate-50 dark:bg-[#16163B]/25 dark:border-gray-100/20 ">
          <div className="space-y-3 p-6 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5">
                <IconButton
                  customStyle="text-ebony-clay stroke-2"
                  size="w-5 h-5"
                  onClick={() => setIsExpanded(!isExpanded)}
                  icon={isExpanded ? ChevronLeft : ChevronRight}
                />
                <h2 className="font-body text-ebony-clay text-xl font-semibold">
                  All Notes
                </h2>
              </div>
              {handleCreateNote && (
                <IconButton
                  onClick={handleCreateNote}
                  src={CreateNoteIcon}
                  data-tooltip-id="add-note-tooltip"
                  data-tooltip-content="Add New Note"
                />
              )}
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
              <SearchBar />
              <IconButton size="w-5 h-5" icon={ListFilter} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body text-silver-chalice text-sm/[20px]">
                {totalNotes}/{totalNotes} notes
              </span>
              {isLoadMoreNotes && (
                <PulseLoader color="var(--color-cornflower-blue)" size={5} />
              )}
            </div>
          </div>
          {notesListData.length > 0 ? (
            <div
              id="scrollableListNotes"
              className="no-scrollbar max-h-[730px] space-y-3 overflow-y-auto border-y border-gray-200 dark:border-gray-100/20"
            >
              <InfiniteScroll
                dataLength={notesListData.length}
                next={handleLoadMoreNotes}
                hasMore={!!nextCursor}
                endMessage={
                  <p className="font-body text-ebony-clay text-center text-sm italic">
                    No more notes.
                  </p>
                }
                scrollableTarget="scrollableListNotes"
              >
                {notesListData.map((note, index) => (
                  <Fragment key={note.id}>
                    <div
                      onClick={() => {
                        if (isFetchingNote || note.id === activeNoteId) return;
                        setActiveNoteId(note.id);
                      }}
                      className={`relative cursor-pointer px-6 py-3 ${note.id === activeNoteId ? "bg-cornflower-blue/10" : ""}`}
                    >
                      <div
                        className={`absolute top-0 bottom-0 left-0 h-full w-1 transition-colors duration-300 ease-in-out ${note.id === activeNoteId ? "bg-cornflower-blue/80" : "bg-transparent"}`}
                      ></div>
                      <h3
                        className={`font-body line-clamp-2 text-base font-medium transition-all duration-300 ease-in-out ${note.id === activeNoteId ? "text-indigo dark:text-white" : "text-ebony-clay"}`}
                      >
                        {note.title}
                      </h3>
                      <span
                        className={`font-body mt-2 text-xs transition-all duration-300 ease-in-out ${note.id === activeNoteId ? "text-indigo dark:text-white" : "text-silver-chalice"}`}
                      >
                        {note.created_at}
                      </span>
                    </div>
                    {index !== notesListData.length - 1 && (
                      <div className="flex justify-center">
                        <div className="h-px w-[272px] bg-gray-200 dark:bg-gray-100/20"></div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </InfiniteScroll>
            </div>
          ) : (
            <p className="font-body text-ebony-clay mt-10 w-full text-center text-sm italic">
              You don't have any notes yet.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ListNotes;
