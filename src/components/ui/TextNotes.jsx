import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./buttons/IconButton";
import Tiptap from "../tiptap/TipTap";
import { useForm } from "react-hook-form";
import PrimaryButton from "./buttons/PrimaryButton";
import {
  createNewTextNoteApi,
  createSummaryApi,
  deleteAttachmentApi,
  getAllNoteAttachmentsApi,
  getAttachmentApi,
  getTextNoteApi,
  updateSummaryApi,
  updateTextNoteApi,
  uploadAttachmentApi,
  getMindmapApi,
  updateMindmapApi,
} from "../../services/api.service";
import notify from "./CustomToast";
import TextArea from "./inputs/TextArea";
import { Tooltip } from "react-tooltip";
import MindMapIcon from "../../assets/icons/mindmap-icon.svg";
import MindMap from "./MindMap";

const TextNotes = ({ noteDetail, setNoteDetail, permission }) => {
  const [editorState, setEditorState] = useState({
    type: "doc",
    content: [],
  });
  const editorRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [attachmentsMarkedForDelete, setAttachmentsMarkedForDelete] = useState(
    [],
  );
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const [mindmapData, setMindmapData] = useState(null);
  const [showMindmap, setShowMindmap] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm();

  useEffect(() => {
    if (noteDetail.text_note) {
      reset({ summary: noteDetail.text_note.summary?.summary_text });
      setEditorState(noteDetail.text_note.text_content);
      if (noteDetail.text_note.summary?.summary_text) {
        setShowSummary(true);
      }
      if (editorRef.current) {
        editorRef.current.commands.setContent(
          noteDetail.text_note.text_content,
        );
      }
      // Fetch mindmap data
      fetchMindmapData();
    } else {
      reset({ summary: "" });
      setEditorState({ type: "doc", content: [] });
      setShowSummary(false);
      setMindmapData(null);
      setShowMindmap(false);
      if (editorRef.current) {
        editorRef.current.commands.setContent({ type: "doc", content: [] });
      }
    }
  }, [noteDetail.text_note, reset]);

  const fetchMindmapData = async () => {
    if (!noteDetail?.id) return;
    const res = await getMindmapApi(noteDetail.id);
    if (res.data) {
      setMindmapData(res.data);
    }
  };

  const handleUploadFile = async (
    attachment,
    noteId,
    currentEditorStateStr,
  ) => {
    const uploadFile = await uploadAttachmentApi(attachment.file, noteId);
    if (uploadFile.data) {
      const res = await getAttachmentApi(uploadFile.data);
      if (res.data) {
        const fileUrl = res.data.file_url;
        const previewUrl = attachment.previewUrl;
        currentEditorStateStr = currentEditorStateStr.replaceAll(
          previewUrl,
          fileUrl,
        );
      }
    } else {
      notify("error", "Could not get file URL", "", "var(--color-crimson-red)");
    }
    return currentEditorStateStr;
  };

  const handleUploadAllFiles = async (
    attachments,
    noteId,
    initialEditorState,
  ) => {
    let editorStateStr = JSON.stringify(initialEditorState);

    for (const attachment of attachments) {
      editorStateStr = await handleUploadFile(
        attachment,
        noteId,
        editorStateStr,
      );
    }

    const updatedEditorState = JSON.parse(editorStateStr);
    setEditorState(updatedEditorState);
    setPendingAttachments([]);
    return updatedEditorState;
  };

  const unsetLink = async (editor) => {
    const currentLink = editor.getAttributes("link")?.href;
    if (!currentLink) return;
    const isPreview = currentLink.startsWith("blob:");

    if (!isPreview && noteDetail?.id) {
      const res = await getAllNoteAttachmentsApi(noteDetail.id);
      if (res.data?.length > 0) {
        const attachments = res.data;
        const attachment = attachments.find(
          (attachment) => attachment.file_url === currentLink,
        );
        if (attachment) {
          setAttachmentsMarkedForDelete((prev) => [...prev, attachment.id]);
        }
      }
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .deleteSelection()
      .unsetLink()
      .run();
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    const noteId = noteDetail?.id;
    // Upload files
    let updatedEditorState = editorState;
    if (pendingAttachments.length > 0) {
      updatedEditorState = await handleUploadAllFiles(
        pendingAttachments,
        noteId,
        editorState,
      );
    }

    if (noteDetail.text_note && attachmentsMarkedForDelete.length > 0) {
      for (const attachmentId of attachmentsMarkedForDelete) {
        const res = await deleteAttachmentApi(attachmentId);
        if (!res.data) {
          notify(
            "error",
            "Delete attachment failed",
            "",
            "var(--color-crimson-red)",
          );
          return;
        }
      }
      setAttachmentsMarkedForDelete([]);
    }

    const textNoteRes = noteDetail.text_note
      ? await updateTextNoteApi(
          { text_content: updatedEditorState },
          noteDetail.text_note.id,
        )
      : await createNewTextNoteApi(updatedEditorState, noteId);

    // Update summary
    if (noteDetail.text_note && dirtyFields.summary) {
      await handleUpdateSummary(
        noteDetail.text_note.summary?.id,
        values.summary,
      );
    }

    setIsProcessing(false);

    if (!textNoteRes.data) {
      notify(
        "error",
        noteDetail.text_note ? "Updated note failed" : "Create note failed",
        "",
        "var(--color-crimson-red)",
      );
      return;
    }

    notify(
      "success",
      noteDetail.text_note ? "Note updated!" : "Note created!",
      "",
      "var(--color-silver-tree)",
    );
    setNoteDetail((prev) => ({
      ...prev,
      text_note: noteDetail.text_note
        ? {
            ...prev.text_note,
            text_content: updatedEditorState,
          }
        : {
            id: textNoteRes.data,
            text_content: updatedEditorState,
            summary: null,
          },
    }));
    if (!noteDetail.text_note) {
      reset();
      setEditorState({ type: "doc", content: [] });
    }
  };

  const handleCancel = () => {
    if (!noteDetail.text_note || !editorRef.current) return;

    editorRef.current.commands.setContent(noteDetail.text_note.text_content);
    setEditorState(noteDetail.text_note.text_content);
  };

  const handleCreateSummary = async (text_content) => {
    setIsSummarizing(true);
    setShowSummary(true);
    const summaryId = await createSummaryApi(text_content);
    if (summaryId.data) {
      const addSummary = await updateTextNoteApi(
        { summary_id: summaryId.data },
        noteDetail?.text_note?.id,
      );
      if (addSummary.data) {
        notify("success", "Summary created!", "", "var(--color-silver-tree)");
        const summaryRes = await getTextNoteApi(noteDetail?.text_note?.id);
        if (summaryRes.data) {
          reset({ summary: summaryRes.data.summary?.summary_text });
          setNoteDetail((prev) => ({
            ...prev,
            text_note: {
              ...prev.text_note,
              summary: summaryRes.data.summary,
            },
          }));
        }
      }
    } else {
      notify("error", "Create summary failed", "", "var(--color-crimson-red)");
    }
    setIsSummarizing(false);
  };

  const handleUpdateSummary = async (summary_id, summary_text) => {
    const res = await updateSummaryApi(summary_id, summary_text);
    if (!res.data) {
      notify("error", "Update summary failed", "", "var(--color-crimson-red)");
      return;
    }
    setNoteDetail((prev) => ({
      ...prev,
      text_note: {
        ...prev.text_note,
        summary: {
          id: summary_id,
          summary_text: summary_text,
        },
      },
    }));
  };

  function updateNodeRecursive(node, updatedNode) {
    if (node.branch === updatedNode.branch) {
      return { ...node, ...updatedNode };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeRecursive(child, updatedNode))
      };
    }
    return node;
  }

  const handleNodeUpdate = async (updatedNode) => {
    const updateSuccess = await updateMindmapApi(noteDetail.id, mindmapData);

    // TODO: After BE completed, add logic only update mindmap when updateSuccess is true
    setMindmapData(prev => {
      if (Array.isArray(prev.parent_content)) {
        return {
          ...prev,
          parent_content: prev.parent_content.map(rootNode =>
            updateNodeRecursive(rootNode, updatedNode)
          )
        };
      } else {
        return updateNodeRecursive(prev, updatedNode);
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={`${isProcessing ? "pointer-events-none opacity-50" : ""} flex h-full w-full flex-col gap-4 overflow-y-auto`}
    >
      <Tiptap
        noteDetail={noteDetail}
        initialContent={editorState}
        setEditorState={setEditorState}
        getEditorInstance={(editor) => (editorRef.current = editor)}
        setPendingAttachments={setPendingAttachments}
        unsetLink={unsetLink}
        handleCreateSummary={handleCreateSummary}
        permission={permission}
      />

      {(showSummary || isSummarizing || noteDetail?.text_note?.summary) && (
        <div>
          <IconButton
            onClick={() => setShowSummary(!showSummary)}
            icon={showSummary ? ChevronUp : ChevronDown}
            label="Summary"
            isProcessing={isSummarizing}
          />

          {showSummary && (
            <div className="mt-1.5 h-40 border-t border-gray-200 pt-4 dark:border-gray-100/20">
              <TextArea {...register("summary")} disabled={isSummarizing} />
            </div>
          )}
        </div>
      )}

      {noteDetail?.text_note && (
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
                <MindMap 
                  data={mindmapData} 
                  onNodeUpdate={handleNodeUpdate}
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto ml-auto flex gap-4">
        {noteDetail.text_note &&
        (dirtyFields.summary ||
          JSON.stringify(editorState) !==
            JSON.stringify(noteDetail.text_note.text_content)) ? (
          <>
            <PrimaryButton
              data-tooltip-id="disable-cancel"
              data-tooltip-content="You cannot edit this note"
              onClick={handleCancel}
              color="white"
              label="Cancel"
              disabled={permission === "read"}
            />
            {permission === "read" && (
              <Tooltip
                id="disable-cancel"
                place="top"
                style={{
                  backgroundColor: "#6368d1",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
                className="font-body"
              />
            )}
            <PrimaryButton
              data-tooltip-id="disable-button"
              data-tooltip-content="You cannot edit this note"
              type="submit"
              color="blue"
              label="Save"
              isProcessing={isProcessing}
              disabled={permission === "read"}
            />
          </>
        ) : (
          !noteDetail.text_note && (
            <PrimaryButton
              data-tooltip-id="disable-button"
              data-tooltip-content="You cannot edit this note"
              type="submit"
              color="blue"
              label="Create"
              isProcessing={isProcessing}
              disabled={permission === "read"}
            />
          )
        )}
        {permission === "read" && (
          <Tooltip
            id="disable-button"
            place="top"
            style={{
              backgroundColor: "#6368d1",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            className="font-body"
          />
        )}
      </div>
    </form>
  );
};

export default TextNotes;
