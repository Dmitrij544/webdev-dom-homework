const API_URL = 'https://wedev-api.sky.pro/api/v2/dmitrij-sharusev/comments';
const AUTH_URL = 'https://wedev-api.sky.pro/api/user';

let token = '';

export const setToken = (newToken) => {
  token = newToken;
};

export function getComments() {
  return fetch(API_URL, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 500) {
        const error = new Error("500");
        error.status = 500;
        throw error;
      }
      if (!response.ok) {
        throw new Error("Ошибка при получении комментариев");
      }
      return response.json();
    })
    .then((data) => {
      return data.comments;
    });
}

export function postComment(text) { 
  return fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text,
    }),
  }).then((response) => {
    if (response.status === 500) {
      const error = new Error("500");
      error.status = 500;
      throw error;
    }
    if (response.status === 400) {
      const error = new Error("400");
      error.status = 400;
      throw error;
    }
    if (!response.ok) {
      throw new Error("Ошибка при отправке комментария");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(`${AUTH_URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      const error = new Error("Неверный логин или пароль");
      error.status = 400;
      throw error;
    }
    if (response.status === 500) {
      const error = new Error("500");
      error.status = 500;
      throw error;
    }
    if (!response.ok) {
      throw new Error("Ошибка сервера при авторизации");
    }
    return response.json();
  });
}

export function registerUser({ login, name, password }) {
  return fetch(AUTH_URL, {
    method: "POST",
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      const error = new Error("Пользователь с таким логином уже существует");
      error.status = 400;
      throw error;
    }
    if (response.status === 500) {
      const error = new Error("500");
      error.status = 500;
      throw error;
    }
    if (!response.ok) {
      throw new Error("Ошибка сервера при регистрации");
    }
    return response.json();
  });
}