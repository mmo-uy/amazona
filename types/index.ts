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
  createdAt: string;
  updatedAt: string;
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

export interface Order {
  _id?: string;
  userId: string;
  orderItems: Pick<
    ProductInCart,
    Exclude<
      keyof ProductInCart,
      "_id" & "stock" & "description" & "category" & "rating" & "reviews"
    >
  >[];
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  itemsPrice: string | number;
  shippingPrice: string | number;
  taxPrice: string | number;
  totalPrice: string | number;
  isPaid?: boolean;
  paymentResult?: { id: string; status: string; email: string };
  isDelivered?: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt?: string;
}
export interface PaymentMethod {
  name: PaymentMethods.Cash | PaymentMethods.PayPal | PaymentMethods.Stripe;
  value?: string;
  image?: string;
  icon?: string;
}
export interface Payment {
  method: PaymentMethods.Cash | PaymentMethods.PayPal | PaymentMethods.Stripe;
  isPaid: boolean;
  amount: string;
  isPending: string;
}
export enum PaymentMethods {
  PayPal = "Paypal",
  Stripe = "Stripe",
  Cash = "Cash",
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  timestamps: string;
}
