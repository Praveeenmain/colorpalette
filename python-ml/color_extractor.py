import sys
import json
from sklearn.cluster import KMeans
from PIL import Image
import numpy as np
import os

def extract_colors(image_path, num_colors=10):
    # Load image
    img = Image.open(image_path)
    img = img.resize((150, 150))  # Resize for speed
    img = img.convert('RGB')

    # Convert image to numpy array
    pixels = np.array(img).reshape(-1, 3)

    # Apply KMeans clustering
    kmeans = KMeans(n_clusters=num_colors)
    kmeans.fit(pixels)

    # Get dominant colors
    colors = kmeans.cluster_centers_.astype(int)

    # Convert to hex
    hex_colors = ['#{:02x}{:02x}{:02x}'.format(r, g, b) for r, g, b in colors]
    return hex_colors

if __name__ == "__main__":
    # Ensure the script is passed the required arguments
    if len(sys.argv) < 3:
        print("Error: Missing arguments. Please provide both image path and the number of colors.")
        sys.exit(1)  # Exit with an error code

    # Image path from command line
    image_path = sys.argv[1]
    
    # Ensure the image file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file at {image_path} does not exist.")
        sys.exit(1)

    # Get number of colors (default to 10 if not provided)
    try:
        num_colors = int(sys.argv[2])
    except ValueError:
        print("Error: The number of colors must be an integer.")
        sys.exit(1)

    # Get colors
    dominant_colors = extract_colors(image_path, num_colors)

    # Return as JSON to Node
    print(json.dumps(dominant_colors))
