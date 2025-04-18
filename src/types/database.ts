export type UserRole = 
  | 'magasinier'
  | 'production'
  | 'moulage'
  | 'deco'
  | 'emballage'
  | 'chauffeur'
  | 'responsable_production'
  | 'auditeur';

export type LotStatus = 'utilisé' | 'partiel' | 'périmé';
export type ProductStatus = 'en_cours' | 'terminé' | 'livré';
export type ProductType = 'base' | 'sous_produit';
export type ProductionStep = 'production' | 'moulage' | 'deco' | 'emballage' | 'distribution';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name?: string | null;
          role: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      lots: {
        Row: {
          id: string;
          fournisseur: string;
          date_reception: string;
          produit_brut: string;
          document_url: string | null;
          status: LotStatus;
          reception_par: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fournisseur: string;
          date_reception?: string;
          produit_brut: string;
          document_url?: string | null;
          status?: LotStatus;
          reception_par: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fournisseur?: string;
          date_reception?: string;
          produit_brut?: string;
          document_url?: string | null;
          status?: LotStatus;
          reception_par?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      produits: {
        Row: {
          id: string;
          nom: string;
          type: ProductType;
          parent_id: string | null;
          ingredients: string[];
          fabrique_par: string[];
          etapes: ProductionStep[];
          date_production: string;
          status: ProductStatus;
          qrcode_url: string | null;
          chambre_froide: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          type: ProductType;
          parent_id?: string | null;
          ingredients?: string[];
          fabrique_par?: string[];
          etapes?: ProductionStep[];
          date_production?: string;
          status?: ProductStatus;
          qrcode_url?: string | null;
          chambre_froide?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          type?: ProductType;
          parent_id?: string | null;
          ingredients?: string[];
          fabrique_par?: string[];
          etapes?: ProductionStep[];
          date_production?: string;
          status?: ProductStatus;
          qrcode_url?: string | null;
          chambre_froide?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      journaux: {
        Row: {
          id: string;
          produit_id: string;
          lot_ids: string[];
          utilisateur_id: string;
          etape: ProductionStep;
          commentaire: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          produit_id: string;
          lot_ids?: string[];
          utilisateur_id: string;
          etape: ProductionStep;
          commentaire?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          produit_id?: string;
          lot_ids?: string[];
          utilisateur_id?: string;
          etape?: ProductionStep;
          commentaire?: string | null;
          created_at?: string;
        };
      };
      livraisons: {
        Row: {
          id: string;
          date: string;
          magasin_destination: string;
          produits: string[];
          bon_livraison_url: string | null;
          chauffeur_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date?: string;
          magasin_destination: string;
          produits?: string[];
          bon_livraison_url?: string | null;
          chauffeur_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          magasin_destination?: string;
          produits?: string[];
          bon_livraison_url?: string | null;
          chauffeur_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}