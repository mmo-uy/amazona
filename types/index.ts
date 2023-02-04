export interface Product {
  id: number;
  stock?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
export interface ProductInCart extends Product {
  quantity: number;
}
{
}
export type LoadingState = "idle" | "pending" | "succeeded" | "failed";

export enum Role {
  user = "user",
  admin = "admin",
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  timestamps: string;
}
