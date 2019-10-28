const server = require("./server");
const PORT = process.env.PORT || 5000;

const bindServer = app => {
  app.listen(PORT, () => {
    console.log(
      `App is running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

const desctructivelyExit = reason => {
  /* We should probably log this first */
  console.log(reason);
  process.exit(1);
};

server()
  .then(bindServer)
  .catch(desctructivelyExit);
