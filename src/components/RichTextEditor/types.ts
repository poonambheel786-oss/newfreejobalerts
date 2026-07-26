export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

export type EditorCommand = 
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "indent"
  | "outdent"
  | "removeFormat"
  | "formatBlock"
  | "createLink"
  | "insertHorizontalRule"
  | "foreColor"
  | "hiliteColor"
  | "fontSize";
