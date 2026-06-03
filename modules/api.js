const API_URL = "https://wedev-api.sky.pro/api/v1/dmitrij-sharusev/comments";

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

export function postComment(name, text) { 
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      text,
      forceError: true, 
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
