import "dotenv/config";
import express, { type Request, type Response } from "express";

const port = process.env.PORT || 3000;
const app = express();

app.get("/", (req: Request, res: Response) =>
  res.send(`
    <main style="text-align:center;padding:30px 10vw;">
      <h1>Welcome to the Postss Rest API server!</h1>
      <p>Postss provides RESTful APIs for the Postss social media app.</p>
      <h2>Postss Showcase</h2>
      <p>Here is the app's address: <a href=${process.env.POSTSS_APP_URI}>Postss App</a></p>
    </main>
  `)
);

app.listen(port, () => {
  console.log(`Server listening for requests at port: ${port}!`);
});
