import React, { useState, useEffect, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import './App.css';

const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  
  const fileTypes = {
    // Images
    jpg: { category: 'image', icon: '🖼️', description: 'JPEG Image' },
    jpeg: { category: 'image', icon: '🖼️', description: 'JPEG Image' },
    png: { category: 'image', icon: '🖼️', description: 'PNG Image' },
    gif: { category: 'image', icon: '🖼️', description: 'GIF Image' },
    bmp: { category: 'image', icon: '🖼️', description: 'Bitmap Image' },
    webp: { category: 'image', icon: '🖼️', description: 'WebP Image' },
    svg: { category: 'image', icon: '🖼️', description: 'SVG Image' },
    
    // Text files
    txt: { category: 'text', icon: '📄', description: 'Text File' },
    md: { category: 'text', icon: '📝', description: 'Markdown File' },
    json: { category: 'text', icon: '📋', description: 'JSON File' },
    js: { category: 'text', icon: '📜', description: 'JavaScript File' },
    jsx: { category: 'text', icon: '📜', description: 'React JSX File' },
    ts: { category: 'text', icon: '📘', description: 'TypeScript File' },
    tsx: { category: 'text', icon: '📘', description: 'React TSX File' },
    css: { category: 'text', icon: '🎨', description: 'CSS Stylesheet' },
    html: { category: 'text', icon: '🌐', description: 'HTML File' },
    xml: { category: 'text', icon: '📄', description: 'XML File' },
    
    // Documents
    pdf: { category: 'document', icon: '📕', description: 'PDF Document' },
    doc: { category: 'document', icon: '📄', description: 'Word Document' },
    docx: { category: 'document', icon: '📄', description: 'Word Document' },
    
    // Archives
    zip: { category: 'archive', icon: '📦', description: 'ZIP Archive' },
    rar: { category: 'archive', icon: '📦', description: 'RAR Archive' },
    '7z': { category: 'archive', icon: '📦', description: '7-Zip Archive' },
    
    // Audio
    mp3: { category: 'audio', icon: '🎵', description: 'MP3 Audio' },
    wav: { category: 'audio', icon: '🎵', description: 'WAV Audio' },
    flac: { category: 'audio', icon: '🎵', description: 'FLAC Audio' },
    
    // Video
    mp4: { category: 'video', icon: '🎬', description: 'MP4 Video' },
    avi: { category: 'video', icon: '🎬', description: 'AVI Video' },
    mkv: { category: 'video', icon: '🎬', description: 'MKV Video' },
    
    // Other
    exe: { category: 'executable', icon: '⚙️', description: 'Executable File' },
    dll: { category: 'library', icon: '🔧', description: 'Dynamic Library' },
  };
  
  return fileTypes[ext] || { category: 'unknown', icon: '📄', description: 'Unknown File' };
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function App() {
  const [currentDirHandle, setCurrentDirHandle] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  const selectFolder = async () => {
    if (!window.showDirectoryPicker) {
      alert('File System Access API not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    try {
      const dirHandle = await window.showDirectoryPicker();
      setCurrentDirHandle(dirHandle);
      setCurrentPath([dirHandle]);
      await loadDirectory(dirHandle);
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  const loadDirectory = async (dirHandle) => {
    const files = [];
    const newUrls = new Map();
    try {
      for await (const [name, handle] of dirHandle.entries()) {
        const kind = handle.kind;
        if (kind === 'file') {
          const fileType = getFileType(name);
          const isImage = fileType.category === 'image';
          const isText = fileType.category === 'text';
          
          let fileData = null;
          if (isImage || isText) {
            try {
              fileData = await handle.getFile();
              if (isImage) {
                const url = URL.createObjectURL(fileData);
                newUrls.set(handle, url);
              }
            } catch (error) {
              console.error('Error loading file:', name, error);
            }
          }
          
          files.push({ 
            name, 
            handle, 
            kind, 
            fileType,
            size: fileData ? fileData.size : 0,
            lastModified: fileData ? new Date(fileData.lastModified).toLocaleString() : null,
            mimeType: fileData ? fileData.type : null
          });
        } else {
          files.push({ name, handle, kind, fileType: { category: 'directory', icon: '📁' } });
        }
      }
    } catch (error) {
      console.error('Error reading directory:', error);
    }
    files.sort((a, b) => {
      if (a.kind === 'directory' && b.kind === 'file') return -1;
      if (a.kind === 'file' && b.kind === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
    setCurrentFiles(files);
    setImageUrls(newUrls);
  };

  const navigateToFolder = async (folderHandle) => {
    setCurrentDirHandle(folderHandle);
    setCurrentPath([...currentPath, folderHandle]);
    await loadDirectory(folderHandle);
  };

  const goBack = async () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      const parentHandle = newPath[newPath.length - 1];
      setCurrentDirHandle(parentHandle);
      setCurrentPath(newPath);
      await loadDirectory(parentHandle);
    }
  };

  const openFile = async (file) => {
    if (file.kind === 'directory') {
      navigateToFolder(file.handle);
    } else if (file.fileType.category === 'image') {
      const imageIndex = imageFiles.findIndex(img => img.name === file.name && img.handle === file.handle);
      if (imageIndex !== -1) {
        setSelectedImageIndex(imageIndex);
        setViewerOpen(true);
      }
    } else if (file.fileType.category === 'text') {
      try {
        const fileData = await file.handle.getFile();
        const text = await fileData.text();
        setFilePreview({
          ...file,
          content: text,
          type: 'text'
        });
      } catch (error) {
        console.error('Error reading text file:', error);
      }
    } else {
      // For other files, trigger download
      try {
        const fileData = await file.handle.getFile();
        const url = URL.createObjectURL(fileData);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  const closeFilePreview = () => {
    setFilePreview(null);
  };

  const closeImageViewer = useCallback(() => {
    setViewerOpen(false);
    setSelectedImageIndex(null);
  }, []);

  const imageFiles = currentFiles.filter(f => f.fileType?.category === 'image');

  const navigateImage = useCallback((direction) => {
    const imageFilesFiltered = currentFiles.filter(f => f.fileType?.category === 'image');
    if (imageFilesFiltered.length === 0) return;
    let newIndex = selectedImageIndex;
    if (direction === 'next') {
      newIndex = (selectedImageIndex + 1) % imageFilesFiltered.length;
    } else if (direction === 'prev') {
      newIndex = selectedImageIndex === 0 ? imageFilesFiltered.length - 1 : selectedImageIndex - 1;
    }
    setSelectedImageIndex(newIndex);
  }, [currentFiles, selectedImageIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!viewerOpen) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateImage('next');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateImage('prev');
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeImageViewer();
      }
    };
    if (viewerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [viewerOpen, navigateImage, closeImageViewer]);

  // Cleanup URLs on unmount or directory change
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const filteredFiles = currentFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Photo Browser</h1>
        {!currentDirHandle && (
          <button onClick={selectFolder}>Select Folder</button>
        )}
        {currentDirHandle && (
          <div className="header-controls">
            <button onClick={() => {
              setCurrentDirHandle(null);
              setCurrentFiles([]);
              setCurrentPath([]);
              setImageUrls(new Map());
              setSearchTerm('');
            }}>Select Different Folder</button>
            <div className="path">
              <button onClick={goBack} disabled={currentPath.length <= 1}>Back</button>
              <span>{currentPath.map(h => h.name).join(' / ')}</span>
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}
      </header>
      <main className="main">
        {filteredFiles.length === 0 && currentDirHandle && (
          <p>{searchTerm ? 'No files match your search.' : 'This folder is empty.'}</p>
        )}
        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className="masonry-grid"
          columnClassName="masonry-column"
        >
          {filteredFiles.map((file) => (
            <div key={file.name} className={`item ${file.kind}`} onClick={() => openFile(file)}>
              {file.kind === 'directory' ? (
                <div className="folder">
                  <div className="folder-icon">{file.fileType.icon}</div>
                  <span>{file.name}</span>
                </div>
              ) : file.fileType.category === 'image' ? (
                <div className="image-item">
                  <img src={imageUrls.get(file.handle)} alt={file.name} />
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
              ) : (
                <div className="file">
                  <div className="file-icon">{file.fileType.icon}</div>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-type">{file.fileType.description}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Masonry>
      </main>
      {viewerOpen && selectedImageIndex !== null && (
        <ImageViewer
          imageFiles={imageFiles}
          selectedIndex={selectedImageIndex}
          imageUrls={imageUrls}
          onClose={closeImageViewer}
          onNavigate={navigateImage}
        />
      )}
      {filePreview && (
        <FilePreview
          file={filePreview}
          onClose={closeFilePreview}
        />
      )}
    </div>
  );
}

function ImageViewer({ imageFiles, selectedIndex, imageUrls, onClose, onNavigate }) {
  const [metadata, setMetadata] = useState(null);

  const currentFile = imageFiles[selectedIndex];

  useEffect(() => {
    const loadMetadata = async () => {
      if (currentFile) {
        const fileData = await currentFile.handle.getFile();
        setMetadata({
          name: currentFile.name,
          size: fileData.size,
          lastModified: new Date(fileData.lastModified).toLocaleString(),
          type: fileData.type,
        });
      }
    };
    loadMetadata();
  }, [currentFile]);

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <button className="nav-btn prev" onClick={() => onNavigate('prev')}>‹</button>
        <div className="image-container">
          {currentFile ? (
            <img src={imageUrls.get(currentFile.handle)} alt={currentFile.name} />
          ) : (
            <div>Image not found</div>
          )}
        </div>
        <button className="nav-btn next" onClick={() => onNavigate('next')}>›</button>
        <div className="metadata">
          {metadata && (
            <div>
              <p><strong>Name:</strong> {metadata.name}</p>
              <p><strong>Size:</strong> {(metadata.size / 1024).toFixed(2)} KB</p>
              <p><strong>Modified:</strong> {metadata.lastModified}</p>
              <p><strong>Type:</strong> {metadata.type}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file, onClose }) {
  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="file-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-preview-header">
          <h3>{file.fileType.icon} {file.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="file-preview-content">
          <div className="file-metadata">
            <p><strong>Type:</strong> {file.fileType.description}</p>
            <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
            <p><strong>Modified:</strong> {file.lastModified}</p>
            <p><strong>MIME Type:</strong> {file.mimeType || 'Unknown'}</p>
          </div>
          {file.type === 'text' && (
            <div className="text-preview">
              <pre>{file.content}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
