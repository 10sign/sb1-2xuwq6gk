/*
  # Initial Schema Setup for VDC Traça

  1. New Tables
    - users: Store user information and roles
    - lots: Track received raw materials
    - produits: Manage base products and derivatives
    - journaux: Audit log for all operations
    - livraisons: Delivery management

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM (
  'magasinier',
  'production',
  'moulage',
  'deco',
  'emballage',
  'chauffeur',
  'responsable_production',
  'auditeur'
);

-- Create enum for lot status
CREATE TYPE lot_status AS ENUM (
  'utilisé',
  'partiel',
  'périmé'
);

-- Create enum for product status
CREATE TYPE product_status AS ENUM (
  'en_cours',
  'terminé',
  'livré'
);

-- Create enum for product type
CREATE TYPE product_type AS ENUM (
  'base',
  'sous_produit'
);

-- Create enum for production step
CREATE TYPE production_step AS ENUM (
  'production',
  'moulage',
  'deco',
  'emballage',
  'distribution'
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  display_name text,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lots (Raw materials) table
CREATE TABLE IF NOT EXISTS lots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  fournisseur text NOT NULL,
  date_reception timestamptz NOT NULL DEFAULT now(),
  produit_brut text NOT NULL,
  document_url text,
  status lot_status NOT NULL DEFAULT 'partiel',
  reception_par uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS produits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  type product_type NOT NULL,
  parent_id uuid REFERENCES produits(id),
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of lot IDs
  fabrique_par jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of user IDs
  etapes jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of completed steps
  date_production timestamptz NOT NULL DEFAULT now(),
  status product_status NOT NULL DEFAULT 'en_cours',
  qrcode_url text,
  chambre_froide text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS journaux (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  produit_id uuid REFERENCES produits(id) NOT NULL,
  lot_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  utilisateur_id uuid REFERENCES users(id) NOT NULL,
  etape production_step NOT NULL,
  commentaire text,
  created_at timestamptz DEFAULT now()
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS livraisons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date timestamptz NOT NULL DEFAULT now(),
  magasin_destination text NOT NULL,
  produits jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of product IDs
  bon_livraison_url text,
  chauffeur_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE journaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE livraisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Responsable production can read all users
CREATE POLICY "Responsable production can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'responsable_production'
    )
  );

-- Lots policies
CREATE POLICY "Magasiniers can create lots"
  ON lots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('magasinier', 'responsable_production')
    )
  );

CREATE POLICY "Authenticated users can read lots"
  ON lots
  FOR SELECT
  TO authenticated
  USING (true);

-- Products policies
CREATE POLICY "Production roles can create products"
  ON produits
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('production', 'moulage', 'deco', 'emballage', 'responsable_production')
    )
  );

CREATE POLICY "Authenticated users can read products"
  ON produits
  FOR SELECT
  TO authenticated
  USING (true);

-- Journal policies
CREATE POLICY "Users can create journal entries"
  ON journaux
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read journal entries"
  ON journaux
  FOR SELECT
  TO authenticated
  USING (true);

-- Delivery policies
CREATE POLICY "Chauffeurs can create deliveries"
  ON livraisons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('chauffeur', 'responsable_production')
    )
  );

CREATE POLICY "Authenticated users can read deliveries"
  ON livraisons
  FOR SELECT
  TO authenticated
  USING (true);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lots_updated_at
    BEFORE UPDATE ON lots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produits_updated_at
    BEFORE UPDATE ON produits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_livraisons_updated_at
    BEFORE UPDATE ON livraisons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();