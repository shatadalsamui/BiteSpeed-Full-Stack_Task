
# BiteSpeed Full Stack Task

This project is a simple flow builder using React, TypeScript, Vite, and React Flow. You can add message nodes by dragging and dropping, edit their text, and connect them visually.

## How to Add a Message Node


1. **Open the app in your browser.**
2. Go to the right sidebar and find the "Nodes Panel".
3. Click and hold the **Message** node (✉️), then drag it onto the main canvas area and release to drop it.
4. The new message node will appear where you dropped it.
5. Click any node to edit its text or delete it from the sidebar.
6. To connect nodes, drag from the small circle (handle) on the right side of one node to the left side of another node.

## Features Used

- **React** + **TypeScript** + **Vite**
- **React Flow** for drag-and-drop node-based UI
- **Tailwind CSS** for styling
- **react-icons** for icons

## Folder Structure (Key Parts)

```
src/
  App.tsx                # Main app logic and flow rendering
  components/
    Header.tsx           # Save button and validation
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

Open the app at the local URL shown in your terminal.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
