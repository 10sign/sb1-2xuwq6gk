import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types/user';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Vérifier si le document utilisateur existe dans Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          
          try {
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
              // Créer le document utilisateur s'il n'existe pas
              const newUserData = {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
                role: 'responsable_production',
                createdAt: new Date(),
                updatedAt: new Date()
              };

              try {
                await setDoc(userDocRef, newUserData);
                
                const user: User = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: newUserData.displayName || '',
                  photoURL: firebaseUser.photoURL || undefined,
                  role: newUserData.role
                };
                
                setUser(user);
              } catch (createError) {
                console.error('Erreur lors de la création du profil:', createError);
                toast.error('Impossible de créer votre profil. Veuillez réessayer.');
                setUser(null);
              }
            } else {
              // Récupérer les données utilisateur existantes
              const userData = userDoc.data();
              
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || userData?.displayName || '',
                photoURL: firebaseUser.photoURL || undefined,
                role: userData?.role || 'responsable_production'
              };
              
              setUser(user);
            }
          } catch (firestoreError) {
            console.error('Erreur d\'accès à Firestore:', firestoreError);
            toast.error('Impossible d\'accéder à votre profil. Vérifiez votre connexion.');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur lors de la synchronisation utilisateur:', error);
        toast.error('Erreur de synchronisation du profil. Veuillez vous reconnecter.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};