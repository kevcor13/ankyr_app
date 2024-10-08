
export type IContextType = {
  user: IUser; 
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    complete: boolean;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export interface INewChallenge {
    title: string;
    description: string;
    userId: string;  
}

export interface INewChallenge {
  title: string;
  description: string;
  day: string;
  userId: string;
  completed?: boolean;
}

export interface IUpdateUserInfo{
  gender: string;
  age: number;
  weight: number;
  fitness: string;
  workoutdays: number;
  goal: string;
}

export interface ILoseWeightInfo{
  chosenWorkout: string;
  days?: number;
  weightSize: string;
}

