export const initlikeListeners = (
  renderComments,
  commentsContainer,
  textInput,
  checkInputs,
  commentsArray
) => {
  if (commentsContainer.hasAttribute("data-likes-initialized")) return;
  commentsContainer.setAttribute("data-likes-initialized", "true");

  commentsContainer.addEventListener("click", (event) => {
    const likeBtn = event.target.closest(".like-button");
    if (!likeBtn) return;

    const commentElement = likeBtn.closest(".comment");
    if (!commentElement) return;

    const index = commentElement.dataset.index;
    const commentData = commentsArray[index];

    if (!commentData) return;

    if (!commentData.isLiked) {
      commentData.likes++;
      commentData.isLiked = true;
    } else {
      commentData.likes--;
      commentData.isLiked = false;
    }

    renderComments(commentsArray, commentsContainer, textInput, checkInputs);
  });
};

export const initReplyListeners = (
  commentsContainer,
  textInput,
  checkInputs,
  commentsArray
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
      const commentData = commentsArray[index];

      if (!commentData) return;

      const currentName = commentData.author?.name || commentData.name;
      const quoteText = `> ${currentName}: "${commentData.text}"\n\n`;

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

export const initValidationListeners = (nameInput, textInput, submitButton) => {
  if (!nameInput || !textInput || !submitButton) return;

  const checkInputs = () => {
    const isNameValid = nameInput.value.trim().length >= 2;
    const isTextValid = textInput.value.trim().length >= 10;

    if (isNameValid && isTextValid) {
      submitButton.disabled = false;
      submitButton.classList.remove("disabled-button-class"); 
    } else {
      submitButton.disabled = true;
      submitButton.classList.add("disabled-button-class");
    }
  };

  nameInput.addEventListener("input", checkInputs);
  textInput.addEventListener("input", checkInputs);

  checkInputs();

  return checkInputs;
};
