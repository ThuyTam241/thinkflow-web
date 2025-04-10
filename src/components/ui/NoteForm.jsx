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
  updateNewNoteApi,
  updateNewTextNoteApi,
} from "../../services/api.service";
import notify from "../ui/CustomToast";

const NoteForm = ({ activeNote, loadNotesList }) => {
  const [showOption, setShowOption] = useState(false);
  const [editorState, setEditorState] = useState({
    type: "doc",
    content: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
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

  const onSubmit = async (values) => {
    if (activeNote) {
      setIsProcessing(true);
      const updatedNote = await updateNewNoteApi(
        values.title,
        activeNote.note_id,
      );
      if (updatedNote.data) {
        const updatedNewTextNote = await updateNewTextNoteApi(
          editorState,
          activeNote.id,
        );
        setIsProcessing(false);
        if (updatedNewTextNote.data) {
          notify("success", "Note updated!", "", "var(--color-silver-tree)");
          await loadNotesList(undefined, true);
        }
      } else {
        notify("error", "Updated note failed", "", "var(--color-crimson-red)");
      }
    } else {
      setIsProcessing(true);
      const newNote = await createNewNoteApi(values.title);
      if (newNote.data) {
        const newTextNote = await createNewTextNoteApi(
          editorState,
          newNote.data,
        );
        setIsProcessing(false);
        if (newTextNote.data) {
          notify("success", "Note created!", "", "var(--color-silver-tree)");
          await loadNotesList(undefined, true);
          reset();
          setEditorState({ type: "doc", content: [] });
        }
      } else {
        notify("error", "Create note failed", "", "var(--color-crimson-red)");
      }
    }
  };

  const handleArchiveNote = async () => {
    const res = await archiveNoteApi(activeNote.note_id);
    if (res.data) {
      notify("success", "Note archived!", "", "var(--color-silver-tree)");
      await loadNotesList(undefined, true);
      reset();
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

      <Tiptap initialContent={editorState} setEditorState={setEditorState} />

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
