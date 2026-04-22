export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category: 'bouquet' | 'composition' | 'mono';
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
