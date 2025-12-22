/**
 * Visual Editor Components
 * Lovable-style visual editor for editing preview HTML with real-time collaboration
 */

export { VisualEditor } from "./VisualEditor";
export { CollaborativeVisualEditor } from "./CollaborativeVisualEditor";
export { EditorProvider, useEditor } from "./EditorContext";
export {
  CollaborativeEditorProvider,
  useCollaborativeEditor,
} from "./CollaborativeEditorContext";
export { SelectionOverlay } from "./SelectionOverlay";
export { PropertiesPanel } from "./PropertiesPanel";
export { ComponentTree } from "./ComponentTree";
export { RemoteCursor } from "./RemoteCursor";
export { PresenceIndicator } from "./PresenceIndicator";
export * from "./types";
