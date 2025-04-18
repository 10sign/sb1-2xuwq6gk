export type UserRole = 
  | 'magasinier'
  | 'production'
  | 'moulage'
  | 'deco'
  | 'emballage'
  | 'chauffeur'
  | 'responsable_production'
  | 'auditeur';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
}