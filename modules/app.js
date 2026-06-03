import { renderComments } from "./renderComments.js";
import { getComments, postComment, setToken } from "./api.js";
import { renderLogin } from "./renderLogin.js";
import { renderRegistration } from "./renderRegistration.js";

let comments = [];
let userName = null; 
let isAuthorized = false; 

export function initApp() {
  const appContainer = document.getElementById("app") || document.body;

  function fetchAndRender(isInitialLoad = false) {
    appContainer.innerHTML = `
      <div id="loading-title" class="loading-title hidden">Пожалуйста подождите, загружаю комментарии...</div>
      <ul class="comments comments-list hidden"></ul>
      <div id="action-block"></div>
    `;

    const loadingTitle = document.getElementById("loading-title");
    const commentsContainer = document.querySelector(".comments");
    const actionBlock = document.getElementById("action-block");

    if (isInitialLoad && loadingTitle) {
      loadingTitle.classList.remove("hidden");
    }

    return getComments()
      .then((fetchedComments) => {
        comments = fetchedComments;
        commentsContainer.classList.remove("hidden");
        
        renderComments(comments, commentsContainer);
        renderActionBlock(actionBlock);
      })
      .catch((error) => {
        if (error.status === 500 || error.message.includes("500")) {
          alert("Сервер сломался, попробуй позже");
        } else if (error.message === "Failed to fetch" || !navigator.onLine) {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        } else {
          alert("Не удалось загрузить комментарии. Проверьте соединение.");
        }
      })
      .then(() => {
        if (isInitialLoad && loadingTitle) {
          loadingTitle.classList.add("hidden");
        }
      });
  }

  function renderActionBlock(container) {
    if (!isAuthorized) {
      container.innerHTML = `
        <p class="auth-notice">
          Чтобы добавить комментарий, <a href="#" id="go-to-login">войдите</a>
        </p>
      `;

      document.getElementById("go-to-login").addEventListener("click", (e) => {
        e.preventDefault();
        goToLoginScreen();
      });
    } else {
      container.innerHTML = `
        <div id="add-form" class="add-form">
          <input type="text" class="add-form-name" value="${userName}" readonly />
          <textarea id="comment-textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
          <div id="comment-adding-title" class="loading-title hidden">Комментарий добавляется...</div>
          <button id="add-button" class="add-form-button" disabled>Написать</button>
        </div>
      `;

      const textInput = document.getElementById("comment-textarea");
      const btn = document.getElementById("add-button");
      const commentAddingTitle = document.getElementById("comment-adding-title");

      function checkInputs() {
        btn.disabled = !textInput.value.trim();
      }

      textInput.addEventListener("input", checkInputs);

      btn.addEventListener("click", () => {
        const currentText = textInput.value.trim();

        if (!currentText) {
          alert("Комментарий должен быть заполнен");
          return;
        }

        textInput.classList.add("hidden");
        btn.classList.add("hidden");
        if (commentAddingTitle) commentAddingTitle.classList.remove("hidden");

        postComment(currentText)
          .then(() => {
            textInput.value = "";
            return fetchAndRender(false);
          })
          .catch((error) => {
            if (error.message === "500") {
              alert("Сервер сломался, попробуй позже");
            } else if (error.message === "400") {
              alert("Комментарий должен быть не короче 3 символов");
            } else if (error.message === "Failed to fetch" || !navigator.onLine) {
              alert("Кажется, у вас сломался интернет, попробуйте позже");
            } else {
              alert("Не удалось отправить комментарий. Пожалуйста, попробуйте позже.");
            }
            
            textInput.classList.remove("hidden");
            btn.classList.remove("hidden");
            if (commentAddingTitle) commentAddingTitle.classList.add("hidden");
            checkInputs();
          });
      });
    }
  }

  function goToLoginScreen() {
    renderLogin({
      appElement: appContainer,
      onAuthSuccess: (userData) => {
        setToken(userData.token); 
        userName = userData.name; 
        isAuthorized = true;
        fetchAndRender(false);
      },
      onGoToRegistration: () => {
        goToRegistrationScreen();
      },
      onGoToComments: () => {
        fetchAndRender(false);
      },
    });
  }

  function goToRegistrationScreen() {
    renderRegistration({
      appElement: appContainer,
      onAuthSuccess: (userData) => {
        setToken(userData.token); 
        userName = userData.name;
        isAuthorized = true;
        fetchAndRender(false);
      },
      onGoToLogin: () => {
        goToLoginScreen();
      },
      onGoToComments: () => {
        fetchAndRender(false);
      },
    });
  }

  fetchAndRender(true);
}