import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

class AuthStore {
  accessToken = null;
  refreshToken = null;
  user = null;

  constructor() {
    makeAutoObservable(this);
    this.loadAuthData(); // Восстанавливаем данные из localStorage при создании экземпляра
  }

  // Метод для сохранения данных в localStorage
  saveAuthData() {
    const authData = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      user: this.user,
    };
    localStorage.setItem("authData", JSON.stringify(authData));
  }

  // Метод для загрузки данных из localStorage
  loadAuthData() {
    const authData = localStorage.getItem("authData");
    if (authData) {
      const { accessToken, refreshToken, user } = JSON.parse(authData);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.user = user;
    }
  }

  // Метод для установки данных аутентификации
  setAuthData({ accessToken, refreshToken, user }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    this.saveAuthData(); // Сохраняем данные при их обновлении
  }

  // Метод для очистки данных аутентификации
  clearAuthData() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem("authData"); // Удаляем данные из localStorage
  }

  async refreshTokenRequest() {
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/refresh_token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.refreshToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setAuthData({
          accessToken: data.access_token,
          refreshToken: this.refreshToken,
          user: this.user,
        });
      } else {
        console.error("Не удалось обновить токен");
        this.clearAuthData();
      }
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      this.clearAuthData();
    }
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }
}

const authStore = new AuthStore();

const AuthContext = createContext(authStore);

export const useAuthStore = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
};