export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
}

export interface ProductCardModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  inStock: boolean;
  startingPrice: number;
  variants: ProductVariant[];
}
