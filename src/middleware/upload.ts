const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

module.exports = upload;
