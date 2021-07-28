"use strict";

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm");

var addComment = function addComment(text, id) {
  var videoComments = document.querySelector(".video__comments ul");
  var newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  var icon = document.createElement("i");
  icon.className = "fas fa-comment";
  var span = document.createElement("span");
  span.innerText = " ".concat(text);
  var span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

var handleSubmit = function handleSubmit(event) {
  var textarea, videoId, text, response, _ref, newCommentId;

  return regeneratorRuntime.async(function handleSubmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          event.preventDefault();
          textarea = form.querySelector("textarea");
          videoId = videoContainer.dataset.id;
          text = textarea.value;

          if (!(text === "")) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(fetch("/api/videos/".concat(videoId, "/comment"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: text
            })
          }));

        case 8:
          response = _context.sent;
          textarea.value = "";
          _context.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          _ref = _context.sent;
          newCommentId = _ref.newCommentId;

          if (response.status === 201) {
            addComment(text, newCommentId);
          }

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};

var deleteComment = function deleteComment(event) {
  event.preventDefault();
  console.log(event.currentTarget);
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

document.querySelectorAll(".video__comment-delete").forEach(function (node) {
  node.addEventListener("click", deleteComment);
});