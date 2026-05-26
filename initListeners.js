import { comments } from "./comments.js";

export const initlikeListeners = (renderComments, commentsContainer) => {
  if (commentsContainer.hasAttribute("data-likes-initialized")) return;
  commentsContainer.setAttribute("data-likes-initialized", "true");

  commentsContainer.addEventListener("click", (event) => {
    const likeBtn = event.target.closest(".like-button");
    if (!likeBtn) return;

    const commentElement = likeBtn.closest(".comment");
    if (!commentElement) return;

    const index = commentElement.dataset.index;
    const commentData = comments[index];

    if (!commentData.isLiked) {
      commentData.likes++;
      commentData.isLiked = true;
    } else {
      commentData.likes--;
      commentData.isLiked = false;
    }

    renderComments(comments, commentsContainer);
  });
};

export const initReplyListeners = (
  commentsContainer,
  textInput,
  checkInputs
) => {
  if (commentsContainer.hasAttribute("data-reply-initialized")) return;
  commentsContainer.setAttribute("data-reply-initialized", "true");

  commentsContainer.addEventListener("click", (event) => {
    if (event.target.closest(".like-button")) {
      return;
    }

    const commentElement = event.target.closest(".comment");
    if (commentElement) {
      const index = commentElement.dataset.index;
      const commentData = comments[index];

      const quoteText = `> ${commentData.name}: "${commentData.text}"\n\n`;

      if (textInput) {
        textInput.value = quoteText;
        textInput.focus();

        if (typeof checkInputs === "function") {
          checkInputs();
        }
      }
    }
  });
};
