# D'abord on install pillow (pip install)
from PIL import Image

# Overture de l'image
img = Image.open('img/init.png')

# Redimension de l'img
img_resized = img.resize((128, 128))
img_resized.save("img/pic-square.png")

