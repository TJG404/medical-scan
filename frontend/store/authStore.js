import { create } from "zustand";

export const useAuthStore = create((set) => ({
    userId: null,
    role: null,
    // accessToken: null,
    isLogin: false,
    // authChecked: false,     // 로그인 상태 체크 완료 여부

    // 로그인
    login: ({ userId, rold }) =>
        set({
            userId,
            role,
            // accessToken,
            isLogin: true,
            // authChecked: true,
        }),

    // accessToken만 갱신할 때 사용 (refresh 용)
    // setAccessToken: (accessToken) =>
    //     set((state) => ({
    //         ...state,
    //         accessToken,
    //     })),


    // 로그아웃
    logout: () =>
        set({
            userId: null,
            role: null,
            // accessToken: null,
            isLogin: false,
            // authChecked: true,
        }),
}));
