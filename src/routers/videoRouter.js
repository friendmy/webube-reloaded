import express from "express";
import { see, deleteVideo, edit, upload } from "../controllers/videoController";

const videoRouter = express.Router();

const handleWatch = (req, res) => res.send("Watch Video");
const handelEdit = (req, res) => res.send("Edit Video");

videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
