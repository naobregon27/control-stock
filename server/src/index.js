const server = require("./server.js");
const { conn } = require("./db.js");
// const  loadDB  = require("./loadDB.js");
const port = process.env.PORT || 4000;

conn
  .sync({ force: true })
  .then(async () => {
   // await loadDB()
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));