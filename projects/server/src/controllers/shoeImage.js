const db = require("../models");
const SHOE_URL = process.env.SHOE_URL;
const shoeimageController = {
  addShoeimage: async (req, res) => {
    try {
      const { shoe_id } = req.body;
      const filenames = req.files.map((file) => file.filename);

      // Membuat array promise untuk setiap penciptaan gambar
      const createImagePromises = filenames.map((filename) =>
        db.ShoeImage.create({
          shoe_id,
          shoe_img: SHOE_URL + filename,
        })
      );

      // Menunggu semua operasi penciptaan gambar selesai
      const createdImages = await Promise.all(createImagePromises);

      res.status(200).send(createdImages);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
};

module.exports = shoeimageController;
