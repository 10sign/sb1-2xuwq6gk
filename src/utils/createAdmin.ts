import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export async function createAdminUser() {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'grondin.stephane@gmail.com',
      'Nidnorg1962@'
    );

    // Update the user profile
    await updateProfile(userCredential.user, {
      displayName: 'Stephane Grondin'
    });

    // Create the user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'grondin.stephane@gmail.com',
      displayName: 'Stephane Grondin',
      role: 'responsable_production',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin user created successfully');
    return userCredential.user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}