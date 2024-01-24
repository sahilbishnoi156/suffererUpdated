import { create } from "zustand";

export const useUserStore = create((set) => ({
  currentUserData: {},
  setCurrentUserData: (currentUserData) => set({ currentUserData }),
  routeUserData: {},
  setRouteUserData: (routeUserData) => set({ routeUserData }),
  savedPosts: [],
  setSavedPosts: (savedPosts) => set({ savedPosts }),
  likedPosts: [],
  setLikedPosts: (likedPosts) => set({ likedPosts }),
  suggestedUsers: [],
  setSuggestedUsers: (suggestedUsers) => set({ suggestedUsers }),
  mainPagePosts:[],
  setMainPagePosts: (mainPagePosts) => set({ mainPagePosts }),
  followersAndFollowings:[],
  setFollowersAndFollowings: (followersAndFollowings) => set({ followersAndFollowings }),
}));

export const useLoadingStore = create((set) => ({
  progress: 0,
  setProgress: (newProgress) => set({ progress: newProgress }), 

  loading: false,
  setLoading: (newLoading) => set({ loading: newLoading }), 
  
  isCommentDeleting: false,
  setIsCommentDeleting: (newLoading) => set({ isCommentDeleting: newLoading }), 

}));