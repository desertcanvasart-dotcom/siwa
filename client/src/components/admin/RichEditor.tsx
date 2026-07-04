import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Minus,
  Pilcrow,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { class: "text-coastal underline underline-offset-2" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-none my-6" } }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing the article…",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm md:prose max-w-none min-h-[420px] px-5 py-4 focus:outline-none font-body text-ink leading-[1.85]",
      },
    },
  });

  // Sync external value into editor (e.g. when editing existing post loads).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-sand bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (
    active: boolean,
    onClick: () => void,
    Icon: any,
    label: string,
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`h-8 w-8 flex items-center justify-center border border-transparent hover:border-sand transition-colors ${
        active ? "bg-navy text-cream" : "text-ink-soft hover:text-navy"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const promptLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const promptImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-sand bg-cream/50">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), Bold, "Bold")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), Italic, "Italic")}
      <span className="w-px h-5 bg-sand mx-1" />
      {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), Heading1, "Heading 1")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, "Heading 2")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3, "Heading 3")}
      {btn(editor.isActive("paragraph"), () => editor.chain().focus().setParagraph().run(), Pilcrow, "Paragraph")}
      <span className="w-px h-5 bg-sand mx-1" />
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), List, "Bullet list")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, "Numbered list")}
      {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), Quote, "Quote")}
      {btn(false, () => editor.chain().focus().setHorizontalRule().run(), Minus, "Divider")}
      <span className="w-px h-5 bg-sand mx-1" />
      {btn(editor.isActive("link"), promptLink, LinkIcon, "Link")}
      {btn(false, promptImage, ImageIcon, "Image")}
      <span className="w-px h-5 bg-sand mx-1" />
      {btn(false, () => editor.chain().focus().undo().run(), Undo2, "Undo")}
      {btn(false, () => editor.chain().focus().redo().run(), Redo2, "Redo")}
    </div>
  );
}

export default RichEditor;
