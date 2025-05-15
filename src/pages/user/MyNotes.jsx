import { useEffect, useState } from "react";
import {
  Archive,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Share2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import IconButton from "../../components/ui/buttons/IconButton";
import TextNotes from "../../components/ui/TextNotes";
import {
  archiveNoteApi,
  createNewNoteApi,
  createNoteSummaryApi,
  getAllAudioApi,
  getAllUserNotesApi,
  createMindmapApi,
  getNoteMemberApi,
  getNoteApi,
  getTextNoteByNoteIdApi,
  updateMindmapApi,
  updateNoteApi,
  updateSummaryApi,
  getAudioApi,
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
import MindMapFlow from "../../components/ui/MindMapFlow";
import Summary from "../../components/ui/Summary";
import { SyncLoader } from "react-spinners";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";

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

  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const [activeNoteTab, setActiveNoteTab] = useState(
    sessionStorage.getItem("activeNoteTab") || "text",
  );
  const tabs = [
    { id: "text", label: "Text" },
    { id: "audio", label: "Audio" },
    { id: "ai", label: "Summary & Mindmap" },
  ];

  const [showOption, setShowOption] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const [mindmapData, setMindmapData] = useState(null);
  const [showMindmap, setShowMindmap] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("activeNoteTab", activeNoteTab);
  }, [activeNoteTab]);

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
    await loadNotesList(nextCursor);
  };

  useEffect(() => {
    loadNotesList(undefined, true);
  }, []);

  const getNoteDetail = async () => {
    if (isFetchingNote) return;
    setIsFetchingNote(true);

    const note = await getNoteApi(activeNoteId);
    if (!note) {
      setIsFetchingNote(false);
      return;
    }

    setNoteDetail({
      id: note.data.id,
      title: note.data.title,
      date: note.data.created_at,
      owner: note.data.user,
      permission: note.data.permission,
      collaborators: [],
      summary: note.data.summary,
      text_note: null,
      audio_note: [],
    });

    setMindmapData(note.data.mindmap);

    const noteCollaborators = await getNoteMemberApi(note.data.id);
    if (noteCollaborators.data) {
      setNoteDetail((prev) => ({
        ...prev,
        collaborators: noteCollaborators.data.filter(
          (member) => member.role !== "owner",
        ),
      }));
    }

    const textContent = await getTextNoteByNoteIdApi(note.data.id);
    if (textContent.data) {
      setNoteDetail((prev) => ({
        ...prev,
        text_note: {
          id: textContent.data.id,
          text_content: textContent.data.text_content[0].body,
          summary: textContent.data.summary,
        },
      }));
    }

    const audioContent = await getAllAudioApi(note.data.id);
    if (audioContent.data) {
      const audioList = audioContent.data;
      const detailedAudios = await Promise.all(
        audioList.map(async (item) => {
          const detailAudio = await getAudioApi(item.id);
          return {
            id: item.id,
            name: item.name,
            file_url: item.file_url,
            transcript: detailAudio?.data?.transcript || "",
            summary: detailAudio?.data?.summary || "",
          };
        }),
      );
      setNoteDetail((prev) => ({
        ...prev,
        audio_note: detailedAudios,
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
        note_summary: noteDetail.summary?.summary_text,
      });
    }
  }, [noteDetail]);

  const handleCreateNote = async () => {
    if (isCreatingNote) return;
    setIsCreatingNote(true);
    const res = await createNewNoteApi();
    if (res.data) {
      notify("success", "Note created!", "", "var(--color-silver-tree)");
      await loadNotesList(undefined, true);
      setActiveNoteId(res.data);
    } else {
      notify("error", "Create note failed", "", "var(--color-crimson-red)");
    }
    setIsCreatingNote(false);
  };

  const updateTitleNote = async (currentTitle) => {
    const res = await updateNoteApi({ title: currentTitle }, activeNoteId);
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
      await loadNotesList(undefined, true);

      setActiveNoteId(null);
      sessionStorage.removeItem("activeNoteId");
    } else {
      notify("error", "Archive note failed", "", "var(--color-crimson-red)");
    }
  };

  const handleCreateNoteSummary = async () => {
    setActiveNoteTab("ai");
    setShowSummary(true);
    setIsSummarizing(true);
    const summary = await createNoteSummaryApi(noteDetail.id);
    if (!summary.data) {
      notify("error", "Create summary failed", "", "var(--color-crimson-red)");
      setIsSummarizing(false);
      return;
    }
    notify("success", "Summary created!", "", "var(--color-silver-tree)");
    reset({ note_summary: summary.data.summary });
    setNoteDetail((prev) => ({
      ...prev,
      summary: summary.data,
    }));
    setIsSummarizing(false);
  };

  const handleCreateNoteMindmap = async () => {
    setActiveNoteTab("ai");
    setIsGeneratingMindMap(true);
    setShowMindmap(true);
    const mindmapId = await createMindmapApi(noteDetail.id);
    if (!mindmapId.data) {
      notify("error", "Create mindmap failed", "", "var(--color-crimson-red)");
      setIsGeneratingMindMap(false);
      return;
    }
    const addMindmap = await updateNoteApi(
      { mindmap: mindmapId.data },
      noteDetail.id,
    );
    if (addMindmap.data) {
      notify("success", "Mindmap created!", "", "var(--color-silver-tree)");
      const mindmapRes = await getNoteApi(noteDetail.id);
      if (mindmapRes.data) {
        setMindmapData(mindmapRes.data.mindmap);
      }
    }
    setIsGeneratingMindMap(false);
  };

  const handleUpdateSummary = async () => {
    const updateSummary = getValues("note_summary");
    setIsSaving(true);
    const res = await updateSummaryApi(noteDetail.summary?.id, updateSummary);
    if (!res.data) {
      notify("error", "Update summary failed", "", "var(--color-crimson-red)");
      setIsSaving(false);
      return;
    }
    notify("success", "Summary updated!", "", "var(--color-silver-tree)");
    setNoteDetail((prev) => ({
      ...prev,
      summary: {
        id: noteDetail.summary?.id,
        summary_text: updateSummary,
      },
    }));
    setIsSaving(false);
  };

  const updateNodeRecursive = (node, updatedNode) => {
    if (node.branch === updatedNode.branch) {
      return { ...node, ...updatedNode };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          updateNodeRecursive(child, updatedNode),
        ),
      };
    }
    return node;
  };

  const handleNodeUpdate = (updatedMindmap) => {
    setMindmapData((prev) => ({
      ...prev,
      mindmap_data: updatedMindmap,
    }));
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
        isCreatingNote={isCreatingNote}
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
        <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-8 pb-0">
          {/* Title */}
          <div className="relative flex cursor-pointer items-start justify-between gap-8">
            {noteDetail.title ? (
              <>
                <TextArea
                  style="text-2xl! text-ebony-clay font-semibold"
                  register={register("title")}
                  placeholder="Title"
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
                      {(noteDetail.text_note ||
                        noteDetail.audio_note?.length > 0) && (
                        <IconButton
                          onClick={handleCreateNoteSummary}
                          customStyle="text-silver-chalice stroke-[1.5]"
                          size="w-5 h-5"
                          icon={Sparkles}
                          label={
                            noteDetail.summary ? "Resummarize" : "Summarize"
                          }
                        />
                      )}
                      {noteDetail.summary && (
                        <IconButton
                          onClick={handleCreateNoteMindmap}
                          customStyle="text-silver-chalice stroke-[1.5]"
                          size="w-5 h-5"
                          icon={WandSparkles}
                          label={
                            mindmapData
                              ? "Regenerate mindmap"
                              : "Generate mindmap"
                          }
                        />
                      )}
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
                onClick={() => setActiveNoteTab(tab.id)}
                className="flex h-full w-1/3 cursor-pointer items-center justify-center"
              >
                <span
                  className={`font-body inline-block w-full border-b-2 pt-4 pb-2 text-center text-base whitespace-nowrap transition-all duration-300 ease-in-out ${activeNoteTab === tab.id ? "text-indigo border-indigo font-semibold dark:text-white" : "text-gravel border-transparent"}`}
                >
                  {tab.label}{" "}
                  {tab.label === "Audio" && noteDetail
                    ? ` (${noteDetail.audio_note?.length})`
                    : ""}
                </span>
              </div>
            ))}
          </div>

          {!isFetchingNote ? (
            <div>
              {activeNoteTab === "text" && (
                <TextNotes
                  noteDetail={noteDetail}
                  setNoteDetail={setNoteDetail}
                  permission={noteDetail.permission}
                />
              )}

              {activeNoteTab === "audio" && (
                <AudioNotes
                  noteDetail={noteDetail}
                  setNoteDetail={setNoteDetail}
                  permission={noteDetail.permission}
                />
              )}

              {activeNoteTab === "ai" && (
                <div className="flex flex-col gap-6">
                  {(showSummary || isSummarizing || noteDetail.summary) && (
                    <div className="space-y-5">
                      <Summary
                        showSummary={showSummary}
                        setShowSummary={setShowSummary}
                        isSummarizing={isSummarizing}
                        register={register}
                        registerField="note_summary"
                      />
                      {dirtyFields.note_summary && (
                        <div className="ml-auto flex w-fit gap-4">
                          <PrimaryButton
                            onClick={() =>
                              reset({
                                note_summary: noteDetail.summary?.summary_text,
                              })
                            }
                            color="white"
                            label="Cancel"
                          />
                          <PrimaryButton
                            type="submit"
                            color="blue"
                            label="Save"
                            onClick={handleUpdateSummary}
                            isProcessing={isSaving}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {(showMindmap || isGeneratingMindMap || mindmapData) && (
                    <div>
                      <IconButton
                        onClick={() => setShowMindmap(!showMindmap)}
                        icon={showMindmap ? ChevronUp : ChevronDown}
                        label="Mindmap"
                        isProcessing={isGeneratingMindMap}
                      />

                      {showMindmap &&
                        mindmapData?.mindmap_data?.parent_content?.length && (
                          <div className="mt-1.5 rounded-md border border-gray-200 pt-4 dark:border-gray-100/20">
                            <div className="mb-8">
                              <MindMapFlow
                                mindmapId={mindmapData.id}
                                setMindmapData={setMindmapData}
                                data={
                                  mindmapData.mindmap_data
                                }
                                onNodeUpdate={handleNodeUpdate}
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
              <div className="h-8 shrink-0" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <SyncLoader color="var(--color-cornflower-blue)" size={10} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyNotes;
