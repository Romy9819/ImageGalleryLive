const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/image_model')

const upload = multer();
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: 'dyisowpon',
    api_key: '388457275628642',
    api_secret: 'DYEF6LJK1uWAewiBLklE0hgvFJw',
  });

router.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

router.post('/images', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const fileContent = req.file.buffer;

        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: '/uploads' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            const bufferStream = new Readable();
            bufferStream.push(fileContent);
            bufferStream.push(null);

            bufferStream.pipe(stream);
        });

        // console.log("Upload Response: ", uploadResponse);

        const imageUrl = uploadResponse.secure_url;

        // console.log("ImageUrl: ", imageUrl);

        const image = new Image({ title, description, imageUrl });
        await image.save();
        
        res.status(201).json({message: "Image uploaded successfully"})
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

router.post('/images/:id/like', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) return res.status(404).json({message: "Image not found"})

        image.likes++;
        await image.save();
        res.status(201).json({message: "Like success"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

router.post('/images/:id/dislike', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) return res.status(404).json({message: "Image not found"})

        image.likes--;
        await image.save();
        res.status(201).json({message: "Dislike success"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

router.post('/images/:id/comment', async (req, res) => {
    try {
        const {text} = req.body;
        const image = await Image.findById(req.params.id);

        if (!image) return res.status(404).json({message: "Image not found"});

        image.comments.push({text});
        await image.save();
        res.status(201).json({message: "Comments success"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
});

// router.get("/share/:imageId", async (req, res) => {
//     try {
//       const imageId = req.params.imageId;

//       const image = await Image.findById(imageId);
//       if (!image) {
//         return res.status(404).json({ message: "Image not found" });
//       }
  
//       const shareableLink = `http://yourdomain.com/share/${imageId}`;
  
//       res.set("Location", shareableLink);
//         res.status(301).end();
//     } catch (error) {
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   });

router.get('/download/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    res.download(imagePath);
  });
  

module.exports = router;