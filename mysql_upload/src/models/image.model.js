// for sequelize model images


// define image model

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("image", {
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.BLOB("long"),
    },
  });

  return Image;
};

// This Sequelize Model represents images table in MySQL database. 
// These columns will be generated automatically: id, type, name, data,
// createdAt, updatedAt.

// The data field has BLOB type. A BLOB is binary large object 
// that can hold a variable amount of data.
