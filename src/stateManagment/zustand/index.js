import { create } from "zustand";

export const useUserStore = create((set) => ({
  currentUserData: {},
  setCurrentUserData: (currentUserData) => set({ currentUserData }),
  routeUserData: {},
  setRouteUserData: (routeUserData) => set({ routeUserData }),
  suggestedUsers: [],
  setSuggestedUsers: (suggestedUsers) => set({ suggestedUsers }),
  mainPagePosts:[],
  setMainPagePosts: (mainPagePosts) => set({ mainPagePosts }),
}));


export const useLoadingStore = create((set) => ({
  progress: 0,
  setProgress: (newProgress) => set({ progress: newProgress }), 

  loading: false,
  setLoading: (newLoading) => set({ loading: newLoading }), 
}));