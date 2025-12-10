import { create } from "zustand";

export const useAuthStore = create((set) => ({
    userId: null,
    role: null,
    isLogin: false,
    authChecked: false,  // 새로고침 호출 시 로그인 상태 체크 완료 여부

    // 로그인
    login: ({ userId, role }) =>
        set({
            userId,
            role,
            isLogin: true,
            authChecked: true,
        }),

    setUser: ({ userId, role }) => set(
        {
            userId, role
        }
    ),

    // 로그아웃
    logout: () =>
        set({
            userId: null,
            role: null,
            // accessToken: null,
            isLogin: false,
            authChecked: true,
        }),
}));
