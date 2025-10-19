# Photo Browser

A modern, accessible web-based photo browser that allows you to explore and view images from your local folders directly in your browser.

![Photo Browser Interface](https://via.placeholder.com/800x400/4a90e2/ffffff?text=Photo+Browser+Interface)

## ✨ Features

### 🖼️ Image Viewing & Navigation
- **Responsive masonry grid layout** for beautiful image display
- **Full-screen image viewer** with smooth navigation
- **Keyboard navigation**: Use arrow keys (←/→) to navigate between images, Escape to close viewer
- **Click navigation**: Previous/Next buttons for easy browsing

### 📁 File System Integration
- **Secure local file access** using the File System Access API
- **Folder browsing** with intuitive navigation
- **Back button** to navigate to parent directories
- **File type differentiation** with appropriate icons and actions

### 🔍 Search & Filter
- **Real-time search** through file names
- **Instant filtering** of the image grid as you type

### 📄 Multi-format Support
- **Image formats**: JPG, PNG, GIF, WebP, BMP, SVG
- **Text file preview**: TXT, MD, JSON, JS/JSX, TS/TSX, CSS, HTML, XML
- **Document download**: PDF, DOC, DOCX
- **Archive download**: ZIP, RAR, 7Z
- **Media download**: MP3, WAV, FLAC, MP4, AVI, MKV

### ♿ Accessibility Features
- **Keyboard navigation** throughout the application
- **Screen reader friendly** with proper ARIA labels
- **High contrast icons** for different file types
- **Semantic HTML structure** for better navigation
- **Focus management** in modal dialogs

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher)
- **Modern web browser** with File System Access API support:
  - Google Chrome (recommended)
  - Microsoft Edge
  - Other Chromium-based browsers

### Installation

1. **Clone or download** this repository
2. **Navigate to the project directory**:
   ```bash
   cd photo-browser
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the development server**:
   ```bash
   npm start
   ```
2. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```
3. **Select a folder** to start browsing your photos!

## 📖 How to Use

### Getting Started
1. Click the **"Select Folder"** button
2. Choose a directory containing your images
3. Browse through your photos in the responsive grid

### Viewing Images
- **Click any image** to open it in full-screen view
- **Navigate using keyboard**:
  - `←` Previous image
  - `→` Next image
  - `Escape` Close viewer
- **Use navigation buttons** in the viewer for previous/next

### File Operations
- **Images**: Click to view in full-screen
- **Text files**: Click to preview content in a modal
- **Other files**: Click to download

### Search Functionality
- **Type in the search box** to filter files by name
- **Search is case-insensitive** and works in real-time

## 🛠️ Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

### Project Structure
```
photo-browser/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   ├── index.js        # Application entry point
│   └── ...
├── package.json
└── README.md
```

## 🌐 Browser Support

This application uses the **File System Access API**, which requires modern browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 86+ | ✅ Fully Supported |
| Edge | 86+ | ✅ Fully Supported |


**Note**: If your browser doesn't support the File System Access API, you'll see a notification with instructions to use a compatible browser.

## ♿ Accessibility

This application is designed with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: High contrast icons and readable text
- **Responsive Design**: Works on various screen sizes and devices

### Keyboard Shortcuts
- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons and links
- `←` / `→`: Navigate between images (when viewer is open)
- `Escape`: Close image viewer or modals

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test accessibility with screen readers
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Masonry layout powered by [react-masonry-css](https://github.com/paulcollett/react-masonry-css)
- Icons from various open source collections

---

**Enjoy browsing your photos! 📸**
