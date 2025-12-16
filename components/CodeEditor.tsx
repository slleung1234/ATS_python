import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, disabled }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Simple Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Need to set selection after render, setTimeout is a quick hack for raw textarea
      setTimeout(() => {
        if (e.target instanceof HTMLTextAreaElement) {
            e.target.selectionStart = e.target.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] rounded-lg border border-slate-700 overflow-hidden font-mono text-sm">
      <div className="bg-[#252526] px-4 py-2 text-slate-400 text-xs flex justify-between items-center border-b border-slate-700">
        <span>solution.py</span>
        <span className="text-[10px] uppercase tracking-wider">Python 3</span>
      </div>
      <div className="flex-1 relative group">
        <textarea
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            spellCheck={false}
            className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 resize-none focus:outline-none leading-relaxed selection:bg-[#264f78]"
            style={{
                fontFamily: '"JetBrains Mono", monospace',
            }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
