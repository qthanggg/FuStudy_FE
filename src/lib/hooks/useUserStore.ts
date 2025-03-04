"use client"
import { create } from 'zustand';

interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  roleName?: string;
  token?: string;

}

interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo;
  token: string | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => {
  const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
  const storedUserInfo = typeof window !== 'undefined' ? sessionStorage.getItem('userInfo') : null;
  let initialUserInfo: UserInfo = {};
  try {
    if (storedUserInfo) {
      initialUserInfo = JSON.parse(storedUserInfo);
    }
  } catch (error) {
    console.error("Error parsing JSON userInfo:", error);
  }

  const isLoggedIn = !!storedToken;

  return {
    isLoggedIn,
    userInfo: initialUserInfo,
    token: storedToken,
    login: (token, userInfo) => {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      set({ isLoggedIn: true, userInfo, token });
    },
    logout: () => {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userInfo');
      set({ isLoggedIn: false, userInfo: {}, token: null });
    },
  };
});

export default useAuthStore;
