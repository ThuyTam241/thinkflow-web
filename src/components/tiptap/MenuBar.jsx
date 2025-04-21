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
    <div className="border-gallery mb-4 flex items-center gap-8 border-b pb-1.5">
      <div className="flex items-center gap-4">
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        />
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />
      </div>
      <div className="flex items-center gap-4">
        <ToolbarButton
          isActive={editor.isActive("bold")}
          icon={Bold}
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
        />
        <ToolbarButton
          isActive={editor.isActive("italic")}
          icon={Italic}
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
        />
        <ToolbarButton
          isActive={editor.isActive("underline")}
          icon={Underline}
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
          }}
        />
        <ToolbarButton
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          onClick={() => {
            editor.chain().focus().toggleStrike().run();
          }}
        />
      </div>
      <div className="flex items-center gap-4">
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "justify" })}
          icon={AlignJustify}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        />
      </div>
      <div className="flex items-center gap-4">
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          isActive={editor.isActive("blockquote")}
          icon={MessageSquareQuote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
      </div>
      <div className="flex items-center gap-4">
        <FileUploadInput
          src={EditAvatar}
          ref={fileInputRef}
          accept="*/*"
          hidden={true}
          onChange={handlePreviewFile}
        />
        <ToolbarButton
          isActive={editor.isActive("link")}
          icon={Link}
          onClick={() => fileInputRef.current?.click()}
        />
        <ToolbarButton
          isActive={editor.isActive("link")}
          icon={Unlink}
          onClick={() => unsetLink(editor)}
        />
      </div>
      <ToolbarButton
        isActive={editor.isActive("highlight")}
        icon={Highlighter}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />

      {noteDetail?.text_note?.text_content && (
        <>
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
              noteDetail?.text_note?.summary ? "Resummarize" : "Summarize"
            }
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
        </>
      )}
    </div>
  );
};

export default MenuBar;
