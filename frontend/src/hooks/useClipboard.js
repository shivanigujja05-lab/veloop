import { useState, useCallback } from 'react';

export const useClipboard = (timeout = 2500) => {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        await navigator.clipboard.writeText(text);
      }

      setCopiedText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
        setCopiedText(null);
      }, timeout);

      return true;
    },
    [timeout]
  );

  return { copy, isCopied, copiedText };
};

