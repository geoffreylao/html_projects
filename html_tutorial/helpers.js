const slippiFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(slp|SLP)$/)) {
      req.fileValidationError = 'Only slippi files are allowed!';
      return cb(new Error('Only slippi files are allowed!'), false);
  }
  cb(null, true);
};
exports.slippiFilter = slippiFilter;