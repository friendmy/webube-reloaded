import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

/*
console.log("start")
Video.find({}, (error, videos) => {
  if(error){
    return res.render("server-error")
  }
  return res.render("home", { pageTitle: "Home", videos });
});
console.log("finished")
*/

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    //console.log(video);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Vidoe not found." });
    }
    return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Vidoe not found." });
    }

    if (String(video.owner) !== String(_id)) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { id } = req.params;
    const video = await Video.findById({ _id: id });

    const { title, description, hashtags } = req.body;
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Vidoe not found." });
    }
    //console.log(video);
    //console.log(video.owner);
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "You ar not the owner of the video");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Change saved.");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const {
        user: { _id: owner },
    } = req.session;
    //console.log(req.session.user);
    const { video, thumb } = req.files;
    // console.log(thumb);
    // console.log(thumb[0].path);
    // console.log(thumb[0].destination + thumb[0].filename);
    const isHeroku = process.env.NODE_ENV === "production";
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: isHeroku ? video[0].location.replace(/\\/g, "/") : "/" + video[0].path.replace(/\\/g, "/"),
            thumbUrl: isHeroku ? thumb[0].location.replace(/\\/g, "/") : "/" + thumb[0].path.replace(/\\/g, "/"),
            owner,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(owner);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        //console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Vidoe not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        }).populate("owner");
        //console.log(videos);
    }
    return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({ newCommentId: comment._id });
};
