# Visual Editor

A Lovable-style visual editor for editing HTML previews. Click on elements to select them, then edit their properties in the sidebar.

## Features

- **Click to Select**: Click any element in the preview to select it
- **Visual Feedback**: Selected elements show a blue border with resize handles
- **Properties Panel**: Edit text content, colors, typography, and spacing
- **Component Tree**: View and navigate the element hierarchy
- **Quick Actions**: Duplicate or delete elements with one click
- **Keyboard Shortcuts**: Press `Escape` to deselect

## Usage

```tsx
import { VisualEditor } from "@/app/components/editor";

function MyComponent() {
  const [html, setHtml] = useState("<html>...</html>");

  return (
    <VisualEditor
      html={html}
      onHtmlChange={setHtml}
      className="h-screen"
    />
  );
}
```

## Props

### VisualEditor

- `html: string` - The HTML to display and edit
- `onHtmlChange?: (html: string) => void` - Callback when HTML changes
- `className?: string` - Additional CSS classes

## Architecture

### Components

1. **VisualEditor**: Main wrapper that provides the editor layout
2. **EditorContext**: State management for selection and editing
3. **SelectionOverlay**: Blue border and resize handles for selected element
4. **PropertiesPanel**: Right sidebar for editing element properties
5. **ComponentTree**: Left sidebar showing element hierarchy

### Communication

The editor uses postMessage to communicate between the parent window and the iframe:

- **selection**: Element was selected
- **hover**: Element is being hovered
- **update**: Apply style or content changes
- **tree**: Update the element tree
- **ready**: Iframe has loaded and is ready

### Selection System

Elements are tracked using a WeakMap to assign unique IDs without modifying the DOM. The selection script is injected into the iframe and handles:

- Click events to select elements
- Hover effects
- Style and content updates
- Element tree generation

## Customization

### Styling

The editor uses Tailwind CSS and follows the terminal theme:

- `terminal-bg`: Background color
- `terminal-text`: Text color
- `terminal-accent`: Accent color (blue)
- `terminal-dim`: Dimmed text color

### Adding Features

To add new editing capabilities:

1. Add the feature to the injection script (`iframe-injector.ts`)
2. Update the EditorContext with new actions
3. Add UI controls to PropertiesPanel or SelectionOverlay
4. Update types in `types.ts`

## Example: Integrating with AIPreview

```tsx
import { VisualEditor } from "@/app/components/editor";

export function AIPreview() {
  const [localPreviewHtml, setLocalPreviewHtml] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  if (editMode && localPreviewHtml) {
    return (
      <VisualEditor
        html={localPreviewHtml}
        onHtmlChange={setLocalPreviewHtml}
        className="h-[600px]"
      />
    );
  }

  return (
    // ... existing preview iframe ...
  );
}
```

## Browser Support

The editor requires modern browser features:

- postMessage API
- WeakMap
- MutationObserver (optional, for future features)
- CSS Grid and Flexbox

## Performance

The editor is optimized for performance:

- Element IDs are cached using WeakMap
- Style updates are batched
- Tree updates are debounced
- Only visible elements are tracked

## Security

The iframe uses a restrictive sandbox:

```html
sandbox="allow-scripts allow-same-origin"
```

This allows the editor to communicate with the iframe while preventing:

- Form submissions
- Navigation
- Popup windows
- Downloads

## Future Enhancements

- [ ] Drag to reorder elements in tree
- [ ] Undo/redo support
- [ ] Copy/paste styles
- [ ] Responsive breakpoint editor
- [ ] CSS class editor
- [ ] Image upload and replacement
- [ ] Link editor
- [ ] Animation controls
