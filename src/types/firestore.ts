export type UserRole = 
  | 'production'
  | 'moulage'
  | 'deco'
  | 'emballage'
  | 'chauffeur'
  | 'responsable_production';

export type LotStatus = 'utilisé' | 'partiel' | 'périmé';
export type ProductStatus = 'en_cours' | 'en_pause' | 'terminé';
export type ProductType = 'base' | 'sous_produit';
export type ProductionStep = 'production' | 'moulage' | 'deco' | 'emballage' | 'distribution';

export interface User {
  nom: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lot {
  fournisseur: string;
  dateReception: Date;
  produitBrut: string;
  documentsURL?: string;
  status: LotStatus;
  receptionPar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Produit {
  nom: string;
  type: ProductType;
  parentId?: string;
  ingredients: string[];
  fabriquéPar: string[];
  étapes: ProductionStep[];
  dateProduction: Date;
  status: ProductStatus;
  qrcodeURL?: string;
  chambreFroide?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journal {
  produitId: string;
  lotIds: string[];
  utilisateur: string;
  étape: ProductionStep;
  timestamp: Date;
  commentaire?: string;
}

export interface Livraison {
  date: Date;
  magasinDestination: string;
  produits: string[];
  bonLivraisonPDF?: string;
  chauffeur: string;
  createdAt: Date;
  updatedAt: Date;
}