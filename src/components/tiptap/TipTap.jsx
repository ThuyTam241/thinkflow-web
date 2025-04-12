import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { useEffect } from "react";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const Tiptap = ({
  initialContent,
  setEditorState,
  getEditorInstance,
  setPendingAttachments,
  isUploading,
  isDeletingFile,
  unsetLink,
}) => {
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
      Link.configure({
        openOnClick: true,
        autolink: false,
        defaultProtocol: "https",
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            const allowedDomain = "depnqmevvmrp1.cloudfront.net";
            const domain = parsedUrl.hostname;

            return parsedUrl.protocol === "blob:" || domain === allowedDomain;
          } catch {
            return false;
          }
        },
        shouldAutoLink: () => false,
      }),
    ],
    content: initialContent || { type: "doc", content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setEditorState(json);
    },
  });

  useEffect(() => {
    if (editor && getEditorInstance) {
      getEditorInstance(editor);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div>
      <MenuBar
        editor={editor}
        setPendingAttachments={setPendingAttachments}
        isUploading={isUploading}
        isDeletingFile={isDeletingFile}
        unsetLink={() => unsetLink(editor)}
      />
      <EditorContent
        className="no-scrollbar font-body text-ebony-clay flex max-h-[calc(100vh-654px)] overflow-y-auto"
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
