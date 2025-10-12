"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  height?: string;
}

const MarkdownEditor = ({
  value,
  onChange,
  textareaRef,
  height = "h-96",
}: MarkdownEditorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${height} p-4 border-2 border-primary/40 rounded-xl bg-card/50 backdrop-blur-sm font-mono text-sm text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/60 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]`}
          placeholder="Enter markdown content here...\n\nExample for image: ![Alt text](image_url)"
        />
      </div>
      <div
        className={`prose prose-invert max-w-none p-4 border-2 border-primary/40 rounded-xl bg-card/50 backdrop-blur-sm overflow-auto ${height} shadow-[0_0_15px_rgba(99,102,241,0.1)] font-mono text-sm text-white`}
      >
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {value}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
