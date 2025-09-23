import cors from "cors";
import loginRouter from "./routes/login.ts";
import userRouter from "./routes/user.ts";
import postRouter from "./routes/post.ts";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { Error } from "./types.d.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  err &&
    res.status(400).json({
      errors: [{ msg: `${err.cause.msg}`, path: `${err.cause.path}` }],
    });
});

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

export default app;
