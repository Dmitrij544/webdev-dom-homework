import { initlikeListeners, initReplyListeners } from "./initListeners.js";
import { escapeHTML } from "./utils.js";

function createCommentElement(name, text, date, likes, isLiked, index) {
  const newComment = document.createElement("div");
  newComment.classList.add("comment");
  newComment.dataset.index = index;

  const activeClass = isLiked ? "-active-like" : "";
  const safeName = escapeHTML(name);
  const safeText = escapeHTML(text);

  const formattedDate = date.includes("T")
    ? new Date(date).toLocaleString().slice(0, -3).replace(",", "")
    : date;

  newComment.innerHTML = `
        <div class="comment-header">
            <div>${safeName}</div>
            <div>${formattedDate}</div>
        </div>
        <div class="comment-body">
            <div class="comment-text">
                ${safeText}
            </div>
        </div>
        <div class="comment-footer">
            <div class="likes">
                <span class="likes-counter">${likes}</span>
                <button class="like-button ${activeClass}"></button>
            </div>
         </div>
    `;
  return newComment;
}

export const renderComments = (
  commentsArray,
  commentsContainer,
  textInput,
  checkInputs
) => {
  commentsContainer.innerHTML = "";

  commentsArray.forEach((comment, index) => {
    const currentName = comment.author?.name || comment.name;

    const commentNode = createCommentElement(
      currentName,
      comment.text,
      comment.date,
      comment.likes,
      comment.isLiked ?? false,
      index
    );
    commentsContainer.appendChild(commentNode);
  });

  initlikeListeners(
    renderComments,
    commentsContainer,
    textInput,
    checkInputs,
    commentsArray
  );
  initReplyListeners(commentsContainer, textInput, checkInputs, commentsArray);
};
