import { useEffect, useRef, useState } from "react";
import Tiptap from "../tiptap/TipTap";
import { useForm } from "react-hook-form";
import PrimaryButton from "./buttons/PrimaryButton";
import {
  createNewTextNoteApi,
  createTextNoteSummaryApi,
  deleteAttachmentApi,
  getAllNoteAttachmentsApi,
  getAttachmentApi,
  updateSummaryApi,
  updateTextNoteApi,
  uploadAttachmentApi,
} from "../../services/api.service";
import notify from "./CustomToast";
import { Tooltip } from "react-tooltip";
import Summary from "./Summary";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm();

  useEffect(() => {
    if (noteDetail.text_note) {
      reset({ text_summary: noteDetail.text_note.summary?.summary_text });
      setEditorState(noteDetail.text_note.text_content);
      if (noteDetail.text_note.summary?.summary_text) {
        setShowSummary(true);
      }
      if (editorRef.current) {
        editorRef.current.commands.setContent(
          noteDetail.text_note.text_content,
        );
      }
    } else {
      reset({ text_summary: "" });
      setEditorState({ type: "doc", content: [] });
      setShowSummary(false);
      if (editorRef.current) {
        editorRef.current.commands.setContent({ type: "doc", content: [] });
      }
    }
  }, [noteDetail.text_note]);

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
          {
            text_content: [
              {
                body: updatedEditorState,
              },
            ],
            text_string: editorRef.current?.getText(),
          },
          noteDetail.text_note.id,
        )
      : await createNewTextNoteApi(
          updatedEditorState,
          editorRef.current?.getText(),
          noteId,
        );

    // Update summary
    if (noteDetail.text_note && dirtyFields.text_summary) {
      console.log(noteDetail.text_note.summary);
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
            summary: "",
          },
    }));
    if (!noteDetail.text_note) {
      reset();
      setEditorState({ type: "doc", content: [] });
    }
  };

  const handleCancel = () => {
    editorRef.current.commands.setContent(noteDetail.text_note.text_content);
    setEditorState(noteDetail.text_note.text_content);
    if (dirtyFields.text_summary) {
      reset({ text_summary: noteDetail.text_note.summary?.summary_text });
    }
  };

  const handleCreateTextNoteSummary = async () => {
    setIsSummarizing(true);
    setShowSummary(false);
    const summary = await createTextNoteSummaryApi(noteDetail.text_note.id);
    if (!summary.data) {
      notify("error", "Create summary failed", "", "var(--color-crimson-red)");
      setIsSummarizing(false);
      return;
    }
    notify("success", "Summary created!", "", "var(--color-silver-tree)");
    reset({ text_summary: summary.data.summary });
    setNoteDetail((prev) => ({
      ...prev,
      text_note: {
        ...prev.text_note,
        summary: summary.data,
      },
    }));
    setIsSummarizing(false);
    setShowSummary(true);
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

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={`${isProcessing ? "pointer-events-none opacity-50" : ""} flex flex-col gap-6`}
    >
      <Tiptap
        noteDetail={noteDetail}
        initialContent={editorState}
        setEditorState={setEditorState}
        getEditorInstance={(editor) => (editorRef.current = editor)}
        setPendingAttachments={setPendingAttachments}
        unsetLink={unsetLink}
        handleCreateTextNoteSummary={handleCreateTextNoteSummary}
        permission={permission}
      />

      {(showSummary || isSummarizing || noteDetail.text_note?.summary) && (
        <Summary
          showSummary={showSummary}
          setShowSummary={setShowSummary}
          isSummarizing={isSummarizing}
          permission={permission}
          register={register}
          registerField="text_summary"
        />
      )}

      <div className="mt-4 ml-auto flex gap-4">
        {noteDetail.text_note &&
        (dirtyFields.text_summary ||
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
