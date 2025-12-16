from PIL import Image
import os

path = r"c:\Users\ryand\AntigravityProjects\dockerportolio\worktrees\contact-form-design\public\contact-bg.png"

try:
    if os.path.exists(path):
        img = Image.open(path)
        width = 1092
        w_percent = (width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        
        # Use LANCZOS for high-quality downsampling
        img = img.resize((width, h_size), Image.Resampling.LANCZOS)
        img.save(path)
        print(f"Successfully resized {path} to {width}x{h_size}")
    else:
        print(f"File not found: {path}")
except Exception as e:
    print(f"Error resizing image: {e}")
