import Video from "../models/Video";

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
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Vidoe not found." });
    }
    return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Vidoe not found." });
    }
    return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.exists({ _id: id });
    const { title, description, hashtags } = req.body;
    if (!video) {
        return res.render("404", { pageTitle: "Vidoe not found." });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`)),
    });

    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    await Video.create({
        title,
        description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`)),
        meta: {
            views: 0,
            rating: 0,
        },
    });
    return res.redirect("/");
};
