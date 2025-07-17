import { useCallback, useEffect, useRef } from 'react';
import { handleImagePaste } from '../utils/imageUpload';

interface UseImagePasteOptions {
  onImageUploaded: (markdownText: string, cursorPosition?: number) => void;
  onError: (error: string) => void;
}

export function useImagePaste({ onImageUploaded, onError }: UseImagePasteOptions) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const uploadingRef = useRef<boolean>(false);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (uploadingRef.current) return; // Prevent multiple uploads

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    
    handleImagePaste(
      event,
      (markdownText) => {
        if (markdownText.includes('Uploading')) {
          uploadingRef.current = true;
          // Insert loading text at cursor position
          const currentValue = textarea.value;
          const newValue = 
            currentValue.slice(0, cursorPosition) + 
            markdownText + 
            currentValue.slice(cursorPosition);
          
          onImageUploaded(newValue, cursorPosition + markdownText.length);
        } else {
          uploadingRef.current = false;
          if (markdownText === '') {
            // Error case - remove loading text
            const currentValue = textarea.value;
            const loadingText = '![Uploading image...](uploading)';
            const newValue = currentValue.replace(loadingText, '');
            onImageUploaded(newValue);
          } else {
            // Success case - replace loading text with actual image
            const currentValue = textarea.value;
            const loadingText = '![Uploading image...](uploading)';
            const newValue = currentValue.replace(loadingText, markdownText);
            onImageUploaded(newValue);
          }
        }
      },
      (error) => {
        uploadingRef.current = false;
        onError(error);
      }
    );
  }, [onImageUploaded, onError]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('paste', handlePaste);
    
    return () => {
      textarea.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return { textareaRef };
}
