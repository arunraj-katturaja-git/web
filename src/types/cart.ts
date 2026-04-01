export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl?: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  lineTotal: number;
  inStock: boolean;
  stockQuantity: number;
}

export interface CartModel {
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  currency: string;
}
