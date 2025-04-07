import React from "react";
import ToolbarButton from "../ui/Toolbar";
import {
  MessageSquareQuote,
  List,
  ListOrdered,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Highlighter,
  Strikethrough,
  Paperclip,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const options = [
    { value: "paragraph", label: "Paragraph", icon: <Pilcrow size={16} /> },
    { value: "1", label: "Heading 1", icon: <Heading1 size={16} /> },
    { value: "2", label: "Heading 2", icon: <Heading2 size={16} /> },
    { value: "3", label: "Heading 3", icon: <Heading3 size={16} /> },
    { value: "text", label: "Text", icon: <Type size={16} /> },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    editor.chain().focus();

    if (value === "paragraph") {
      editor.setParagraph().run();
    } else if (value === "text") {
      editor.clearNodes().run();
    } else {
      editor.toggleHeading({ level: Number(value) }).run();
    }
  };

  return (
    <div className="border-gallery mb-4 flex items-center gap-8 border-b pb-2">
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
      <ToolbarButton
        isActive={editor.isActive("highlight")}
        icon={Paperclip}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />
      <ToolbarButton
        isActive={editor.isActive("highlight")}
        icon={Highlighter}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />
    </div>
  );
};

export default MenuBar;
