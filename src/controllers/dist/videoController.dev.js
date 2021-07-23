"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerView = exports.search = exports.deleteVideo = exports.postUpload = exports.getUpload = exports.postEdit = exports.getEdit = exports.watch = exports.home = void 0;

var _Video = _interopRequireDefault(require("../models/Video"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var home = function home(req, res) {
  var videos;
  return regeneratorRuntime.async(function home$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_Video["default"].find({}).sort({
            createdAt: "desc"
          }).populate("owner"));

        case 2:
          videos = _context.sent;
          return _context.abrupt("return", res.render("home", {
            pageTitle: "Home",
            videos: videos
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.home = home;

var watch = function watch(req, res) {
  var id, video;
  return regeneratorRuntime.async(function watch$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id).populate("owner"));

        case 3:
          video = _context2.sent;

          if (video) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).render("404", {
            pageTitle: "Vidoe not found."
          }));

        case 6:
          return _context2.abrupt("return", res.render("watch", {
            pageTitle: video.title,
            video: video
          }));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.watch = watch;

var getEdit = function getEdit(req, res) {
  var id, _id, video;

  return regeneratorRuntime.async(function getEdit$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 4:
          video = _context3.sent;

          if (video) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).render("404", {
            pageTitle: "Vidoe not found."
          }));

        case 7:
          if (!(String(video.owner) !== String(_id))) {
            _context3.next = 10;
            break;
          }

          req.flash("error", "Not authorized");
          return _context3.abrupt("return", res.status(403).redirect("/"));

        case 10:
          return _context3.abrupt("return", res.render("edit", {
            pageTitle: "Editing ".concat(video.title),
            video: video
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getEdit = getEdit;

var postEdit = function postEdit(req, res) {
  var _id, id, video, _req$body, title, description, hashtags;

  return regeneratorRuntime.async(function postEdit$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _id = req.session.user._id;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById({
            _id: id
          }));

        case 4:
          video = _context4.sent;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, hashtags = _req$body.hashtags;

          if (video) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).render("404", {
            pageTitle: "Vidoe not found."
          }));

        case 8:
          if (!(String(video.owner) !== String(_id))) {
            _context4.next = 11;
            break;
          }

          req.flash("error", "You ar not the owner of the video");
          return _context4.abrupt("return", res.status(403).redirect("/"));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(_Video["default"].findByIdAndUpdate(id, {
            title: title,
            description: description,
            hashtags: _Video["default"].formatHashtags(hashtags)
          }));

        case 13:
          req.flash("success", "Change saved.");
          return _context4.abrupt("return", res.redirect("/videos/".concat(id)));

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.postEdit = postEdit;

var getUpload = function getUpload(req, res) {
  return res.render("upload", {
    pageTitle: "Upload Video"
  });
};

exports.getUpload = getUpload;

var postUpload = function postUpload(req, res) {
  var owner, _req$files, video, thumb, _req$body2, title, description, hashtags, newVideo, user;

  return regeneratorRuntime.async(function postUpload$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          owner = req.session.user._id; //console.log(req.session.user);

          _req$files = req.files, video = _req$files.video, thumb = _req$files.thumb; // console.log(thumb);
          // console.log(thumb[0].path);
          // console.log(thumb[0].destination + thumb[0].filename);

          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, hashtags = _req$body2.hashtags;
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(_Video["default"].create({
            title: title,
            description: description,
            fileUrl: video[0].path.replace(/\\/g, "/"),
            thumbUrl: thumb[0].path.replace(/\\/g, "/"),
            owner: owner,
            hashtags: _Video["default"].formatHashtags(hashtags)
          }));

        case 6:
          newVideo = _context5.sent;
          _context5.next = 9;
          return regeneratorRuntime.awrap(_User["default"].findById(owner));

        case 9:
          user = _context5.sent;
          user.videos.push(newVideo._id);
          user.save();
          return _context5.abrupt("return", res.redirect("/"));

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](3);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: _context5.t0._message
          }));

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 15]]);
};

exports.postUpload = postUpload;

var deleteVideo = function deleteVideo(req, res) {
  var id, _id, video;

  return regeneratorRuntime.async(function deleteVideo$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 4:
          video = _context6.sent;

          if (video) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).render("404", {
            pageTitle: "Vidoe not found."
          }));

        case 7:
          if (!(String(video.owner) !== String(_id))) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(403).redirect("/"));

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(_Video["default"].findByIdAndDelete(id));

        case 11:
          return _context6.abrupt("return", res.redirect("/"));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.deleteVideo = deleteVideo;

var search = function search(req, res) {
  var keyword, videos;
  return regeneratorRuntime.async(function search$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          keyword = req.query.keyword;
          videos = [];

          if (!keyword) {
            _context7.next = 6;
            break;
          }

          _context7.next = 5;
          return regeneratorRuntime.awrap(_Video["default"].find({
            title: {
              $regex: new RegExp("".concat(keyword, "$"), "i")
            }
          }).populate("owner"));

        case 5:
          videos = _context7.sent;

        case 6:
          return _context7.abrupt("return", res.render("search", {
            pageTitle: "Search",
            videos: videos
          }));

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.search = search;

var registerView = function registerView(req, res) {
  var id, video;
  return regeneratorRuntime.async(function registerView$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id; //console.log(id);

          _context8.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 3:
          video = _context8.sent;

          if (video) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.sendStatus(404));

        case 6:
          video.meta.views = video.meta.views + 1;
          _context8.next = 9;
          return regeneratorRuntime.awrap(video.save());

        case 9:
          return _context8.abrupt("return", res.sendStatus(200));

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.registerView = registerView;