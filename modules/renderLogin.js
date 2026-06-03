import { loginUser } from "./api.js";

export function renderLogin({ appElement, onAuthSuccess, onGoToRegistration, onGoToComments }) {
  appElement.innerHTML = `
    <div class="login-form">
      <h2>Форма входа</h2>
      <input type="text" id="login-input" placeholder="Логин" class="form-input" />
      <input type="password" id="password-input" placeholder="Пароль" class="form-input" />
      <div id="error-message" class="error-text"></div>
      <button id="login-button" class="btn">Войти</button>
      <button id="toggle-auth-button" class="btn btn-link">Зарегистрироваться</button>
      <button id="back-button" class="btn btn-link-secondary">Назад к комментариям</button>
    </div>
  `;

  const loginInput = document.getElementById("login-input");
  const passwordInput = document.getElementById("password-input");
  const loginButton = document.getElementById("login-button");
  const toggleAuthButton = document.getElementById("toggle-auth-button");
  const backButton = document.getElementById("back-button");
  const errorDiv = document.getElementById("error-message");

  loginButton.addEventListener("click", () => {
    errorDiv.textContent = "";

    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (!loginValue || !passwordValue) {
      errorDiv.textContent = "Заполните все поля";
      return;
    }

    loginUser({ login: loginValue, password: passwordValue })
      .then((data) => {
        onAuthSuccess({
          token: data.user.token,
          name: data.user.name,
        });
      })
      .catch((error) => {
        if (error.message === "500") {
          errorDiv.textContent = "Сервер сломался, попробуйте позже";
        } else {
          errorDiv.textContent = error.message;
        }
        console.error(error);
      });
  });

  toggleAuthButton.addEventListener("click", () => {
    onGoToRegistration();
  });

  backButton.addEventListener("click", () => {
    onGoToComments();
  });
}