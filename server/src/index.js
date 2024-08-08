const server = require("./server.js");
const { conn } = require("./db.js");
// const  loadDB  = require("./loadDB.js");
const PORT = 4000;

conn
  .sync({ force: true })
  .then(async () => {
   // await loadDB()
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));