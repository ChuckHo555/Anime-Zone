export const routes = {
  welcome: { path: "/", label: "Welcome Page" },
  auth: { path: "/auth", label: "Auth" },
  signIn: { path: "/sign-in", label: "Sign In" },
  signUp: { path: "/sign-up", label: "Sign Up" },
  home: { path: "/protected/HomePage", label: "Home" },
  search: { path: "/protected/SearchPage", label: "Search" }, // Add this
  recommendation: {
    path: "/protected/RecommendationPage",
    label: "Recommendations",
  }, 
  yourList: {
    path: "/protected/YourList",
    label: "Your List",
  },   
  profile: { path: "/protected/ProfilePage", label: "Profile" },
};

export interface User {
  userId: String;
  profilePicUrl: String;
}

export interface AnimeCardProps {
  anime: {
    id: number;
    title: {
      romaji: string;
      english?: string;
    };
    coverImage: {
      large: string;
    };
    averageScore: number;
    genres: string[];
  };
}

export interface Anime {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  description?: string;
  genres: string[];
  averageScore?: number;
  popularity?: number;
  coverImage: {
    large: string;
    medium?: string;
    small?: string;
  };
  episodes?: number;
  season?: string;
  year?: number;
}
