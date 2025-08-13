# Live Demo

[https://bite-speed-full-stack-task.vercel.app/](https://bite-speed-full-stack-task.vercel.app/)



# Full Stack Task BiteSpeed — Shatadal Samui

**Assessment project for job application | [shatadalsamuimain@gmail.com](mailto:shatadalsamuimain@gmail.com)**

This is a visual message flow builder built with React, TypeScript, Vite, and React Flow. Drag and drop message nodes, connect them, and edit their content in a modern UI.

## How to Use

1. **Open the app in your browser.**
2. In the right sidebar (Nodes Panel), drag the **Message** node (✉️) onto the canvas.
3. Drop it anywhere to add a new message node.
4. Click a node to edit its text or delete it (see sidebar).
5. Connect nodes by dragging from the right handle of one node to the left handle of another.
6. The UI prevents self-loops and cycles for logical flows.

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **React Flow** (visual node-based editor)
- **Tailwind CSS** (styling)
- **react-icons** (icons)

## Folder Structure (Key Parts)

```tsx
src/
  App.tsx                # Main app logic and flow rendering
  components/
    Header.tsx           # Top bar with title and save button
    nodes/
      TextMessageNode.tsx  # Message node UI
      node-styles.css      # Node styles
    panels/
      NodesPanel.tsx     # Sidebar panel for draggable nodes
      Sidebar.tsx        # Main sidebar logic (switches between panels)
      SettingsPanel.tsx  # Edit/delete node UI
```


## Quick Start

```bash
npm install
npm run dev
```

Then open the app at the local URL shown in your terminal.

