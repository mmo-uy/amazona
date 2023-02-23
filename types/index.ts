export type LoadingState = "idle" | "pending" | "succeeded" | "failed";
export enum Role {
  user = "user",
  admin = "admin",
}
export interface Product {
  _id: number | string;
  stock?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
}
export interface ProductInCart extends Product {
  quantity: number;
}
{
}
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
export interface PaymentMethod {
  name: string;
  value?: string;
  image?: string;
  icon?: string;
}
export interface Order {
  _id?: number | string;
  userId: string;
  orderItems: Pick<
    ProductInCart,
    Exclude<
      keyof ProductInCart,
      "_id" & "stock" & "description" & "category" & "rating" & "reviews"
    >
  >[];
  // ProductInCart[];
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  itemsPrice: string | number;
  shippingPrice: string | number;
  taxPrice: string | number;
  totalPrice: string | number;
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  deliveredAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  timestamps: string;
}
