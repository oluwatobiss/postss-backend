import express, { type Request, type Response } from "express";
const app = express();
const PORT = 3001;

app.get("/", (req: Request, res: Response) => res.send("Hello, world!"));
app.listen(PORT, () => {
  console.log(`Server listening for requests at port: ${PORT}!`);
});
