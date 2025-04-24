import {
  getAllAudioApi,
  getAllUserSharedNotesApi,
  getTextNoteByNoteIdApi,
  updateNoteApi,
} from "../../services/api.service";
import notify from "../../components/ui/CustomToast";
import Skeleton from "react-loading-skeleton";
import TextNotes from "../../components/ui/TextNotes";
import AudioNotes from "../../components/ui/AudioNotes";
import NoteCardSkeleton from "../../components/ui/skeleton/NoteCardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import TextArea from "../../components/ui/inputs/TextArea";
import Avatar from "../../components/ui/Avatar";

dayjs.extend(customParseFormat);

const SharedNotes = () => {
  const [activeSharedNoteId, setActiveSharedNoteId] = useState(
    sessionStorage.getItem("activeSharedNoteId") || null,
  );
  const [sharedNoteDetail, setSharedNoteDetail] = useState(null);

  const [isInitialLoadingSharedNotes, setIsInitialLoadingSharedNotes] =
    useState(true);
  const [isLoadMoreSharedNotes, setIsLoadMoreSharedNotes] = useState(false);
  const [isFetchingSharedNote, setIsFetchingSharedNote] = useState(false);

  const [sharedNotesListData, setSharedNotesListData] = useState([]);
  const [nextCursor, setNextCursor] = useState();
  const [totalSharedNotes, setTotalSharedNotes] = useState(0);

  const [activeSharedNoteType, setActiveSharedNoteType] = useState(
    sessionStorage.getItem("activeSharedNoteType") || "text",
  );
  const tabs = [
    { id: "text", label: "Text" },
    { id: "audio", label: "Audio" },
  ];

  useEffect(() => {
    sessionStorage.setItem("activeSharedNoteType", activeSharedNoteType);
  }, [activeSharedNoteType]);

  const { register, reset, getValues, setValue } = useForm();

  const loadSharedNotesList = async (nextCursor, isInitial = false) => {
    if (isInitial) {
      setIsInitialLoadingSharedNotes(true);
    } else {
      setIsLoadMoreSharedNotes(true);
    }

    const res = await getAllUserSharedNotesApi(nextCursor);

    if (isInitial) {
      setIsInitialLoadingSharedNotes(false);
    } else {
      setIsLoadMoreSharedNotes(false);
    }

    if (res.data) {
      setSharedNotesListData(
        isInitial ? res.data : (prev) => [...prev, ...res.data],
      );
      setNextCursor(res.paging.next_cursor);
      setTotalSharedNotes(res.paging.total);
    }
  };

  const handleLoadMoreSharedNotes = async () => {
    if (!nextCursor) return;
    loadSharedNotesList(nextCursor);
  };

  useEffect(() => {
    loadSharedNotesList(undefined, true);
  }, []);

  const getSharedNoteDetail = async () => {
    if (isFetchingSharedNote) return;
    setIsFetchingSharedNote(true);

    const note = sharedNotesListData.find(
      (note) => note.id === activeSharedNoteId,
    );
    if (!note) {
      setIsFetchingSharedNote(false);
      return;
    }

    setSharedNoteDetail({
      id: note.id,
      title: note.title,
      date: note.created_at,
      owner: note.user,
      permission: "read",
      text_note: null,
      audio_note: [],
    });

    const textContent = await getTextNoteByNoteIdApi(note.id);
    if (textContent.data) {
      setSharedNoteDetail((prev) => ({
        ...prev,
        text_note: {
          id: textContent.data.id,
          text_content: textContent.data.text_content,
          summary: textContent.data.summary,
        },
      }));
    }

    const audioContent = await getAllAudioApi(note.id);
    if (audioContent.data) {
      const mappedAudioData = audioContent.data.map((item) => ({
        id: item.id,
        file_url: item.file_url,
        transcript: item.transcript,
        summary: item.summary,
      }));
      setSharedNoteDetail((prev) => ({
        ...prev,
        audio_note: mappedAudioData,
      }));
    }

    setIsFetchingSharedNote(false);
  };

  useEffect(() => {
    if (sharedNotesListData.length === 0) {
      sessionStorage.removeItem("activeSharedNoteId");
      setSharedNoteDetail(null);
      return;
    }

    if (!activeSharedNoteId) {
      const firstNoteId = sharedNotesListData[0].id;
      setActiveSharedNoteId(firstNoteId);
      sessionStorage.setItem("activeSharedNoteId", firstNoteId);
      return;
    }

    const note = sharedNotesListData.find((n) => n.id === activeSharedNoteId);
    if (!note) return;

    const hasLoadedSameNote = sharedNoteDetail?.id === note.id;
    if (hasLoadedSameNote && sharedNoteDetail?.text_note) return;

    sessionStorage.setItem("activeSharedNoteId", activeSharedNoteId);
    getSharedNoteDetail();
  }, [activeSharedNoteId, sharedNotesListData]);

  useEffect(() => {
    if (sharedNoteDetail) {
      reset({
        title: sharedNoteDetail.title,
      });
    }
  }, [sharedNoteDetail]);

  const updateTitleSharedNote = async (currentTitle) => {
    const res = await updateNoteApi(currentTitle, activeSharedNoteId);
    if (!res.data) {
      notify(
        "error",
        "Updated title note failed",
        "",
        "var(--color-crimson-red)",
      );
      return;
    }
    setSharedNotesListData((prev) =>
      prev.map((note) =>
        note.id === activeSharedNoteId
          ? { ...note, title: currentTitle }
          : note,
      ),
    );
  };

  return (
    <div className="flex h-full gap-6">
      {isInitialLoadingSharedNotes ? (
        <NoteCardSkeleton />
      ) : sharedNotesListData.length > 0 ? (
        <div className="h-fit w-[280px] flex-shrink-0 rounded-md bg-white p-6 dark:bg-[#16163B]">
          <div className="mb-3 space-y-3">
            <h2 className="font-body text-ebony-clay text-lg font-semibold">
              All Notes
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-body text-silver-chalice text-sm/[20px]">
                {sharedNotesListData.length}/{totalSharedNotes} notes
              </span>
              {isLoadMoreSharedNotes && (
                <PulseLoader color="var(--color-cornflower-blue)" size={5} />
              )}
            </div>
          </div>
          <div
            id="scrollableSharedListNotes"
            className="no-scrollbar max-h-[calc(100vh-232px)] space-y-3 overflow-y-auto"
          >
            <InfiniteScroll
              dataLength={sharedNotesListData.length}
              next={handleLoadMoreSharedNotes}
              hasMore={!!nextCursor}
              endMessage={
                <p className="font-body text-ebony-clay text-center text-sm italic">
                  No more notes.
                </p>
              }
              scrollableTarget="scrollableSharedListNotes"
            >
              {sharedNotesListData.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    if (isFetchingSharedNote || note.id === activeSharedNoteId)
                      return;
                    setActiveSharedNoteId(note.id);
                  }}
                  className={`mb-3 cursor-pointer rounded-md border px-4 py-3 ${note.id === activeSharedNoteId ? "bg-hawkes-blue/30 border-indigo/10 dark:bg-[#0A0930]" : "border-gallery"}`}
                >
                  <h3
                    className={`font-body line-clamp-1 text-base font-medium transition-all duration-300 ease-in-out ${note.id === activeSharedNoteId ? "text-indigo dark:text-white" : "text-ebony-clay"}`}
                  >
                    {note.title}
                  </h3>
                  <span
                    className={`font-body mt-1.5 text-xs transition-all duration-300 ease-in-out ${note.id === activeSharedNoteId ? "text-indigo dark:text-white" : "text-silver-chalice"}`}
                  >
                    {note.created_at}
                  </span>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      ) : (
        <p className="font-body text-ebony-clay w-full text-center text-sm italic">
          You don't have any notes yet.
        </p>
      )}

      {sharedNoteDetail && (
        <div className="flex w-full flex-col gap-4 rounded-md bg-white p-8 dark:bg-[#16163B]">
          <>
            {/* Title */}
            <div className="flex items-start">
              {sharedNoteDetail.title ? (
                <TextArea
                  style="text-2xl! text-ebony-clay font-semibold max-h-16"
                  rows={1}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                  placeholder="Title"
                  {...register("title")}
                  onBlur={(e) => {
                    const currentTitle = getValues("title").trim();
                    if (currentTitle === "") {
                      setValue("title", sharedNoteDetail.title, {
                        shouldDirty: false,
                      });
                      return;
                    }
                    if (dirtyFields.title) {
                      updateTitleSharedNote(currentTitle);
                    }
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                />
              ) : (
                <Skeleton height={44} containerClassName="flex-1" />
              )}
            </div>

            {/* Created Date */}
            <div className="divide-gallery flex items-center divide-x">
              {/* Created Date */}
              {sharedNoteDetail.date ? (
                <span className="font-body text-silver-chalice pr-8 text-base">
                  Created on{" "}
                  {dayjs(sharedNoteDetail.date, "DD/MM/YYYY").format("MMM D")}
                </span>
              ) : (
                <Skeleton height={16} width={40} />
              )}

              {/* Owner */}
              <div className="flex items-center gap-3 pl-8">
                <span className="font-body text-silver-chalice text-base">
                  Shared by
                </span>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={sharedNoteDetail.owner.avatar?.url}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-body text-silver-chalice text-base">
                    {sharedNoteDetail.owner.first_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="border-b-gallery mb-1 flex w-full border-b">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  onClick={() => setActiveSharedNoteType(tab.id)}
                  className={`flex h-full w-1/2 cursor-pointer items-center justify-center rounded-tl-md rounded-bl-md ${activeSharedNoteType === tab.id ? "bg-white dark:bg-[#16163B]" : ""}`}
                >
                  <span
                    className={`font-body inline-block w-full border-b-2 pt-4 pb-2 text-center text-base whitespace-nowrap transition-all duration-300 ease-in-out ${activeSharedNoteType === tab.id ? "text-indigo border-indigo font-semibold dark:text-white" : "text-gravel border-transparent"}`}
                  >
                    {tab.label}{" "}
                    {tab.label === "Audio" && sharedNoteDetail
                      ? ` (${sharedNoteDetail.audio_note?.length})`
                      : ""}
                  </span>
                </div>
              ))}
            </div>

            {activeSharedNoteType === "text" && (
              <TextNotes
                noteDetail={sharedNoteDetail}
                setNoteDetail={setSharedNoteDetail}
              />
            )}

            {activeSharedNoteType === "audio" && (
              <AudioNotes
                noteDetail={sharedNoteDetail}
                setNoteDetail={setSharedNoteDetail}
              />
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default SharedNotes;
