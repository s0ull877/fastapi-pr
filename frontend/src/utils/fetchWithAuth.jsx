import { useAuthStore } from "./stores/AuthStore";

export const fetchWithAccess = async (url, options = {}) => {
  const authStore = useAuthStore(); // Получаем доступ к AuthStore

  // Добавляем заголовок Authorization, если есть accessToken
  const headers = {
    ...options.headers,
    ...(authStore.accessToken && {
      Authorization: `Bearer ${authStore.accessToken}`,
    }),
  };

  // Выполняем запрос
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Проверяем статус токена (например, истёк ли он)
  if (response.status === 401) {
    console.error("Unauthorized! Возможно, токен истёк.");
    
    await authStore.refreshTokenRequest();

    response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${authStore.accessToken}`,
        },
    });
  }

  return response;
};
