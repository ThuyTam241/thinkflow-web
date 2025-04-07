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

const NoteForm = ({ activeNote, setNotes }) => {
  const [showSumary, setShowSumary] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [summary, setSummary] = useState(true);

  const { register, handleSubmit, reset } = useForm();

  const [editorState, setEditorState] = useState({
    type: "doc",
    content: [],
  });

  useEffect(() => {
    if (activeNote) {
      reset({ title: activeNote.title });
      setEditorState(activeNote.body);
    } else {
      reset({ title: "" });
      setEditorState({ type: "doc", content: [] });
    }
  }, [activeNote, reset]);

  const onSubmit = async (values) => {
    const noteData = {
      id: activeNote?.id || Date.now(),
      title: values.title,
      date:
        activeNote?.date ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      body: editorState,
    };

    if (activeNote) {
      setNotes((prev) =>
        prev.map((note) => (note.id === activeNote.id ? noteData : note)),
      );
      alert("Note updated!");
    } else {
      setNotes((prev) => [noteData, ...prev]);
      alert("Note created!");
      reset();
      setEditorState({ type: "doc", content: [] });
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
        <div
          onClick={() => setShowOption(!showOption)}
          className="border-silver-chalice relative h-7 w-7 rounded-full border p-1"
        >
          <Ellipsis className="text-silver-chalice stroke-1.5 h-full w-full" />
          {showOption && (
            <div className="border-gallery absolute top-0 right-8 space-y-3 rounded-md border bg-white p-4 shadow-[0px_1px_8px_rgba(39,35,64,0.1)] dark:bg-[#16163B]">
              <IconButton
                icon={FileText}
                label={summary ? "Re-Summarize" : "Summarize"}
              />
              <IconButton icon={Archive} label="Archive" />
            </div>
          )}
        </div>
      </div>

      <div className="border-b-gallery flex items-center gap-10 border-b pb-2">
        <div className="font-body text-silver-chalice flex items-start text-base">
          <CalendarDays className="mr-2 h-5 w-5 stroke-[1.8]" />
          <h3>Date created:</h3>
        </div>
        <span className="font-body text-gravel text-base">
          {activeNote?.id
            ? activeNote.date
            : new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
        </span>
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
        <div className="ml-auto flex gap-4">
          <PrimaryButton
            onClick={() => {
              reset({ title: activeNote.title });
              setEditorState(activeNote.body);
            }}
            color="white"
            label="Cancel"
          />
          <PrimaryButton type="submit" color="blue" label="Save" />
        </div>
      ) : (
        <div className="ml-auto">
          <PrimaryButton type="submit" color="blue" label="Create" />
        </div>
      )}
    </form>
  );
};

export default NoteForm;
