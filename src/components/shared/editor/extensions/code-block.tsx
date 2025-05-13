import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import "./code-block.css";
export default function CodeBlock({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  const language = node.attrs.language || 'null';
  
  return (
    <NodeViewWrapper className="code-block">
      <select
        contentEditable={false}
        defaultValue={language}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
