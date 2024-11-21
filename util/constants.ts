   export const routes = {
      welcome: { path: '/', label: 'Welcome Page' },
      auth: { path: '/auth', label: 'Auth' },
      signIn: { path: '/sign-in', label: 'Sign In' },
      signUp: { path: '/sign-up', label: 'Sign Up' },
      home: { path: '/homepage', label: 'Home Page' },
      animeList: { path: '/anime-list', label: 'My Anime List' },
      settings: { path: '/settings', label: 'Settings' },
    };

    export interface User{
      userId : String
      profilePicUrl : String
    };

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
    
   