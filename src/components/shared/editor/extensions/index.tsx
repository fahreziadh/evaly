import CharacterCount from "@tiptap/extension-character-count";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { UploadImagesPlugin } from "../plugins/upload-images";
import { cx } from "class-variance-authority";
import UpdatedImage from "./updated-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlock from "./code-block";
import { createLowlight, all } from "lowlight";
import Placeholder from '@tiptap/extension-placeholder';

const lowlight = createLowlight(all);

export const extensions = (params: { limit?: number, placeholder?: string }) => [
  TextStyle.configure(),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: true,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: true,
    },
  }),
  Underline.configure({
    HTMLAttributes: {
      class: "underline",
    },
  }),
  Link.configure({
    openOnClick: true,
  }),
  CharacterCount.configure({
    limit: params.limit,
  }),
  TiptapImage.extend({
    addProseMirrorPlugins() {
      return [
        UploadImagesPlugin({
          imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
        }),
      ];
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: cx("rounded-lg border border-muted"),
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: cx("rounded-lg border border-muted"),
    },
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlock);
    },
  }).configure({
    lowlight,
    HTMLAttributes: { class: cx("rounded-lg border border-muted font-mono") },
  }),
  Placeholder.configure({
    placeholder: params.placeholder || "Write something...",
  }),
];
