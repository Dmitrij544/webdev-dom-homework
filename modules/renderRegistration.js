import { registerUser } from "./api.js";

export function renderRegistration({ appElement, onAuthSuccess, onGoToLogin, onGoToComments }) {
  appElement.innerHTML = `
    <div class="login-form">
      <h2>Регистрация</h2>
      <input type="text" id="reg-name-input" placeholder="Имя" class="form-input" />
      <input type="text" id="reg-login-input" placeholder="Логин" class="form-input" />
      <input type="password" id="reg-password-input" placeholder="Пароль" class="form-input" />
      <div id="reg-error-message" class="error-text"></div>
      <button id="register-button" class="btn">Зарегистрироваться</button>
      <button id="toggle-auth-button" class="btn btn-link">Уже есть аккаунт? Войти</button>
      <button id="back-button" class="btn btn-link-secondary">Назад к комментариям</button>
    </div>
  `;

  const nameInput = document.getElementById("reg-name-input");
  const loginInput = document.getElementById("reg-login-input");
  const passwordInput = document.getElementById("reg-password-input");
  const registerButton = document.getElementById("register-button");
  const toggleAuthButton = document.getElementById("toggle-auth-button");
  const backButton = document.getElementById("back-button");
  const errorDiv = document.getElementById("reg-error-message");

  registerButton.addEventListener("click", () => {
    errorDiv.textContent = "";

    const nameValue = nameInput.value.trim();
    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (!nameValue || !loginValue || !passwordValue) {
      errorDiv.textContent = "Заполните все поля";
      return;
    }

    registerUser({ login: loginValue, name: nameValue, password: passwordValue })
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
    onGoToLogin();
  });

  backButton.addEventListener("click", () => {
    onGoToComments();
  });
}