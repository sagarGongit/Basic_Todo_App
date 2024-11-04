const mongoose = require("mongoose");

const Mongo_Database = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    if (res.connection.readyState == 1) {
      console.log("your connection is established with db");
    } else {
      console.log("invalid uri or facing issue with env check again");
    }
  } catch (error) {
    console.log(`internal server error while connecting with db error: ${error}`);
  }
};

module.exports = Mongo_Database;
