import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User, Lot, Produit, Journal, Livraison } from '../types/firestore';

export const createUser = async (userId: string, userData: Omit<User, 'createdAt' | 'updatedAt'>) => {
  const userRef = doc(db, 'users', userId);
  const now = Timestamp.now();
  
  await setDoc(userRef, {
    ...userData,
    createdAt: now,
    updatedAt: now
  });
};

export const createLot = async (lotData: Omit<Lot, 'createdAt' | 'updatedAt'>) => {
  const lotsRef = collection(db, 'lots');
  const now = Timestamp.now();
  
  await setDoc(doc(lotsRef), {
    ...lotData,
    createdAt: now,
    updatedAt: now
  });
};

export const createProduit = async (produitData: Omit<Produit, 'createdAt' | 'updatedAt'>) => {
  const produitsRef = collection(db, 'produits');
  const now = Timestamp.now();
  
  await setDoc(doc(produitsRef), {
    ...produitData,
    createdAt: now,
    updatedAt: now
  });
};

export const createJournal = async (journalData: Journal) => {
  const journauxRef = collection(db, 'journaux');
  await setDoc(doc(journauxRef), journalData);
};

export const createLivraison = async (livraisonData: Omit<Livraison, 'createdAt' | 'updatedAt'>) => {
  const livraisonsRef = collection(db, 'livraisons');
  const now = Timestamp.now();
  
  await setDoc(doc(livraisonsRef), {
    ...livraisonData,
    createdAt: now,
    updatedAt: now
  });
};