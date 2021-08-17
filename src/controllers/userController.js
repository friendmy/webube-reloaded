import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    //console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    //await User.create({ ...req.body });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "This username / email is already taken.",
        });
    }

    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Join User",
            errorMessage: error._message,
        });
    }

    res.redirect("/login");
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("login", { pageTitle: "Login", errorMessage: " User Not Exists " });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", { pageTitle: "Login", errorMessage: " Wrong password" });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const startKakaoLogin = (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: process.env.KAKAO_CLIENT,
        redirect_uri: process.env.redirectURL
            ? `https://${process.env.redirectURL}/users/kakao/finish`
            : "http://localhost:4000/users/kakao/finish",
        response_type: "code",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT,
        redirect_uri: process.env.redirectURL
            ? `https://${process.env.redirectURL}/users/kakao/finish`
            : "http://localhost:4000/users/kakao/finish",
        code: req.query.code,
        client_secret: process.env.KAKAO_SECRET,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: { Accept: "application/json", charset: "UTF-8" },
        })
    ).json();

    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://kapi.kakao.com";
        const userData = await (
            await fetch(`${apiUrl}/v2/user/me`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();

        // console.log(userData);
        if (userData.kakao_account.has_email) {
            let user = await User.findOne({ email: userData.kakao_account.email });
            if (!user) {
                user = await User.create({
                    avatarUrl: userData.kakao_account.profile.profile_image_url,
                    name: userData.kakao_account.profile.nickname,
                    username: userData.kakao_account.email,
                    email: userData.kakao_account.email,
                    password: "",
                    socialOnly: true,
                    location: "",
                });
            }

            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        } else {
            // 카카오 계정에 이메일정보가 없을때.
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: { Accept: "application/json" },
        })
    ).json();

    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // console.log(userData);
        // console.log(emailData);
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }

        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        res.redirect("/login");
    }
};
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, username: beforeUsername, email: beforeEmail, avatarUrl },
        },
        body: { name, email, username, location },
        file,
    } = req;
    //console.log(file);
    const pageTitle = "Edit Profile";

    const searchParam = [];

    if (username !== beforeUsername) searchParam.push(username);
    if (email !== beforeEmail) searchParam.push(email);
    if (searchParam.length !== 0) {
        const exists = await User.exists({ $or: searchParam });
        //await User.create({ ...req.body });
        if (exists) {
            return res.status(400).render("edit-profile", {
                pageTitle: pageTitle,
                errorMessage: `This ${searchParam.join(" / ")} is already taken.`,
            });
        }
    }
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location,
        },
        { new: true }
    );
    req.session.user = updatedUser;

    return res.redirect("/users/edit");
};
export const logout = (req, res) => {
    req.flash("info", "Bye Bye");
    req.session.destroy();
    return res.redirect("/");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password");
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id, password },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;

    const ok = await bcrypt.compare(oldPassword, password);
    if (!ok) {
        if (newPassword !== newPasswordConfirmation) {
            return res.status(400).render("users/change-password", {
                pageTitle: "Change Password",
                errorMessage: "The current password is incorrect",
            });
        }
    }

    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation",
        });
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.flash("info", "Password updated");
    req.session.user.password = user.password;
    // send notification
    return res.redirect("/users/logout");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
        },
    });
    //console.log(user);
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render("users/profile", { pageTitle: user.name, user });
};
