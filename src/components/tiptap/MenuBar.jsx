import React, { useRef } from "react";
import ToolbarButton from "../ui/Toolbar";
import {
  MessageSquareQuote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Highlighter,
  Strikethrough,
  Link,
  Unlink,
  Sparkles,
} from "lucide-react";
import EditAvatar from "../../assets/images/edit-avatar.png";
import FileUploadInput from "../ui/inputs/FileUploadInput";
import IconButton from "../ui/buttons/IconButton";
import { Tooltip } from "react-tooltip";

const MenuBar = ({
  noteDetail,
  editor,
  setPendingAttachments,
  unsetLink,
  handleCreateSummary,
  permission,
}) => {
  if (!editor) {
    return null;
  }

  const fileInputRef = useRef(null);

  const handlePreviewFile = async (event) => {
    if (!event.target.files[0] || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setPendingAttachments((prev) => [...prev, { file, previewUrl }]);
    editor
      .chain()
      .focus()
      .insertContent({
        type: "paragraph",
        content: [
          {
            type: "text",
            text: file.name,
            marks: [
              {
                type: "link",
                attrs: {
                  href: previewUrl,
                  target: "_blank",
                },
              },
            ],
          },
        ],
      })
      .run();
  };

  return (
    <div className="mb-4 flex items-center divide-x divide-gray-200 rounded-xl border border-gray-200 bg-slate-50 p-3 dark:divide-gray-100/20 dark:border-gray-100/20 shadow-xs dark:bg-[#16163B]/25">
      <div className="flex items-center gap-4 pr-4">
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={permission === "read"}
        />
      </div>
      <div className="flex items-center gap-4 px-4">
        <ToolbarButton
          isActive={editor.isActive("bold")}
          icon={Bold}
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("italic")}
          icon={Italic}
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("underline")}
          icon={Underline}
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
          }}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          onClick={() => {
            editor.chain().focus().toggleStrike().run();
          }}
          disabled={permission === "read"}
        />
      </div>
      <div className="flex items-center gap-4 px-4">
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "justify" })}
          icon={AlignJustify}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          disabled={permission === "read"}
        />
      </div>
      <div className="flex items-center gap-4 px-4">
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("blockquote")}
          icon={MessageSquareQuote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={permission === "read"}
        />
      </div>
      <div className="flex items-center gap-4 px-4">
        <FileUploadInput
          src={EditAvatar}
          ref={fileInputRef}
          accept="*/*"
          hidden={true}
          onChange={handlePreviewFile}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("link")}
          icon={Link}
          onClick={() => fileInputRef.current?.click()}
          disabled={permission === "read"}
        />
        <ToolbarButton
          isActive={editor.isActive("link")}
          icon={Unlink}
          onClick={() => unsetLink(editor)}
          disabled={permission === "read"}
        />
      </div>
      <div className="flex items-center px-4">
        <ToolbarButton
          isActive={editor.isActive("highlight")}
          icon={Highlighter}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          disabled={permission === "read"}
        />
      </div>

      {noteDetail?.text_note?.text_content && (
        <div className="flex items-center pl-4">
          <IconButton
            onClick={handleCreateSummary}
            customStyle="text-silver-chalice stroke-[1.5]"
            size="w-5 h-5"
            icon={Sparkles}
            data-tooltip-id={
              noteDetail?.text_note?.summary
                ? "resummarize-tooltip"
                : "summarize-tooltip"
            }
            data-tooltip-content={
              permission === "read"
                ? "You cannot edit this note"
                : noteDetail?.text_note?.summary
                  ? "Resummarize"
                  : "Summarize"
            }
            disabled={permission === "read"}
          />
          <Tooltip
            id={
              noteDetail?.text_note?.summary
                ? "resummarize-tooltip"
                : "summarize-tooltip"
            }
            place="right"
            style={{
              backgroundColor: "#6368d1",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            className="font-body"
          />
        </div>
      )}
    </div>
  );
};

export default MenuBar;
