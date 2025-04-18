import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, deleteDoc, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import type { ProductStatus } from '../types/firestore';

export interface Production {
  id: string;
  lotNumber: string;
  type: 'base' | 'sous_produit';
  dateProduction: Date;
  operatorName: string;
  cookingTemperature: number;
  cookingTime: number;
  étapes: string[];
  status: ProductStatus;
  quantity: number;
  unit: string;
  lotId: string;
  qrCodeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeletionReport {
  productionId: string;
  lotId: string;
  quantityRestored: number;
  unit: string;
  timestamp: Date;
  userId: string;
  userName: string;
  error?: string;
}

export function useProductions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletionReport, setDeletionReport] = useState<DeletionReport | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('Setting up productions listener...');
    const produitsRef = collection(db, 'produits');
    const q = query(produitsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`Received ${snapshot.docs.length} productions`);
        const productionsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            lotNumber: data.lotNumber || '',
            type: data.type || 'base',
            dateProduction: data.dateProduction instanceof Timestamp ? data.dateProduction.toDate() : new Date(),
            operatorName: data.operatorName || '',
            cookingTemperature: data.cookingTemperature || 0,
            cookingTime: data.cookingTime || 0,
            étapes: data.étapes || [],
            status: data.status || 'en_cours',
            quantity: data.quantity || 0,
            unit: data.unit || 'L',
            lotId: data.lotId || '',
            qrCodeUrl: data.qrCodeUrl,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
          } as Production;
        });

        setProductions(productionsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading productions:', error);
        toast.error('Erreur lors du chargement des productions');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up productions listener');
      unsubscribe();
    };
  }, []);

  const updateProductionStatus = async (productionId: string, newStatus: ProductStatus) => {
    if (!user) {
      toast.error('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      const productionRef = doc(db, 'produits', productionId);
      const productionDoc = await getDoc(productionRef);

      if (!productionDoc.exists()) {
        throw new Error('Production non trouvée');
      }

      await updateDoc(productionRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid
      });

      await addDoc(collection(db, 'journaux'), {
        type: 'changement_statut_production',
        productionId,
        ancienStatut: productionDoc.data().status,
        nouveauStatut: newStatus,
        utilisateur: user.uid,
        timestamp: Timestamp.now()
      });

      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating production status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }
  };

  const updateProduction = async (productionId: string, updates: Partial<Production>) => {
    if (!user) {
      toast.error('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      const productionRef = doc(db, 'produits', productionId);
      const productionDoc = await getDoc(productionRef);

      if (!productionDoc.exists()) {
        throw new Error('Production non trouvée');
      }

      await updateDoc(productionRef, {
        ...updates,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid
      });

      await addDoc(collection(db, 'journaux'), {
        type: 'modification_production',
        productionId,
        modifications: updates,
        utilisateur: user.uid,
        timestamp: Timestamp.now()
      });

      toast.success('Production mise à jour avec succès');
    } catch (error) {
      console.error('Error updating production:', error);
      toast.error('Erreur lors de la mise à jour de la production');
      throw error;
    }
  };

  const deleteProduction = async (productionId: string): Promise<DeletionReport> => {
    if (!user) {
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }

    try {
      const productionRef = doc(db, 'produits', productionId);
      const productionDoc = await getDoc(productionRef);
      
      if (!productionDoc.exists()) {
        throw new Error('Production non trouvée');
      }

      const productionData = productionDoc.data();
      const lotId = productionData.lotId;

      await deleteDoc(productionRef);

      const report: DeletionReport = {
        productionId,
        lotId: lotId || '',
        quantityRestored: productionData.quantity || 0,
        unit: productionData.unit || '',
        timestamp: new Date(),
        userId: user.uid,
        userName: user.displayName || user.email || 'Utilisateur inconnu',
        error: lotId ? undefined : 'lot_not_found'
      };

      await addDoc(collection(db, 'journaux'), {
        type: 'suppression_production',
        ...report,
        timestamp: Timestamp.now()
      });

      setDeletionReport(report);
      setProductions(prev => prev.filter(p => p.id !== productionId));
      
      return report;
    } catch (error) {
      console.error('Error deleting production:', error);
      throw error;
    }
  };

  return { 
    productions, 
    loading, 
    deleteProduction,
    updateProduction,
    updateProductionStatus,
    deletionReport 
  };
}