import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Ellipsis,
  FileText,
  Archive,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./buttons/IconButton";
import Tiptap from "../tiptap/TipTap";
import { useForm } from "react-hook-form";
import TextInput from "./inputs/TextInput";
import PrimaryButton from "./buttons/PrimaryButton";
import {
  archiveNoteApi,
  createNewNoteApi,
  createNewTextNoteApi,
  createSummaryApi,
  deleteAttachmentApi,
  getAllNoteAttachmentsApi,
  getAttachmentApi,
  getTextNoteApi,
  updateNoteApi,
  updateSummaryApi,
  updateTextNoteApi,
  uploadAttachmentApi,
} from "../../services/api.service";
import notify from "../ui/CustomToast";
import TextArea from "./inputs/TextArea";

const NoteForm = ({
  activeNote,
  setActiveNote,
  loadNotesList,
  showSummary,
  setShowSummary,
}) => {
  const [showOption, setShowOption] = useState(false);
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

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      title: "",
      date: today,
      summary: "",
    },
  });

  useEffect(() => {
    if (activeNote) {
      reset({
        title: activeNote.title,
        date: activeNote.date,
        summary: activeNote.summary?.summary_text,
      });
      setEditorState(activeNote.text_content);
      if (editorRef.current) {
        editorRef.current.commands.setContent(activeNote.text_content);
      }
    } else {
      reset({ title: "", date: today, summary: "" });
      setEditorState({ type: "doc", content: [] });
      if (editorRef.current) {
        editorRef.current.commands.setContent({ type: "doc", content: [] });
      }
    }
  }, [activeNote, reset]);

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

    if (!isPreview && activeNote?.note_id) {
      const res = await getAllNoteAttachmentsApi(activeNote.note_id);
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

    const noteRes = activeNote
      ? await updateNoteApi(values.title, activeNote.note_id)
      : await createNewNoteApi(values.title);

    if (!noteRes.data) {
      notify(
        "error",
        activeNote ? "Updated note failed" : "Create note failed",
        "",
        "var(--color-crimson-red)",
      );
      setIsProcessing(false);
      return;
    }

    const noteId = activeNote ? activeNote.note_id : noteRes.data;

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

    if (activeNote && attachmentsMarkedForDelete.length > 0) {
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

    const textNoteRes = activeNote
      ? await updateTextNoteApi(
          { text_content: updatedEditorState },
          activeNote.id,
        )
      : await createNewTextNoteApi(updatedEditorState, noteId);

    // Update summary
    if (activeNote && dirtyFields.summary) {
      await handleUpdateSummary(activeNote.summary.id, values.summary);
    }

    setIsProcessing(false);

    if (textNoteRes.data) {
      notify(
        "success",
        activeNote ? "Note updated!" : "Note created!",
        "",
        "var(--color-silver-tree)",
      );
      await loadNotesList(undefined, true);
      if (!activeNote) {
        reset();
        setEditorState({ type: "doc", content: [] });
      }
    }
  };

  const handleCancel = () => {
    if (!activeNote || !editorRef.current) return;

    reset({
      title: activeNote.title,
      date: activeNote.date,
    });

    editorRef.current.commands.setContent(activeNote.text_content);
    setEditorState(activeNote.text_content);
  };

  const handleCreateSummary = async (text_content) => {
    setIsSummarizing(true);
    setShowSummary(true);
    const summaryId = await createSummaryApi(text_content);
    if (summaryId.data) {
      const addSummary = await updateTextNoteApi(
        { summary_id: summaryId.data },
        activeNote?.id,
      );
      if (addSummary.data) {
        notify("success", "Summary created!", "", "var(--color-silver-tree)");
        const summaryRes = await getTextNoteApi(activeNote?.id);
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

  const handleArchiveNote = async () => {
    const res = await archiveNoteApi(activeNote.note_id);
    if (res.data) {
      notify("success", "Note archived!", "", "var(--color-silver-tree)");
      await loadNotesList(undefined, true);
      setActiveNote(null);
      reset({ title: "", date: today, summary: "" });
      setEditorState({ type: "doc", content: [] });
    } else {
      notify("error", "Archive note failed", "", "var(--color-crimson-red)");
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full flex-col gap-6"
    >
      <div className="flex cursor-pointer items-center justify-between gap-10">
        <TextInput
          style="text-2xl px-0! font-body font-semibold outline-none focus:shadow-none"
          placeholder="Title"
          {...register("title")}
        />
        {activeNote && (
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
                  label={activeNote.summary ? "Re-Summarize" : "Summarize"}
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
      </div>

      <div className="border-b-gallery flex items-center gap-10 border-b pb-2">
        <div className="font-body text-silver-chalice flex items-start text-base whitespace-nowrap">
          <CalendarDays className="mr-2 h-5 w-5 stroke-[1.8]" />
          <h3>Date created:</h3>
        </div>
        <TextInput
          style="text-sm md:text-base text-gravel!"
          {...register("date")}
          disabled
        />
      </div>

      <Tiptap
        initialContent={editorState}
        setEditorState={setEditorState}
        getEditorInstance={(editor) => (editorRef.current = editor)}
        setPendingAttachments={setPendingAttachments}
        isUploading={isUploading}
        isDeletingFile={isDeletingFile}
        unsetLink={unsetLink}
      />

      {(showSummary || isSummarizing || activeNote?.summary?.summary_text) && (
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
            />
          )}
        </div>
      )}

      {activeNote ? (
        <div className="mt-auto ml-auto flex gap-4">
          <PrimaryButton onClick={handleCancel} color="white" label="Cancel" />
          <PrimaryButton
            type="submit"
            color="blue"
            label="Save"
            isProcessing={isProcessing}
          />
        </div>
      ) : (
        <div className="mt-auto ml-auto">
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

export default NoteForm;
