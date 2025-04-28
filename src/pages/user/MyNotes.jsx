import { useEffect, useState } from "react";
import { Archive, Ellipsis, Share2 } from "lucide-react";
import IconButton from "../../components/ui/buttons/IconButton";
import TextNotes from "../../components/ui/TextNotes";
import {
  archiveNoteApi,
  createNewNoteApi,
  getAllAudioApi,
  getAllUserNotesApi,
  getNoteMemberApi,
  getTextNoteByNoteIdApi,
  updateNoteApi,
} from "../../services/api.service";
import { useForm } from "react-hook-form";
import notify from "../../components/ui/CustomToast";
import Skeleton from "react-loading-skeleton";
import AudioNotes from "../../components/ui/AudioNotes";
import Avatar from "../../components/ui/Avatar";
import TextArea from "../../components/ui/inputs/TextArea";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ShareNoteModal from "../../components/ui/popup/ShareNoteModal";
import ListNotes from "../../components/ui/ListNotes";
import { useOutletContext } from "react-router";

dayjs.extend(customParseFormat);

const MyNotes = () => {
  const { isExpanded, setIsExpanded } = useOutletContext();
  const [activeNoteId, setActiveNoteId] = useState(
    sessionStorage.getItem("activeNoteId") || null,
  );
  const [noteDetail, setNoteDetail] = useState(null);

  const [isInitialLoadingNotes, setIsInitialLoadingNotes] = useState(true);
  const [isLoadMoreNotes, setIsLoadMoreNotes] = useState(false);
  const [isFetchingNote, setIsFetchingNote] = useState(false);

  const [notesListData, setNotesListData] = useState([]);
  const [nextCursor, setNextCursor] = useState();
  const [totalNotes, setTotalNotes] = useState(0);

  const [activeNoteType, setActiveNoteType] = useState(
    sessionStorage.getItem("activeNoteType") || "text",
  );
  const tabs = [
    { id: "text", label: "Text" },
    { id: "audio", label: "Audio" },
  ];

  const [showOption, setShowOption] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("activeNoteType", activeNoteType);
  }, [activeNoteType]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const {
    register,
    reset,
    getValues,
    setValue,
    control,
    formState: { dirtyFields },
  } = useForm({
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

    const res = await getAllUserNotesApi(nextCursor);

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
    if (isFetchingNote) return;
    setIsFetchingNote(true);

    const note = notesListData.find((note) => note.id === activeNoteId);
    if (!note) {
      setIsFetchingNote(false);
      return;
    }

    setNoteDetail({
      id: note.id,
      title: note.title,
      date: note.created_at,
      owner: note.user,
      permission: "all",
      collaborators: [],
      text_note: null,
      audio_note: [],
    });

    const noteCollaborators = await getNoteMemberApi(note.id);
    if (noteCollaborators.data) {
      setNoteDetail((prev) => ({
        ...prev,
        collaborators: noteCollaborators.data.filter(
          (member) => member.role !== "owner",
        ),
      }));
    }

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

    const audioContent = await getAllAudioApi(note.id);
    if (audioContent.data) {
      const mappedAudioData = audioContent.data.map((item) => ({
        id: item.id,
        file_url: item.file_url,
        transcript: item.transcript,
        summary: item.summary,
      }));
      setNoteDetail((prev) => ({
        ...prev,
        audio_note: mappedAudioData,
      }));
    }

    setIsFetchingNote(false);
  };

  useEffect(() => {
    if (notesListData.length === 0) {
      sessionStorage.removeItem("activeNoteId");
      setNoteDetail(null);
      return;
    }

    if (!activeNoteId) {
      const firstNoteId = notesListData[0].id;
      setActiveNoteId(firstNoteId);
      sessionStorage.setItem("activeNoteId", firstNoteId);
      return;
    }

    const note = notesListData.find((n) => n.id === activeNoteId);
    if (!note) return;

    const hasLoadedSameNote = noteDetail?.id === note.id;
    if (hasLoadedSameNote && noteDetail?.text_note) return;

    sessionStorage.setItem("activeNoteId", activeNoteId);
    getNoteDetail();
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

  const updateTitleNote = async (currentTitle) => {
    const res = await updateNoteApi(currentTitle, activeNoteId);
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
        note.id === activeNoteId ? { ...note, title: currentTitle } : note,
      ),
    );
  };

  const handleArchiveNote = async () => {
    const res = await archiveNoteApi(activeNoteId);
    if (res.data) {
      notify("success", "Note archived!", "", "var(--color-silver-tree)");
      const updatedNotes = notesListData.filter(
        (note) => note.id !== activeNoteId,
      );
      setNotesListData(updatedNotes);
      setTotalNotes(updatedNotes.length);

      const nextActiveNoteId = updatedNotes[0]?.id || null;

      if (nextActiveNoteId) {
        setActiveNoteId(nextActiveNoteId);
        sessionStorage.setItem("activeNoteId", nextActiveNoteId);
      } else {
        setActiveNoteId(null);
        setNoteDetail(null);
        sessionStorage.removeItem("activeNoteId");
      }
    } else {
      notify("error", "Archive note failed", "", "var(--color-crimson-red)");
    }
  };

  return (
    <div className="flex h-full">
      <ListNotes
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isInitialLoadingNotes={isInitialLoadingNotes}
        notesListData={notesListData}
        totalNotes={totalNotes}
        handleCreateNote={handleCreateNote}
        isLoadMoreNotes={isLoadMoreNotes}
        handleLoadMoreNotes={handleLoadMoreNotes}
        nextCursor={nextCursor}
        isFetchingNote={isFetchingNote}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
      />

      {showShareModal && (
        <ShareNoteModal
          register={register}
          control={control}
          getValues={getValues}
          dirtyFields={dirtyFields}
          noteDetail={noteDetail}
          setNoteDetail={setNoteDetail}
          showShareModal={showShareModal}
          setShowShareModal={setShowShareModal}
        />
      )}

      {noteDetail && (
        <div className="flex flex-1 flex-col gap-4 rounded-md p-8">
          <>
            {/* Title */}
            <div className="relative flex cursor-pointer items-start justify-between gap-8">
              {noteDetail.title ? (
                <>
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
                        setValue("title", noteDetail.title, {
                          shouldDirty: false,
                        });
                        return;
                      }
                      if (dirtyFields.title) {
                        updateTitleNote(currentTitle);
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

                  <div
                    onClick={() => setShowOption(!showOption)}
                    className="border-silver-chalice relative h-7 w-7 shrink-0 rounded-full border p-1"
                  >
                    <Ellipsis className="text-silver-chalice stroke-1.5 h-full w-full" />
                    {showOption && (
                      <div className="absolute top-0 right-8 space-y-3 rounded-md border border-gray-200 bg-white p-4 shadow-[0px_1px_8px_rgba(39,35,64,0.1)] dark:border-gray-100/20 dark:bg-[#16163B]">
                        <IconButton
                          customStyle="text-silver-chalice stroke-[1.5]"
                          size="w-5 h-5"
                          icon={Share2}
                          label="Share"
                          onClick={() => setShowShareModal(true)}
                        />
                        <IconButton
                          customStyle="text-silver-chalice stroke-[1.5]"
                          size="w-5 h-5"
                          icon={Archive}
                          label="Archive"
                          onClick={handleArchiveNote}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Skeleton height={44} containerClassName="flex-1" />
              )}
            </div>

            <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-100/20">
              {/* Created Date */}
              {noteDetail.date ? (
                <span className="font-body text-silver-chalice pr-8 text-base">
                  Created on{" "}
                  {dayjs(noteDetail.date, "DD/MM/YYYY").format("MMM D")}
                </span>
              ) : (
                <Skeleton height={16} width={40} />
              )}

              {/* Collaborators */}
              {noteDetail.collaborators?.length > 0 && (
                <div className="flex -space-x-1.5 pl-8">
                  {noteDetail.collaborators.slice(0, 5).map((collaborator) => (
                    <Avatar
                      key={`avatar-${collaborator.id}`}
                      src={collaborator.avatar?.url}
                      className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#16163B]"
                    />
                  ))}
                  {noteDetail.collaborators.length - 5 > 0 && (
                    <div className="text-ebony-clay font-body bg-silver-chalice h-8 w-8 rounded-full text-center text-xs leading-8 font-semibold ring-2 ring-white dark:ring-[#16163B]">
                      +{noteDetail.collaborators.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-1 flex w-full border-b border-b-gray-200 dark:border-gray-100/20">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  onClick={() => setActiveNoteType(tab.id)}
                  className="flex h-full w-1/2 cursor-pointer items-center justify-center"
                >
                  <span
                    className={`font-body inline-block w-full border-b-2 pt-4 pb-2 text-center text-base whitespace-nowrap transition-all duration-300 ease-in-out ${activeNoteType === tab.id ? "text-indigo border-indigo font-semibold dark:text-white" : "text-gravel border-transparent"}`}
                  >
                    {tab.label}{" "}
                    {tab.label === "Audio" && noteDetail
                      ? ` (${noteDetail.audio_note?.length})`
                      : ""}
                  </span>
                </div>
              ))}
            </div>

            {activeNoteType === "text" && (
              <TextNotes
                noteDetail={noteDetail}
                setNoteDetail={setNoteDetail}
                permission={noteDetail.permission}
              />
            )}

            {activeNoteType === "audio" && (
              <AudioNotes
                noteDetail={noteDetail}
                setNoteDetail={setNoteDetail}
                permission={noteDetail.permission}
              />
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default MyNotes;
