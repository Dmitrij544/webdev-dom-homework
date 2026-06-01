const API_URL = "https://wedev-api.sky.pro/api/v1/dmitrij-sharusev/comments";

export function getComments() {
  return fetch(API_URL, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при получении комментариев");
      }
      return response.json();
    })
    .then((data) => {
      return data.comments;
    });
}

export function postComment(authorName, commentText) {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name: authorName,
      text: commentText,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при отправке комментария");
    }
    return response.json();
  });
}
