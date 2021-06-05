import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const home = (req, res) => {
    console.log("I will respond");
    return res.send("hello");
};

const login = (req, res) => {
    return res.send("login");
};

const handleListening = () => console.log(`✔ Server listening on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
