const videos = [
    {
        title: "Video #1",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1,
    },
    {
        title: "Video #2",
        rating: 4,
        comments: 3,
        createdAt: "1 minutes ago",
        views: 159,
        id: 2,
    },
    {
        title: "Video #3",
        rating: 3,
        comments: 2,
        createdAt: "10 minutes ago",
        views: 1,
        id: 3,
    },
];

export const trending = (req, res) => {
    return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watch ${video.title}` });
};
export const edit = (req, res) => res.send("Edit Video", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send("Delete Video");
};
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
