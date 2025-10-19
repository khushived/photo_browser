# Copilot Instructions for Photo Browser React App

## Architecture Overview
This is a client-side React application for browsing local photo folders. The app uses modern web APIs for file access without a backend.

**Key Components:**
- `App.js`: Main component managing folder navigation, file listing, and image viewer state
- `ImageViewer.js`: Modal component for viewing images with navigation and metadata
- `App.css`: Styles for responsive grid layout and modal viewer

**Data Flow:**
1. User selects folder via File System Access API
2. App loads directory contents (folders and files)
3. Images are loaded as object URLs for display
4. Clicking images opens viewer with keyboard navigation
5. Metadata extracted from file handles

## Development Patterns
- **State Management**: React hooks (`useState`, `useEffect`) for component state
- **File Handling**: File System Access API with async iteration over directory entries
- **Image Loading**: `URL.createObjectURL()` for client-side image display, cleaned up on directory changes
- **Navigation**: Breadcrumb-style path display with back button
- **Sorting**: Folders first, then alphabetical by name
- **Error Handling**: Try-catch blocks around API calls, console logging for debugging

## Key Conventions
- **File Extensions**: Images detected via regex `/\.(jpg|jpeg|png|gif|bmp|webp)$/i`
- **Component Structure**: Functional components with hooks, no class components
- **Styling**: CSS classes in separate file, responsive grid with `grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))`
- **Event Handling**: Keyboard events for viewer navigation (Arrow keys, Escape)
- **Performance**: Load all images on directory change, suitable for moderate folder sizes

## Workflows
- **Development**: `npm start` runs dev server on localhost:3000
- **Build**: `npm run build` creates production bundle in `build/` directory
- **Testing**: `npm test` runs Jest tests (currently minimal)
- **Deployment**: Static hosting (e.g., Netlify, Vercel) since fully client-side

## External Dependencies
- **React/React-DOM**: Core framework (v18+)
- **File System Access API**: Modern browser API for directory access (Chrome/Edge)
- **No external libraries**: Pure React implementation for simplicity

## Browser Compatibility
- Requires modern browser supporting File System Access API
- Graceful degradation needed for unsupported browsers (e.g., fallback to file input)

## Common Tasks
- Adding new image formats: Update regex in `loadDirectory`
- Improving layout: Modify CSS grid properties
- Adding features: Extend state in `App.js` and pass props to components
- Performance optimization: Implement lazy loading for large directories