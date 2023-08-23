const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
  destinationFolder = "",
  prefix = "POST",
  fileType = "",
}) => {
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}//../public/${destinationFolder}`);
    },

    filename: (req, file, cb) => {
      const filename = `${prefix}_${file.originalname}`;
      cb(null, filename);
    },
  });

  const uploader = multer({
    storage: storageConfig,

    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] != fileType) {
        return cb(null, false);
      }
      cb(null, true);
    },
  });
  return uploader;
};

const uploud = multer({
  limits: {
    fileSize: 10000000, //10mb
  },
  fileFilter: (req, file, cb) => {
    const file_type = file.mimetype.split("/")[0];
    const format_file = file.mimetype.split("/")[1];

    if (file_type != "image" && format_file != ("jpg" || "png" || "WEBP")) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

module.exports = { fileUploader, uploud };
