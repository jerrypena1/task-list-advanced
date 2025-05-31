import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { useVariables } from '../../context/variableContext';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [renderedCode, setRenderedCode] = useState(code);
  const timeoutRef = useRef<number>();

  const { variables, mergingVariables } = useVariables();

  useEffect(() => {
    Prism.highlightAll();
  }, [renderedCode]);

  useEffect(() => {
    if (mergingVariables) {
      setRenderedCode(renderCodeBlockCode(code));
    } else {
      setRenderedCode(code);
    }
  }, [code, variables, mergingVariables]);

  const renderCodeBlockCode = (code: string): string => {
    function replaceTokenIgnoreCase(input: string, tokenDefinition: {token: string, value: string}): string {
      const { token, value } = tokenDefinition;
      // Build a regex to match %%token%% regardless of case
      const pattern = `%%${token}%%`;
      const escapedPattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedPattern, 'gi');
      return input.replace(regex, value);
    }

    let tempCode = code;
    try {
      variables.forEach(variable => {
        tempCode = replaceTokenIgnoreCase(tempCode, variable);
      })
      return tempCode;
    } catch(error) {
      console.error('ERROR: not able to merge variable tokens for codeblock: ', error);
      return code;
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(renderedCode);
    setCopied(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative mt-2 group">
      <pre className="rounded-md bg-gray-50 p-4">
        <code className={`language-${language}`}>{renderedCode}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy size={16} className="text-gray-500" />
        )}
      </button>
    </div>
  );
}
