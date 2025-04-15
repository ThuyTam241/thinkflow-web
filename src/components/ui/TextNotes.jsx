import { ChevronDown, ChevronUp, FileText } from "lucide-react";
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
} from "../../services/api.service";
import notify from "./CustomToast";
import TextArea from "./inputs/TextArea";

const TextNotes = ({ noteDetail }) => {
  const [editorState, setEditorState] = useState({
    type: "doc",
    content: [],
  });
  const editorRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
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
    getValues,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      summary: "",
    },
  });

  useEffect(() => {
    if (noteDetail.text_note) {
      const summary = noteDetail.text_note.text_content.summary?.summary_text;
      const textContent = noteDetail.text_note.text_content;

      if (summary !== getValues("summary")) {
        reset({ summary });
      }

      if (textContent !== editorState) {
        setEditorState(textContent);
        if (editorRef.current) {
          editorRef.current.commands.setContent(textContent);
        }
      }
    } else {
      reset({ summary: "" });
      setEditorState({ type: "doc", content: [] });
      if (editorRef.current) {
        editorRef.current.commands.setContent({ type: "doc", content: [] });
      }
    }
  }, [noteDetail.text_note, reset]);

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

    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);
    const noteId = noteDetail?.id;
    // Upload files
    setIsUploading(true);
    let updatedEditorState = editorState;
    if (pendingAttachments.length > 0) {
      updatedEditorState = await handleUploadAllFiles(
        pendingAttachments,
        noteId,
        editorState,
      );
    }
    setIsUploading(false);

    if (noteDetail.text_note && attachmentsMarkedForDelete.length > 0) {
      setIsDeletingFile(true);
      for (const attachmentId of attachmentsMarkedForDelete) {
        const res = await deleteAttachmentApi(attachmentId);
        if (!res.data) {
          notify(
            "error",
            "Delete attachment failed",
            "",
            "var(--color-crimson-red)",
          );
        }
      }
      setAttachmentsMarkedForDelete([]);
      setIsDeletingFile(false);
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
        noteDetail.text_note.text_content.summary.id,
        values.summary,
      );
    }

    setIsProcessing(false);

    if (textNoteRes.data) {
      notify(
        "success",
        noteDetail.text_note ? "Note updated!" : "Note created!",
        "",
        "var(--color-silver-tree)",
      );
      if (!noteDetail.text_note) {
        reset();
        setEditorState({ type: "doc", content: [] });
      }
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
        }
      }
    } else {
      notify("error", "Create summary failed", "", "var(--color-crimson-red)");
    }
    setIsSummarizing(false);
  };

  const handleUpdateSummary = async (summary_id, summary_text) => {
    const res = await updateSummaryApi(summary_id, summary_text);
    if (!res.data)
      notify("error", "Update summary failed", "", "var(--color-crimson-red)");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full flex-col gap-6"
    >
      {/* <div className="flex cursor-pointer items-center justify-between gap-10">
        <TextInput
          style="text-2xl px-0! font-body font-semibold outline-none focus:shadow-none"
          placeholder="Title"
          {...register("title")}
        />
        {noteDetail && (
          <div
            onClick={() => setShowOption(!showOption)}
            className="border-silver-chalice relative h-7 w-7 rounded-full border p-1"
          >
            <Ellipsis className="text-silver-chalice stroke-1.5 h-full w-full" />
            {showOption && (
              <div className="border-gallery absolute top-0 right-8 z-20 space-y-3 rounded-md border bg-white p-4 shadow-[0px_1px_8px_rgba(39,35,64,0.1)] dark:bg-[#16163B]">
                <IconButton
                  onClick={() =>
                    handleCreateSummary(editorRef.current?.getText())
                  }
                  icon={FileText}
                  label={noteDetail.summary ? "Re-Summarize" : "Summarize"}
                />
                <IconButton
                  onClick={handleArchiveNote}
                  icon={Archive}
                  label="Archive"
                />
              </div>
            )}
          </div>
        )}
      </div> */}

      <Tiptap
        initialContent={editorState}
        setEditorState={setEditorState}
        getEditorInstance={(editor) => (editorRef.current = editor)}
        setPendingAttachments={setPendingAttachments}
        isUploading={isUploading}
        isDeletingFile={isDeletingFile}
        unsetLink={unsetLink}
      />

      {(showSummary ||
        isSummarizing ||
        noteDetail?.text_note?.text_content?.summary?.summary_text) && (
        <div className="mt-2">
          <IconButton
            onClick={() => setShowSummary(!showSummary)}
            icon={showSummary ? ChevronUp : ChevronDown}
            label="Summary"
            isProcessing={isSummarizing}
          />
          {showSummary && (
            <TextArea
              style="px-0! pb-0 outline-none resize-none mt-2 border-t pt-4 border-gallery focus:shadow-none"
              {...register("summary")}
              disabled={isSummarizing}
              defaultValue={
                noteDetail.text_note?.text_content?.summary?.summary_text || ""
              }
            />
          )}
        </div>
      )}

      {noteDetail.text_note ? (
        <div className="ml-auto flex gap-4">
          <PrimaryButton onClick={handleCancel} color="white" label="Cancel" />
          <PrimaryButton
            type="submit"
            color="blue"
            label="Save"
            isProcessing={isProcessing}
          />
        </div>
      ) : (
        <div className="ml-auto">
          <PrimaryButton
            type="submit"
            color="blue"
            label="Create"
            isProcessing={isProcessing}
          />
        </div>
      )}
    </form>
  );
};

export default TextNotes;
