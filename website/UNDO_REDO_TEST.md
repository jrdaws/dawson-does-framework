# Undo/Redo Test Guide

## 🎯 What We're Testing

Yjs-powered undo/redo functionality in the collaborative editor with:
- Keyboard shortcuts (Cmd/Ctrl+Z for undo, Cmd/Ctrl+Shift+Z for redo)
- UI buttons in floating toolbar
- Per-user undo stacks (each user can undo their own changes without affecting others)

## ✅ Servers Status

- ✅ Collaboration Server: ws://localhost:1234/collaborate
- ✅ Next.js Dev Server: http://localhost:3000
- ✅ Collaboration Package: Rebuilt with Y.UndoManager

## 🚀 Test 1: Single User Undo/Redo (5 minutes)

### Setup

1. **Open Browser**: http://localhost:3000
2. **Open DevTools**: Press F12 (keep Console tab visible)
3. **Configure Project**:
   - Template: Any (e.g., "SaaS")
   - Project Name: **"undo-test"**
   - Click through steps to AI Preview
4. **Enter Edit Mode**: Click "Edit Mode" button
5. **Verify Toolbar**: Top-right should show floating undo/redo toolbar

### Test Sequence

**Step 1: Make Multiple Edits**
```
1. Click on a HEADING element
2. In Properties Panel, change text to "Edit 1"
3. Click on a PARAGRAPH element
4. Change text to "Edit 2"
5. Click on a BUTTON element
6. Change text to "Edit 3"
```

**Expected:**
- ✅ Undo button becomes enabled (not grayed out)
- ✅ Redo button stays disabled
- ✅ Console logs show each edit

**Step 2: Test Undo via Button**
```
1. Click the "Undo" button in toolbar
2. Observe the changes
```

**Expected:**
- ✅ Button text reverts to previous state (before "Edit 3")
- ✅ Redo button becomes enabled
- ✅ Console shows: "[useCollaborativeDocument] Undo performed"

**Step 3: Test Multiple Undos**
```
1. Click "Undo" button again
2. Click "Undo" button again
```

**Expected:**
- ✅ Each click reverts one more edit
- ✅ After 3 undos, should be back to original state
- ✅ Undo button becomes disabled (nothing left to undo)
- ✅ Redo button stays enabled

**Step 4: Test Redo via Keyboard**
```
1. Press Cmd+Shift+Z (Mac) or Ctrl+Shift+Z (Windows/Linux)
2. Press again
3. Press again
```

**Expected:**
- ✅ Each press restores one edit
- ✅ After 3 redos, all edits are restored
- ✅ Redo button becomes disabled
- ✅ Undo button becomes enabled

**Step 5: Test Undo via Keyboard**
```
1. Press Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
2. Observe changes
```

**Expected:**
- ✅ Most recent edit is undone
- ✅ Keyboard shortcut works same as button

**Step 6: Test Undo Stack Clearing**
```
1. Undo once (Cmd+Z)
2. Make a NEW edit (change any text)
3. Try to Redo
```

**Expected:**
- ✅ Redo button becomes disabled after new edit
- ✅ Redo stack is cleared (expected Yjs behavior)
- ✅ Can undo the new edit

---

## 🚀 Test 2: Collaborative Undo (Multi-User) (10 minutes)

### Setup Window 1 & 2

**Window 1:**
1. Open http://localhost:3000
2. DevTools Console open
3. Project: "collab-undo-test"
4. Enter Edit Mode

**Window 2:**
1. Open NEW browser window (Incognito recommended)
2. Open http://localhost:3000
3. DevTools Console open
4. Project: **"collab-undo-test"** (SAME NAME!)
5. Enter Edit Mode
6. Verify: "1 user online" in presence indicator

### Test Sequence

**Phase 1: User 1 Makes Edits**
```
Window 1:
1. Click heading, change to "User 1 - Edit A"
2. Click paragraph, change to "User 1 - Edit B"
3. Observe undo button is enabled
```

**Phase 2: User 2 Makes Different Edits**
```
Window 2:
1. Click a DIFFERENT heading, change to "User 2 - Edit X"
2. Click a DIFFERENT paragraph, change to "User 2 - Edit Y"
3. Observe undo button is enabled
```

**Phase 3: User 1 Undoes Their Changes**
```
Window 1:
1. Click "Undo" button (or Cmd+Z)
2. Click "Undo" again
```

**Expected:**
```
✅ Window 1: User 1's edits (A & B) are reverted
✅ Window 2: User 2's edits (X & Y) remain UNCHANGED
✅ This demonstrates per-user undo stacks!
✅ Each user can undo their own work without affecting others
```

**Phase 4: User 2 Undoes Their Changes**
```
Window 2:
1. Click "Undo" button
2. Click "Undo" again
```

**Expected:**
```
✅ Window 2: User 2's edits are reverted
✅ Window 1: Still shows reverted state
✅ Both windows back to original content
```

**Phase 5: Verify Redo Works Independently**
```
Window 1:
1. Click "Redo" (or Cmd+Shift+Z)

Window 2:
1. Observe - nothing changes in Window 2
```

**Expected:**
```
✅ Only User 1's edit is restored
✅ User 2's redo stack is independent
✅ Collaborative undo works correctly!
```

---

## 🎨 Visual Reference

### Toolbar Appearance

```
┌─────────────────────────────┐
│  ⟲ Undo  │  ⟳ Redo  ⌘Z ⌘⇧Z│  ← Floating top-right
└─────────────────────────────┘
```

**Button States:**
- **Enabled**: Text is bright, hover effect works
- **Disabled**: Text is grayed out (30% opacity), no hover

### Keyboard Shortcuts

| Shortcut | Action | Works When |
|----------|--------|------------|
| Cmd/Ctrl+Z | Undo | canUndo = true |
| Cmd/Ctrl+Shift+Z | Redo | canRedo = true |

---

## 📊 Console Logs to Expect

### When Making Edits:
```
📝 [CollaborativeEditor] Received HTML update from iframe
📤 [useCollaborativeHTML] Sending local update
```

### When Undoing:
```
[useCollaborativeDocument] Undo performed
📥 [useCollaborativeHTML] Received remote update (in other windows)
```

### When Redoing:
```
[useCollaborativeDocument] Redo performed
📥 [useCollaborativeHTML] Received remote update (in other windows)
```

---

## ✅ Success Criteria

### Single User:
- [ ] Undo button works (click)
- [ ] Redo button works (click)
- [ ] Cmd/Ctrl+Z works (keyboard)
- [ ] Cmd/Ctrl+Shift+Z works (keyboard)
- [ ] Buttons enable/disable correctly
- [ ] Changes revert accurately
- [ ] New edit clears redo stack

### Multi-User:
- [ ] Each user has independent undo stack
- [ ] User 1 undo doesn't affect User 2's edits
- [ ] User 2 undo doesn't affect User 1's edits
- [ ] Redo works independently per user
- [ ] No conflicts or errors
- [ ] All changes sync correctly

### UI/UX:
- [ ] Toolbar visible and accessible
- [ ] Buttons styled correctly (enabled/disabled states)
- [ ] Keyboard shortcuts don't conflict
- [ ] No flickering or jumps
- [ ] Smooth transitions

---

## ❌ Common Issues

### Issue: Undo Button Always Disabled

**Check:**
1. Are you making edits through the Properties Panel?
2. Console shows "Undo performed"?
3. Try hard refresh (Cmd+Shift+R)

**Debug:**
```javascript
// In browser console:
console.log('canUndo:', window.__debug_canUndo);
console.log('canRedo:', window.__debug_canRedo);
```

### Issue: Keyboard Shortcuts Not Working

**Check:**
1. Focus is on the page (not DevTools)?
2. Try clicking in the editor first
3. Check browser shortcuts aren't overriding

### Issue: Undo Affects Other User's Changes

**Possible Causes:**
1. UndoManager not using correct trackedOrigins
2. Both users in same browser (use Incognito)
3. WebSocket connection issue

**Fix:**
- Restart collaboration server
- Use separate browsers/devices
- Check console for errors

### Issue: Changes Not Syncing After Undo

**Check:**
1. WebSocket still connected?
2. Both windows in same project?
3. Console errors?

**Fix:**
- Refresh both windows
- Restart servers

---

## 🐛 Debugging Tips

### Check UndoManager State

In browser console:
```javascript
// Get awareness state
const awareness = window.__yjs_awareness;
if (awareness) {
  const doc = awareness.doc;
  console.log('Doc state:', doc?.getMap('state').toJSON());
}
```

### Verify Keyboard Events

```javascript
// Log keyboard events
window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey) {
    console.log('Modifier+', e.key, 'shift:', e.shiftKey);
  }
});
```

### Check Undo Stack Size

The Y.UndoManager tracks:
- `undoStack.length` - number of undo operations available
- `redoStack.length` - number of redo operations available

These should update as you make edits and undo/redo.

---

## 📸 Screenshot Checklist

For bug reports, capture:
1. ✅ Toolbar showing button states
2. ✅ Console logs before/after undo
3. ✅ Multi-window view side-by-side
4. ✅ Presence indicator showing users

---

## 🎉 Expected Outcome

After testing:
- **Single User**: Smooth undo/redo with both buttons and keyboard
- **Multi-User**: Independent undo stacks per user
- **Performance**: No lag, instant updates
- **UX**: Clear visual feedback, intuitive controls

---

## 🚀 Advanced Testing (Optional)

### Test 1: Rapid Undo/Redo
1. Make 10 quick edits
2. Undo 10 times rapidly
3. Redo 10 times rapidly

**Expected:** No errors, all changes tracked

### Test 2: Mixed Operations
1. User 1: Edit heading
2. User 2: Edit paragraph
3. User 1: Edit button
4. User 2: Undo their paragraph edit
5. User 1: Undo heading edit

**Expected:** Each undo only affects that user's edit

### Test 3: Network Interruption
1. Make edits
2. Stop collaboration server (Ctrl+C)
3. Try to undo
4. Restart server

**Expected:** Local undo still works, syncs when reconnected

---

## 📞 Report Results

After testing, provide:
- ✅ **Single User Tests**: Pass/Fail for each step
- ✅ **Multi-User Tests**: Pass/Fail for collaborative undo
- ❌ **Issues Found**: Describe any unexpected behavior
- 📊 **Console Logs**: Copy any errors or warnings
- 📸 **Screenshots**: If visual issues occur

---

**Ready to test!** Start with Test 1 (single user), then proceed to Test 2 (multi-user). 🎯
