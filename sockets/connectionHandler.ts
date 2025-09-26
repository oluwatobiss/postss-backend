import { Server, Socket } from "socket.io";

export default (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);
    socket.on("submitPost", (msg: string) => {
      console.log("post: " + msg);
      // Send stored post to all the users (including the sender)
      io.emit("submitPost", msg);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
