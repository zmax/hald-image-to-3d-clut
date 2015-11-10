# hald-image-to-3d-clut
Hald Image to 3D CLUT (.cube)

1. Make hald image

  `convert hald:5 identity.png`

2. Apply color effects to hald image in Lightroom or other photo effect software
 
3. Covert hald image to 3D CLUT

  `hald-to-clut.js identity.png identity.cube`

4. Now we can use .cube file in Final Cut Pro or other video software
