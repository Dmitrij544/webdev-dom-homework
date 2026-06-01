import { renderComments } from "./renderComments.js";
import { getComments, postComment } from "./api.js";

let comments = [];

export function initApp() {
  const nameInput = document.querySelector(".add-form-name");
  const textInput = document.querySelector(".add-form-text");
  const btn = document.querySelector(".add-form-button");
  const commentsContainer =
    document.querySelector(".comments") || document.body;

  function checkInputs() {
    if (btn && nameInput && textInput) {
      btn.disabled = !(nameInput.value.trim() && textInput.value.trim());
    }
  }

  async function fetchAndRender() {
    try {
      comments = await getComments();
      renderComments(comments, commentsContainer, textInput, checkInputs);
    } catch (error) {
      alert("Не удалось загрузить комментарии. Проверьте соединение.");
    }
  }

  if (btn) {
    btn.addEventListener("click", async () => {
      if (!nameInput.value.trim() || !textInput.value.trim()) return;

      btn.disabled = true;
      btn.textContent = "Добавление...";

      try {
        await postComment(nameInput.value, textInput.value);

        nameInput.value = "";
        textInput.value = "";

        await fetchAndRender();
      } catch (error) {
        alert(
          "Не удалось отправить комментарий. Пожалуйста, попробуйте позже."
        );
      } finally {
        btn.textContent = "Написать";
        checkInputs();
      }
    });
  }

  if (nameInput && textInput) {
    nameInput.addEventListener("input", checkInputs);
    textInput.addEventListener("input", checkInputs);
  }

  fetchAndRender();
  checkInputs();
}
