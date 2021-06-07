const fakeUser = {
    username: "friendmy",
    loggedIn: true,
};

export const trending = (req, res) => res.render("home", { pageTitle: "Home", fakeUser });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.send("Edit Video", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send("Delete Video");
};
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
