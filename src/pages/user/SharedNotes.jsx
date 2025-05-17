import {
  getAllAudioApi,
  getAllUserSharedNotesApi,
  createMindmapApi,
  getTextNoteByNoteIdApi,
  updateMindmapApi,
  updateNoteApi,
  createNoteSummaryApi,
  getNoteApi,
  updateSummaryApi,
  getAudioApi,
} from "../../services/api.service";
import notify from "../../components/ui/CustomToast";
import Skeleton from "react-loading-skeleton";
import TextNotes from "../../components/ui/TextNotes";
import AudioNotes from "../../components/ui/AudioNotes";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import TextArea from "../../components/ui/inputs/TextArea";
import Avatar from "../../components/ui/Avatar";
import { fullName } from "../../utils/userUtils";
import ListNotes from "../../components/ui/ListNotes";
import { useOutletContext } from "react-router";
import IconButton from "../../components/ui/buttons/IconButton";
import { ChevronDown, ChevronUp, Ellipsis, Sparkles, WandSparkles } from "lucide-react";
import Summary from "../../components/ui/Summary";
import MindMapFlow from "../../components/ui/MindMapFlow";
import { SyncLoader } from "react-spinners";

dayjs.extend(customParseFormat);

const SharedNotes = () => {
  const { isExpanded, setIsExpanded } = useOutletContext();
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

  const [activeSharedNoteTab, setActiveSharedNoteTab] = useState(
    sessionStorage.getItem("activeSharedNoteTab") || "text",
  );
  const tabs = [
    { id: "text", label: "Text" },
    { id: "audio", label: "Audio" },
    { id: "ai", label: "Summary & Mindmap" },
  ];

  useEffect(() => {
    sessionStorage.setItem("activeSharedNoteTab", activeSharedNoteTab);
  }, [activeSharedNoteTab]);

  const {
    register,
    reset,
    getValues,
    setValue,
    formState: { dirtyFields },
  } = useForm();

  const [showOption, setShowOption] = useState(false);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const [mindmapData, setMindmapData] = useState(null);
  const [showMindmap, setShowMindmap] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    await loadSharedNotesList(nextCursor);
  };

  useEffect(() => {
    loadSharedNotesList(undefined, true);
  }, []);

  const getSharedNoteDetail = async () => {
    if (isFetchingSharedNote) return;
    setIsFetchingSharedNote(true);

    const note = await getNoteApi(activeSharedNoteId);
    console.log("🚀 ~ getSharedNoteDetail ~ note:", note)
    if (!note) {
      setIsFetchingSharedNote(false);
      return;
    }

    setSharedNoteDetail({
      id: note.data.id,
      title: note.data.title,
      date: note.data.created_at,
      owner: note.data.user,
      permission: note.data.permission,
      summary: note.data.summary,
      text_note: null,
      audio_note: [],
    });

    setMindmapData(note.data.mindmap);

    const textContent = await getTextNoteByNoteIdApi(note.data.id);
    if (textContent.data) {
      setSharedNoteDetail((prev) => ({
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
      setSharedNoteDetail((prev) => ({
        ...prev,
        audio_note: detailedAudios,
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
        shared_title: sharedNoteDetail.title,
        shared_note_summary: sharedNoteDetail.summary?.summary_text,
      });
    }
  }, [sharedNoteDetail]);

  const updateTitleSharedNote = async (currentTitle) => {
    const res = await updateNoteApi({title: currentTitle}, activeSharedNoteId);
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

  const handleCreateNoteSummary = async () => {
    setActiveNoteTab("ai");
    setIsSummarizing(true);
    setShowSummary(false);
    const summary = await createNoteSummaryApi(noteDetail.id);
    if (!summary.data) {
      notify("error", "Create summary failed", "", "var(--color-crimson-red)");
      setIsSummarizing(false);
      return;
    }
    notify("success", "Summary created!", "", "var(--color-silver-tree)");
    reset({ note_summary: summary.data.summary });
    setSharedNoteDetail((prev) => ({
      ...prev,
      summary: summary.data,
    }));
    setIsSummarizing(false);
    setShowSummary(true);
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
      { mindmap_id: mindmapId.data },
      noteDetail.id,
    );
    if (addMindmap.data) {
      notify("success", "Mindmap created!", "", "var(--color-silver-tree)");
      const mindmapRes = await getNoteApi(noteDetail.id);
      if (mindmapRes.data) {
        setMindmapData(mindmapRes.data.mindmap?.mindmap_data);
      }
    }
    setIsGeneratingMindMap(false);
  };

  const handleUpdateSummary = async () => {
    const updateSummary = getValues("shared_note_summary");
    setIsSaving(true);
    const res = await updateSummaryApi(
      sharedNoteDetail.summary?.id,
      updateSummary,
    );
    if (!res.data) {
      notify("error", "Update summary failed", "", "var(--color-crimson-red)");
      setIsSaving(false);
      return;
    }
    notify("success", "Summary updated!", "", "var(--color-silver-tree)");
    setSharedNoteDetail((prev) => ({
      ...prev,
      summary: {
        id: sharedNoteDetail.summary?.id,
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

  const handleNodeUpdate = (updatedMindMap) => {
    setMindmapData(updatedMindMap);
  };

  return (
    <div className="flex h-full">
      <ListNotes
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isInitialLoadingNotes={isInitialLoadingSharedNotes}
        notesListData={sharedNotesListData}
        totalNotes={totalSharedNotes}
        isLoadMoreNotes={isLoadMoreSharedNotes}
        handleLoadMoreNotes={handleLoadMoreSharedNotes}
        nextCursor={nextCursor}
        isFetchingNote={isFetchingSharedNote}
        activeNoteId={activeSharedNoteId}
        setActiveNoteId={setActiveSharedNoteId}
      />

      {sharedNoteDetail && (
        <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-8">
          {/* Title */}
          <div className="relative flex cursor-pointer items-start justify-between gap-8">
            {sharedNoteDetail.title ? (
              <>
                <TextArea
                  style="text-2xl! text-ebony-clay font-semibold"
                  register={register("shared_title")}
                  placeholder="Title"
                  onBlur={(e) => {
                    const currentTitle = getValues("shared_title").trim();
                    if (currentTitle === "") {
                      setValue("shared_title", sharedNoteDetail.title, {
                        shouldDirty: false,
                      });
                      return;
                    }
                    if (dirtyFields.shared_title) {
                      updateTitleSharedNote(currentTitle);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                />

                {(sharedNoteDetail.text_note ||
                  sharedNoteDetail.audio_note?.length > 0) &&
                  sharedNoteDetail.permission !== "read" && (
                    <div
                      onClick={() => setShowOption(!showOption)}
                      className="border-silver-chalice relative h-7 w-7 shrink-0 rounded-full border p-1"
                    >
                      <Ellipsis className="text-silver-chalice stroke-1.5 h-full w-full" />
                      {showOption && (
                        <div className="absolute top-0 right-8 space-y-3 rounded-md border border-gray-200 bg-white p-4 shadow-[0px_1px_8px_rgba(39,35,64,0.1)] dark:border-gray-100/20 dark:bg-[#16163B]">
                          <IconButton
                            onClick={handleCreateNoteSummary}
                            customStyle="text-silver-chalice stroke-[1.5]"
                            size="w-5 h-5"
                            icon={Sparkles}
                            label={
                              sharedNoteDetail.summary
                                ? "Resummarize"
                                : "Summarize"
                            }
                          />
                          {sharedNoteDetail.summary && (
                            <IconButton
                              onClick={handleCreateNoteMindmap}
                              customStyle="text-silver-chalice stroke-[1.5]"
                              size="w-5 h-5"
                              icon={WandSparkles}
                              label={
                                sharedNoteDetail.summary
                                  ? "Regenerate mindmap"
                                  : "Generate mindmap"
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </>
            ) : (
              <Skeleton height={44} containerClassName="flex-1" />
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-100/20">
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
                  src={sharedNoteDetail.owner?.avatar?.url}
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-body text-silver-chalice text-base">
                  {fullName(sharedNoteDetail?.owner)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-1 flex w-full border-b border-b-gray-200 dark:border-gray-100/20">
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => setActiveSharedNoteTab(tab.id)}
                className={`flex h-full w-1/2 cursor-pointer items-center justify-center ${activeSharedNoteTab === tab.id ? "bg-white dark:bg-[#16163B]" : ""}`}
              >
                <span
                  className={`font-body inline-block w-full border-b-2 pt-4 pb-2 text-center text-base whitespace-nowrap transition-all duration-300 ease-in-out ${activeSharedNoteTab === tab.id ? "text-indigo border-indigo font-semibold dark:text-white" : "text-gravel border-transparent"}`}
                >
                  {tab.label}{" "}
                  {tab.label === "Audio" && sharedNoteDetail
                    ? ` (${sharedNoteDetail.audio_note?.length})`
                    : ""}
                </span>
              </div>
            ))}
          </div>

          {!isFetchingSharedNote ? (
            <div>
              {activeSharedNoteTab === "text" && (
                <TextNotes
                  noteDetail={sharedNoteDetail}
                  setNoteDetail={setSharedNoteDetail}
                  permission={sharedNoteDetail.permission}
                />
              )}

              {activeSharedNoteTab === "audio" && (
                <AudioNotes
                  noteDetail={sharedNoteDetail}
                  setNoteDetail={setSharedNoteDetail}
                  permission={sharedNoteDetail.permission}
                />
              )}

              {activeSharedNoteTab === "ai" && (
                <div className="flex flex-col gap-6">
                  {(showSummary ||
                    isSummarizing ||
                    sharedNoteDetail.summary) && (
                    <div className="space-y-5">
                      <Summary
                        showSummary={showSummary}
                        setShowSummary={setShowSummary}
                        isSummarizing={isSummarizing}
                        register={register}
                        registerField="shared_note_summary"
                        permission={sharedNoteDetail.permission}
                      />
                      {dirtyFields.shared_note_summary && (
                        <div className="ml-auto flex w-fit gap-4">
                          <PrimaryButton
                            onClick={() =>
                              reset({
                                shared_note_summary:
                                  sharedNoteDetail.summary?.summary_text,
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
                                data={mindmapData.mindmap_data}
                                onNodeUpdate={handleNodeUpdate}
                                permission={sharedNoteDetail.permission}
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

export default SharedNotes;
