// returns views/index.html

// create controller for the view

const path = require("path");

const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};

module.exports = {
  getHome: home
};