import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { useEffect } from "react";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

const Tiptap = ({ initialContent, setEditorState }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your notes...",
      }),
    ],
    content: initialContent || { type: "doc", content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setEditorState(json);
    },
  });

  if (!editor) return null;

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent
        className="no-scrollbar font-body text-ebony-clay flex max-h-[calc(100vh-666px)] overflow-y-auto"
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
