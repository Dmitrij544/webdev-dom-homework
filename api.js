const API_URL = "https://wedev-api.sky.pro/api/v1/dmitrij-sarusev/comments";

export async function getComments() {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Ошибка при получении комментариев");
  }

  const data = await response.json();
  return data.comments;
}

export async function postComment(authorName, commentText) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name: authorName,
      text: commentText,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка при отправке комментария");
  }

  return await response.json();
}
