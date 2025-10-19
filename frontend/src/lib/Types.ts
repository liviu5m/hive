export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  profilePicture: string;
  coverPicture: string;
  createdAt: string;
};

export type UserDto = {
  profilePicture: string;
  coverPicture: string;
  name: string;
  username: string;
  bio: string;
  location: string;
};

export type FollowRequest = {
  id: number;
  follower: User;
  following: User;
  status: string;
};

export type PostDto = {
  posterId: number;
  content: string;
  images: string;
};

export type Post = {
  id: number;
  poster: User;
  content: string;
  images: string;
  createdAt: string;
};

export type Like = {
  id: number;
  user: User;
  createdAt: string;
};

export type Comment = {
  id: number;
  user: User;
  content: string;
  createdAt: string;
};

export type Reply = {
  id: number;
  user: User;
  content: string;
  createdAt: string;
};
