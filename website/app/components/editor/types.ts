/**
 * Visual Editor Types
 * Types for the Lovable-style visual editor system
 */

export interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SelectedElement {
  id: string;
  tagName: string;
  textContent: string;
  position: ElementPosition;
  styles: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
  attributes: Record<string, string>;
  path: string; // CSS selector path
}

export interface ElementTreeNode {
  id: string;
  tagName: string;
  textContent?: string;
  children: ElementTreeNode[];
  depth: number;
}

export interface EditorMessage {
  type:
    | "selection"
    | "hover"
    | "unhover"
    | "update"
    | "tree"
    | "ready"
    | "error"
    | "getHtml"
    | "setHtml"
    | "html";
  payload?: any;
}

export interface StyleUpdate {
  property: string;
  value: string;
}

export interface ContentUpdate {
  content: string;
}

export interface EditorState {
  selectedElement: SelectedElement | null;
  hoveredElement: SelectedElement | null;
  elementTree: ElementTreeNode[];
  editMode: "select" | "text" | "resize";
  canUndo: boolean;
  canRedo: boolean;
}

export interface EditorActions {
  selectElement: (element: SelectedElement | null) => void;
  hoverElement: (element: SelectedElement | null) => void;
  updateStyle: (updates: Record<string, string>) => void;
  updateContent: (content: string) => void;
  deleteElement: () => void;
  duplicateElement: () => void;
  setEditMode: (mode: "select" | "text" | "resize") => void;
  undo: () => void;
  redo: () => void;
  pushHistory: (html: string) => void;
}
