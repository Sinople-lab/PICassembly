// Martin Carballo november 03 / 2024

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
        <code className="font-mono text-sm">{code}</code>
      </pre>
    </div>
  );
}