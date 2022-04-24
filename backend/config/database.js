const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((data) => {
      console.log(`Mongodb Connected Succesfully at server ${data.connection.host}`);
    })
  //catch karne ki jrurat nhi hain kroki server.js mai unhandled promise rejection function daal diya
  // .catch((err) => {
  //   console.log(err);
  // });
}
module.exports = connectDatabase;