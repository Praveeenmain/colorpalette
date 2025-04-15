import React from 'react';
import './App.css';
import ColorPalette from './components/colorPalette/ColorPalette';  // Import the ColorPalette component

function App() {
  return (
    <div className="App">
      
      <main>
        <ColorPalette />  {/* Use the ColorPalette component */}
      </main>
    </div>
  );
}

export default App;
