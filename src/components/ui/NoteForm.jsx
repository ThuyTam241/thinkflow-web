import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Ellipsis,
  FileText,
  Archive,
} from "lucide-react";
import { useEffect, useState } from "react";
import IconButton from "./buttons/IconButton";
import Tiptap from "../tiptap/TipTap";
import { useForm } from "react-hook-form";
import TextInput from "./inputs/TextInput";
import PrimaryButton from "./buttons/PrimaryButton";
import {
  archiveNoteApi,
  createNewNoteApi,
  createNewTextNoteApi,
  deleteAttachmentApi,
  getAllNoteAttachmentsApi,
  getAttachmentApi,
  updateNewNoteApi,
  updateNewTextNoteApi,
  uploadAttachmentApi,
} from "../../services/api.service";
import notify from "../ui/CustomToast";

const NoteForm = ({ activeNote, loadNotesList }) => {
  const [showOption, setShowOption] = useState(false);
  const [editorState, setEditorState] = useState({
    type: "doc",
    content: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [attachmentsMarkedForDelete, setAttachmentsMarkedForDelete] = useState(
    [],
  );
  const [summary, setSummary] = useState(false);
  const [showSumary, setShowSumary] = useState(false);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      date: today,
    },
  });

  useEffect(() => {
    if (activeNote) {
      reset({ title: activeNote.title, date: activeNote.date });
      setEditorState(activeNote.text_content);
    } else {
      reset({ title: "", date: today });
      setEditorState({ type: "doc", content: [] });
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

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .run();
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);

    const noteRes = activeNote
      ? await updateNewNoteApi(values.title, activeNote.note_id)
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
      ? await updateNewTextNoteApi(updatedEditorState, activeNote.id)
      : await createNewTextNoteApi(updatedEditorState, noteId);

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

  const handleArchiveNote = async () => {
    const res = await archiveNoteApi(activeNote.note_id);
    if (res.data) {
      notify("success", "Note archived!", "", "var(--color-silver-tree)");
      await loadNotesList(undefined, true);
      reset({ title: "", date: today });
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
                  icon={FileText}
                  label={summary ? "Re-Summarize" : "Summarize"}
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
        setPendingAttachments={setPendingAttachments}
        isUploading={isUploading}
        isDeletingFile={isDeletingFile}
        unsetLink={unsetLink}
      />

      {summary && (
        <div className="mt-auto">
          <IconButton
            onClick={() => setShowSumary(!showSumary)}
            icon={showSumary ? ChevronUp : ChevronDown}
            label="Summary"
          />
          {showSumary && (
            <TextInput
              style="px-0! pb-0 outline-none mt-2 max-h-[200px] border-t pt-4 border-gallery focus:shadow-none"
              {...register("summary")}
            />
          )}
        </div>
      )}

      {activeNote ? (
        <div className="mt-auto ml-auto flex gap-4">
          <PrimaryButton
            onClick={() => {
              reset({ title: activeNote.title });
              setEditorState(activeNote.text_content);
            }}
            color="white"
            label="Cancel"
          />
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
