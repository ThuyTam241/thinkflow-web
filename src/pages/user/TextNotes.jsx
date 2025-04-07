import { useState } from "react";
import { CirclePlus } from "lucide-react";
import IconButton from "../../components/ui/buttons/IconButton";
import NoteForm from "../../components/ui/NoteForm";
import { Tooltip } from "react-tooltip";

const MyNotes = () => {
  const [activeNote, setActiveNote] = useState(null);

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "New Note",
      date: "31/12/2022",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "As the year comes to a close, I've been reflecting on my goals for the upcoming year...",
              },
            ],
          },
        ],
      },
    },
    {
      id: 2,
      title: "Reflection on the Month of June",
      date: "21/06/2022",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "It's hard to believe that June is already over! Looking back on the month...",
              },
            ],
          },
        ],
      },
    },
  ]);

  return (
    <div className="flex h-full gap-6">
      <div className="h-fit max-w-[280px] rounded-md bg-white px-6 py-7 dark:bg-[#16163B]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-body text-ebony-clay text-lg font-semibold">
            All Notes
          </h2>
          <IconButton
            onClick={() => setActiveNote(null)}
            data-tooltip-id="add-note-tooltip"
            data-tooltip-content="Add New Note"
            size="w-5 h-5"
            icon={CirclePlus}
          />
          <Tooltip
            id="add-note-tooltip"
            place="top"
            style={{
              backgroundColor: "#6368d1",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            className="font-body"
          />
        </div>
        <div className="no-scrollbar flex max-h-[calc(100vh-216px)] flex-col gap-3 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`cursor-pointer rounded-md border px-4 py-3 ${note.id === activeNote?.id ? "bg-hawkes-blue/30 border-indigo/10 dark:bg-[#0A0930]" : "border-gallery"}`}
            >
              <h3
                className={`font-body line-clamp-1 text-base font-medium transition-all duration-300 ease-in-out ${note.id === activeNote?.id ? "text-indigo dark:text-white" : "text-ebony-clay"}`}
              >
                {note.title}
              </h3>
              <span
                className={`font-body mt-1.5 text-xs transition-all duration-300 ease-in-out ${note.id === activeNote?.id ? "text-indigo dark:text-white" : "text-silver-chalice"}`}
              >
                {note.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write note */}
      <div className="w-full rounded-md bg-white p-8 dark:bg-[#16163B]">
        <NoteForm activeNote={activeNote} setNotes={setNotes} />
      </div>
    </div>
  );
};

export default MyNotes;
