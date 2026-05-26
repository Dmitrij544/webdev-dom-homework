import { comments } from "./comments.js";
import { renderComments } from "./renderComments.js";

const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const btn = document.querySelector(".add-form-button");
const commentsContainer = document.querySelector(".comments") || document.body;

function checkInputs() {
  if (btn && nameInput && textInput) {
    btn.disabled = !(nameInput.value.trim() && textInput.value.trim());
  }
}

if (btn) {
  btn.addEventListener("click", () => {
    const date = new Date().toLocaleString().slice(0, -3).replace(",", "");
    comments.push({
      name: nameInput.value,
      text: textInput.value,
      date: date,
      likes: 0,
      isLiked: false,
    });
    renderComments(comments, commentsContainer, textInput, checkInputs);
    nameInput.value = "";
    textInput.value = "";
    checkInputs();
  });
}

if (nameInput && textInput) {
  nameInput.addEventListener("input", checkInputs);
  textInput.addEventListener("input", checkInputs);
}

renderComments(comments, commentsContainer, textInput, checkInputs);
checkInputs();
