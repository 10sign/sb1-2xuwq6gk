import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, where, Timestamp, doc, updateDoc, deleteDoc, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BatchFormData } from '../components/BatchModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export interface Batch {
  id: string;
  lotNumber: string;
  supplier: string;
  rawMaterial: string;
  quantity: string;
  unit: string;
  receptionDate: string;
  expiryDate?: string;
  status: 'utilisé' | 'partiel' | 'périmé';
  validated?: boolean;
  notes?: string;
  storageLocation?: string;
  documentUrl?: string;
  created_at: Timestamp;
}

export function useBatches(onlyValidated: boolean = false) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log('Aucun utilisateur connecté');
      setLoading(false);
      return;
    }

    console.log('Configuration du listener Firestore...');
    const lotsRef = collection(db, 'lots');
    
    let baseQuery = query(lotsRef, orderBy('receptionDate', 'desc'));

    if (onlyValidated) {
      baseQuery = query(lotsRef,
        where('status', '==', 'partiel'),
        where('validated', '==', true),
        orderBy('receptionDate', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      baseQuery,
      (snapshot) => {
        const batchesData = snapshot.docs.map(doc => {
          const data = doc.data();
          const isExpired = data.expiryDate && new Date(data.expiryDate) < new Date();
          
          if (isExpired) {
            updateDoc(doc.ref, {
              status: 'périmé',
              updated_at: Timestamp.now()
            });
            return null;
          }

          return {
            id: doc.id,
            ...data
          } as Batch;
        }).filter(batch => batch !== null) as Batch[];

        setBatches(batchesData);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur du listener Firestore:', error);
        toast.error('Erreur lors du chargement des lots');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, onlyValidated]);

  const createBatch = async (batchData: BatchFormData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const lotsRef = collection(db, 'lots');
      const newBatch = {
        ...batchData,
        status: 'partiel',
        validated: false,
        created_at: Timestamp.now(),
        created_by: user.uid
      };

      const docRef = await addDoc(lotsRef, newBatch);
      
      await addDoc(collection(db, 'journaux'), {
        type: 'creation_lot',
        lotId: docRef.id,
        utilisateur: user.uid,
        timestamp: Timestamp.now(),
        details: {
          lotNumber: batchData.lotNumber,
          quantity: batchData.quantity,
          unit: batchData.unit
        }
      });

      return { id: docRef.id, ...newBatch };
    } catch (error) {
      console.error('Erreur lors de la création du lot:', error);
      throw error;
    }
  };

  const updateBatchQuantity = async (batchId: string, quantityUsed: number) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const batchRef = doc(db, 'lots', batchId);
      const batchDoc = await getDoc(batchRef);

      if (!batchDoc.exists()) {
        throw new Error('Lot non trouvé');
      }

      const currentData = batchDoc.data();
      const currentQuantity = parseFloat(currentData.quantity);
      
      if (currentQuantity < quantityUsed) {
        throw new Error('Quantité insuffisante en stock');
      }

      const newQuantity = currentQuantity - quantityUsed;
      const newStatus = newQuantity === 0 ? 'utilisé' : 'partiel';

      const batch = writeBatch(db);

      batch.update(batchRef, {
        quantity: newQuantity.toString(),
        status: newStatus,
        updated_at: Timestamp.now(),
        updated_by: user.uid
      });

      const journalRef = collection(db, 'journaux');
      batch.set(doc(journalRef), {
        type: 'utilisation_lot',
        lotId: batchId,
        quantityUsed,
        remainingQuantity: newQuantity,
        utilisateur: user.uid,
        timestamp: Timestamp.now()
      });

      await batch.commit();

      toast.success(`Stock mis à jour : ${newQuantity} ${currentData.unit} restants`);

      if (newQuantity <= parseFloat(currentData.quantity) * 0.2) {
        toast.warning(`Stock faible : ${newQuantity} ${currentData.unit} restants`);
      }

      return {
        newQuantity,
        status: newStatus
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du stock');
      throw error;
    }
  };

  const updateBatch = async (batchId: string, updates: Partial<Batch>) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const batchRef = doc(db, 'lots', batchId);
      const batchDoc = await getDoc(batchRef);

      if (!batchDoc.exists()) {
        throw new Error('Lot non trouvé');
      }

      const batch = writeBatch(db);

      batch.update(batchRef, {
        ...updates,
        updated_at: Timestamp.now(),
        updated_by: user.uid
      });

      const journalRef = collection(db, 'journaux');
      batch.set(doc(journalRef), {
        type: 'modification_lot',
        lotId: batchId,
        modifications: updates,
        utilisateur: user.uid,
        timestamp: Timestamp.now()
      });

      await batch.commit();
      toast.success('Lot mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lot:', error);
      toast.error('Erreur lors de la mise à jour du lot');
      throw error;
    }
  };

  const deleteBatch = async (docIds: string[]): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      for (const docId of docIds) {
        const docRef = doc(db, 'lots', docId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error(`Le lot ${docId} n'existe pas`);
        }
        
        const lotData = docSnap.data();
        if (lotData.status === 'utilisé') {
          throw new Error(`Le lot ${lotData.lotNumber} ne peut pas être supprimé car il a déjà été utilisé`);
        }
      }

      const batch = writeBatch(db);

      for (const docId of docIds) {
        const docRef = doc(db, 'lots', docId);
        batch.delete(docRef);

        const journalRef = doc(collection(db, 'journaux'));
        batch.set(journalRef, {
          type: 'suppression_lot',
          lotId: docId,
          utilisateur: user.uid,
          timestamp: Timestamp.now()
        });
      }

      await batch.commit();
      
      toast.success(`${docIds.length} lot(s) supprimé(s) avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression des lots:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression des lots');
      throw error;
    }
  };

  const validateBatch = async (batchId: string, validated: boolean) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const batchRef = doc(db, 'lots', batchId);
      const batchDoc = await getDoc(batchRef);

      if (!batchDoc.exists()) {
        throw new Error('Lot non trouvé');
      }

      const batchData = batchDoc.data();
      if (batchData.status === 'utilisé') {
        throw new Error('Impossible de modifier un lot déjà utilisé');
      }

      const batch = writeBatch(db);

      batch.update(batchRef, {
        validated,
        validated_at: validated ? Timestamp.now() : null,
        validated_by: validated ? user.uid : null,
        updated_at: Timestamp.now(),
        updated_by: user.uid
      });

      const journalRef = doc(collection(db, 'journaux'));
      batch.set(journalRef, {
        type: validated ? 'validation_lot' : 'invalidation_lot',
        lotId: batchId,
        utilisateur: user.uid,
        timestamp: Timestamp.now()
      });

      await batch.commit();

      toast.success(validated ? 'Lot validé avec succès' : 'Lot invalidé avec succès');
    } catch (error) {
      console.error('Erreur lors de la validation du lot:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la validation du lot');
      throw error;
    }
  };

  return {
    batches,
    loading,
    createBatch,
    updateBatch,
    updateBatchQuantity,
    deleteBatch,
    validateBatch
  };
}