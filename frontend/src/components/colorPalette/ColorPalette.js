import React, { useState } from 'react';
import axios from 'axios';
import './ColorPalette.css';  // Make sure to import the CSS file

const ColorPalette = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));  // Create image preview URL
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      setError('Please upload an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setColors(response.data.colors);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error extracting colors. Please try again.');
    }
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      alert(`${color} copied to clipboard!`);
    });
  };

  return (
    <div className="color-palette-container">
      <h2 className="title">Color Palette Generator</h2>
      
      <form className="upload-form" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Extracting...' : 'Extract Colors'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && <p className="loading">Loading...</p>}

      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview-container">
          <h3>Image Preview:</h3>
          <img src={imagePreview} alt="Uploaded Preview" className="image-preview" />
        </div>
      )}

      {/* Color Swatches */}
      {colors.length > 0 && (
        <div className="color-swatches">
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color)}
            >
              <span className="color-code">{color}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
