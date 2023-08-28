export const imageFilter = (req, file, cb) => {
  const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

  const fileExtension = file.originalname
    .toLowerCase()
    .substr(file.originalname.lastIndexOf('.'));

  const isValidImage = allowedImageExtensions.includes(fileExtension);

  if (isValidImage) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file type'));
  }
};
