const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❌";

    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");

    const videoId = videoContainer.dataset.id;
    const text = textarea.value;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    textarea.value = "";
    const { newCommentId } = await response.json();

    if (response.status === 201) {
        addComment(text, newCommentId);
    }
};

const deleteComment = (event) => {
    event.preventDefault();
    console.log(event.currentTarget);
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

document.querySelectorAll(".video__comment-delete").forEach((node) => {
    node.addEventListener("click", deleteComment);
});
