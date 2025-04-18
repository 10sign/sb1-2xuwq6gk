import React, { useState } from 'react';
import { Save, Package, Calendar, Truck, AlertCircle, Thermometer, Clock, User, Info } from 'lucide-react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useBatches, Batch } from '../hooks/useBatches';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ProductionFormData {
  lotId: string;
  productionDate: string;
  quantity: number;
  operatorName: string;
  cookingTemperature: number;
  cookingTime: number;
  notes?: string;
  components?: {
    lotId: string;
    quantity: number;
  }[];
}

export default function ProductionForm() {
  const { user } = useAuth();
  const { batches, loading: loadingBatches, updateBatchQuantity } = useBatches(true);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isComposite, setIsComposite] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<Array<{batch: Batch, quantity: number}>>([]);
  const [formData, setFormData] = useState<ProductionFormData>({
    lotId: '',
    productionDate: new Date().toISOString().split('T')[0],
    quantity: 0,
    operatorName: user?.displayName || '',
    cookingTemperature: 0,
    cookingTime: 0,
    notes: '',
    components: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch && !isComposite) {
      toast.error('Veuillez sélectionner un lot');
      return;
    }

    if (formData.quantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    if (formData.cookingTemperature <= 0) {
      toast.error('La température de cuisson doit être spécifiée');
      return;
    }

    if (formData.cookingTime <= 0) {
      toast.error('Le temps de cuisson doit être spécifié');
      return;
    }

    setLoading(true);
    
    try {
      const productionData = {
        lotNumber: isComposite ? `COMP-${Date.now()}` : selectedBatch?.lotNumber,
        type: isComposite ? 'composite' : 'base',
        dateProduction: Timestamp.fromDate(new Date(formData.productionDate)),
        operatorName: formData.operatorName,
        cookingTemperature: formData.cookingTemperature,
        cookingTime: formData.cookingTime,
        étapes: ['production'],
        status: 'en_cours',
        quantity: formData.quantity,
        unit: selectedBatch?.unit || 'KG',
        components: isComposite ? selectedComponents.map(comp => ({
          lotId: comp.batch.id,
          lotNumber: comp.batch.lotNumber,
          quantity: comp.quantity
        })) : [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const productionRef = await addDoc(collection(db, 'produits'), productionData);

      if (isComposite) {
        for (const component of selectedComponents) {
          try {
            await updateBatchQuantity(component.batch.id, component.quantity);
          } catch (error) {
            console.error(`Erreur lors de la mise à jour du lot ${component.batch.lotNumber}:`, error);
            toast.error(`Erreur lors de la mise à jour du lot ${component.batch.lotNumber}`);
          }
        }
      } else if (selectedBatch) {
        try {
          await updateBatchQuantity(selectedBatch.id, formData.quantity);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du lot:', error);
          toast.error('Erreur lors de la mise à jour du lot');
        }
      }

      await addDoc(collection(db, 'journaux'), {
        produitId: productionRef.id,
        lotIds: isComposite ? selectedComponents.map(comp => comp.batch.id) : [selectedBatch?.id],
        utilisateur: user?.uid,
        étape: 'production',
        commentaire: formData.notes,
        timestamp: Timestamp.now()
      });

      toast.success('Production enregistrée avec succès');
      
      setFormData({
        lotId: '',
        productionDate: new Date().toISOString().split('T')[0],
        quantity: 0,
        operatorName: user?.displayName || '',
        cookingTemperature: 0,
        cookingTime: 0,
        notes: '',
        components: []
      });
      setSelectedBatch(null);
      setSelectedComponents([]);
      setIsComposite(false);
    } catch (error) {
      console.error('Error creating production:', error);
      toast.error('Erreur lors de l\'enregistrement de la production');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains unchanged
  // ... (keep all the existing JSX and helper functions)
}