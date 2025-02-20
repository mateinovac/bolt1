import React, { useState, useRef } from 'react';
import { X, Play, Loader2, Trash2, Send } from 'lucide-react';

interface CodeRunnerProps {
  code: string;
  language: string;
  onClose: () => void;
}

export function CodeRunner({ code: initialCode, language, onClose }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Map common language names to Piston API language names
  const getLanguageAlias = (lang: string): string => {
    const aliases: Record<string, string> = {
      'js': 'javascript',
      'javascript': 'javascript',
      'python': 'python3',
      'py': 'python3',
      'rb': 'ruby',
      'ruby': 'ruby',
      'cpp': 'cpp',
      'c++': 'cpp',
      'java': 'java',
      'cs': 'csharp',
      'csharp': 'csharp',
      'php': 'php',
      'go': 'go',
      'swift': 'swift',
      'ts': 'typescript',
      'typescript': 'typescript'
    };
    return aliases[lang.toLowerCase()] || lang.toLowerCase();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      // Validate language support
      const lang = getLanguageAlias(language);
      if (!lang) {
        throw new Error(`Language "${language}" is not supported`);
      }
      
      // Map languages to their latest stable versions
      const versions: Record<string, string> = {
        javascript: '18.15.0',
        python3: '3.10.0',
        ruby: '3.0.0',
        cpp: '10.2.0',
        java: '15.0.2',
        csharp: '6.12.0',
        php: '8.2.3',
        go: '1.16.2',
        swift: '5.3.3',
        typescript: '5.0.3'
      };

      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: lang,
          version: versions[lang] || '0.0.1',
          files: [{
            name: 'main',
            content: code
          }],
          args: []
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data || !data.run) {
        throw new Error('Invalid response from execution API');
      }

      if (data.run.output !== undefined) {
        setOutput(data.run.output);
      } else if (data.run.stderr) {
        setError(data.run.stderr);
      } else if (data.message) {
        setError(data.message);
      } else {
        setError('No output received from execution');
      }
    } catch (err) {
      console.error('Code execution error:', err);
      setError(
        err instanceof Error 
          ? `Execution failed: ${err.message}. Please try a different language or check your code.` 
          : 'Failed to execute code. Please check the language selection and try again.'
      );
    } finally {
      setIsRunning(false);
    }
  };

  const clearConsole = () => {
    setOutput('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">Code Runner</h3>
            <span className="text-sm text-gray-400">({language})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-4 space-y-4">
          <div className="h-1/2">
            <div className="text-sm text-gray-400 mb-2">Code Editor</div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[calc(100%-2rem)] p-4 bg-gray-800 text-white font-mono text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              spellCheck={false}
            />
          </div>

          <div className="h-1/2">
            <div className="flex items-center justify-between mb-2">
              <span>Interactive Console</span>
              <button
                onClick={clearConsole}
                className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                title="Clear console"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div 
              ref={outputRef}
              className="w-full h-[calc(100%-2rem)] p-4 bg-gray-800 text-white font-mono text-sm rounded-lg overflow-auto"
            >
              {error ? (
                <div className="text-red-400">
                  <p className="font-bold mb-1">Error:</p>
                  <pre className="whitespace-pre-wrap">{error}</pre>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-gray-500">Click Run to execute the code...</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Code</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-400">
              {isRunning ? 'Running code...' : 'Click Run to execute the code.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
