import React, { useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ content, onChange, error, maxLength = 5000 }) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false
    },
    keyboard: {
      bindings: {
        tab: false
      }
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link', 'image'
  ];

  const handleChange = useCallback((value) => {
    // Strip HTML to count characters
    const text = value.replace(/<[^>]*>/g, '');
    if (text.length <= maxLength) {
      onChange(value);
    }
  }, [onChange, maxLength]);

  const characterCount = useMemo(() => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    return text.length;
  }, [content]);

  const wordCount = useMemo(() => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  return (
    <div className="rich-text-editor space-y-2">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className={`bg-white transition-colors ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500'}`}
      />
      
      <div className="flex justify-between text-sm text-gray-500">
        <div className="space-x-4">
          <span>{characterCount}/{maxLength} characters</span>
          <span>•</span>
          <span>{wordCount} words</span>
        </div>
        {error && (
          <span className="text-red-500">{error}</span>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;