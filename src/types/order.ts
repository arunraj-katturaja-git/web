import type { CartItem } from "@/types/cart";

export type CheckoutPaymentMethod = "cod" | "mock" | "razorpay";

export interface OrderAddress {
  fullName: string;
  mobile: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export type OrderItem = Omit<
  CartItem,
  "productSlug" | "imageUrl" | "compareAtPrice" | "inStock" | "stockQuantity"
>;

export interface OrderModel {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  placedAt?: string;
  address: OrderAddress;
  items: OrderItem[];
}
