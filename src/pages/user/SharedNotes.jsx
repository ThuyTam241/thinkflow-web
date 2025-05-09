import {
  getAllAudioApi,
  getAllUserSharedNotesApi,
  getMindmapApi,
  getTextNoteByNoteIdApi,
  updateMindmapApi,
  updateNoteApi,
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
import { ChevronDown, ChevronUp } from "lucide-react";

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

  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const [mindmapData, setMindmapData] = useState(null);
  const [showMindmap, setShowMindmap] = useState(false);

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
      permission: note.permission,
      text_note: null,
      audio_note: [],
    });

    //Mindmap
    const res = await getMindmapApi(note.id);
    if (res.data) {
      setMindmapData(res.data);
    }

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

  const handleNodeUpdate = async (updatedNode) => {
    const updateSuccess = await updateMindmapApi(noteDetail.id, mindmapData);

    setMindmapData((prev) => {
      if (Array.isArray(prev.parent_content)) {
        return {
          ...prev,
          parent_content: prev.parent_content.map((rootNode) =>
            updateNodeRecursive(rootNode, updatedNode),
          ),
        };
      } else {
        return updateNodeRecursive(prev, updatedNode);
      }
    });
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
        <div className="no-scrollbar flex w-full flex-col gap-4 overflow-y-auto rounded-md p-8">
          {/* Title */}
          <div className="relative flex cursor-pointer items-start justify-between gap-8">
            {sharedNoteDetail.title ? (
              <TextArea
                style="text-2xl! text-ebony-clay font-semibold max-h-16"
                disabled={sharedNoteDetail.permission === "read"}
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
                  src={sharedNoteDetail.owner.avatar?.url}
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-body text-silver-chalice text-base">
                  {fullName(sharedNoteDetail.owner)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-1 flex w-full border-b border-b-gray-200 dark:border-gray-100/20">
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => setActiveSharedNoteType(tab.id)}
                className={`flex h-full w-1/2 cursor-pointer items-center justify-center ${activeSharedNoteType === tab.id ? "bg-white dark:bg-[#16163B]" : ""}`}
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
              permission={sharedNoteDetail.permission}
            />
          )}

          {activeSharedNoteType === "audio" && (
            <AudioNotes
              noteDetail={sharedNoteDetail}
              setNoteDetail={setSharedNoteDetail}
              permission={sharedNoteDetail.permission}
            />
          )}

          <div className="max-w-[calc(100vw-645px)]">
            <IconButton
              onClick={() => setShowMindmap(!showMindmap)}
              icon={showMindmap ? ChevronUp : ChevronDown}
              label="Mindmap"
              isProcessing={isGeneratingMindMap}
            />

            {showMindmap && mindmapData && (
              <div className="mt-1.5 border-t border-gray-200 pt-4 dark:border-gray-100/20">
                {Array.isArray(mindmapData.parent_content) ? (
                  mindmapData.parent_content.map((rootNode, idx) => (
                    <div key={idx} className="mb-8">
                      <MindMap
                        data={rootNode}
                        onNodeUpdate={handleNodeUpdate}
                      />
                    </div>
                  ))
                ) : (
                  <MindMap data={mindmapData} onNodeUpdate={handleNodeUpdate} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedNotes;
