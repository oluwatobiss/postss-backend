import "dotenv/config";
import app from "./app.ts";
import handleSocketConnection from "./sockets/connectionHandler.ts";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(port);

  console.log(`Server listening for requests at port: ${port}!`);
});

const io = new Server(server, {
  cors: { origin: process.env.POSTSS_APP_URI, methods: ["GET", "POST"] },
});

handleSocketConnection(io);
