import { renderComments } from "./renderComments.js";
import { getComments, postComment } from "./api.js";

let comments = [];

export function initApp() {
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const btn = document.querySelector(".add-form-button");
  const commentsContainer =
    document.querySelector(".comments") || document.body;

  const loadingTitle = document.getElementById("loading-title");
  const addForm = document.getElementById("add-form");
  const commentAddingTitle = document.getElementById("comment-adding-title");

  commentsContainer.innerHTML = "";

  function checkInputs() {
    if (btn && nameInput && textInput) {
      btn.disabled = !(nameInput.value.trim() && textInput.value.trim());
    }
  }

  function fetchAndRender(isInitialLoad = false) {
    if (isInitialLoad && loadingTitle) {
      loadingTitle.classList.remove("hidden");
    }

    return getComments()
      .then((fetchedComments) => {
        comments = fetchedComments;
        commentsContainer.classList.remove("hidden");
        renderComments(comments, commentsContainer, textInput, checkInputs);
      })
      .catch((error) => {
        if (error.status === 500 || error.message.includes("500")) {
          alert("Сервер сломался, попробуй позже");
        } 
        else if (error.message === "Failed to fetch" || !navigator.onLine) {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        } 
        else {
          alert("Не удалось загрузить комментарии. Проверьте соединение.");
        }
      })
      .then(() => {
        if (isInitialLoad && loadingTitle) {
          loadingTitle.classList.add("hidden");
        }
      });
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const currentName = nameInput.value.trim();
      const currentText = textInput.value.trim();

      if (!currentName || !currentText) {
        alert("Имя и комментарий должны быть заполнены");
        return; 
      }

      if (addForm) addForm.classList.add("hidden");
      if (commentAddingTitle) commentAddingTitle.classList.remove("hidden");

      postComment(currentName, currentText)
        .then(() => {
          nameInput.value = "";
          textInput.value = "";
          return fetchAndRender(false);
        })
        .catch((error) => {
          if (error.message === "500") {
            alert("Сервер сломался, попробуй позже");
          } else if (error.message === "400") {
            alert("Имя и комментарий должны быть не короче 3 символов");
          } else if (error.message === "Failed to fetch" || !navigator.onLine) {
            alert("Кажется, у вас сломался интернет, попробуйте позже");
          } else {
            alert("Не удалось отправить комментарий. Пожалуйста, попробуйте позже.");
          }
        })
        .then(() => {
          if (addForm) addForm.classList.remove("hidden");
          if (commentAddingTitle) commentAddingTitle.classList.add("hidden");
          checkInputs();
        });
    });
  }

  if (nameInput && textInput) {
    nameInput.addEventListener("input", checkInputs);
    textInput.addEventListener("input", checkInputs);
  }

  fetchAndRender(true);
  checkInputs();
}