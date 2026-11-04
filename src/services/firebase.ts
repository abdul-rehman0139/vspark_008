import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, PosterDesign, PosterTemplate, Competition, CampusEvent } from '../types';
import { StorageService } from './storage';
import { INITIAL_COMPETITIONS, INITIAL_EVENTS } from '../data/sampleData';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is running in offline cache mode.");
    }
  }
}
testConnection();

// Known default admin email
const PRIMARY_ADMIN_EMAIL = 'devilboy7693@gmail.com';

export const FirebaseService = {
  // Sync Firebase User with Firestore Profile
  async syncUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', fbUser.uid);
    let role: 'student' | 'admin' = 'student';
    
    // Check if email matches designated admin or admin doc exists
    const isAdminEmail = fbUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
    
    try {
      const adminDocRef = doc(db, 'admins', fbUser.uid);
      const adminSnap = await getDoc(adminDocRef);
      if (adminSnap.exists() || isAdminEmail) {
        role = 'admin';
        // Ensure admin document exists in database
        if (!adminSnap.exists()) {
          await setDoc(adminDocRef, {
            email: fbUser.email || PRIMARY_ADMIN_EMAIL,
            addedAt: new Date().toISOString(),
            role: 'admin'
          });
        }
      }
    } catch {
      if (isAdminEmail) role = 'admin';
    }

    const profileData: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Campus Creator',
      email: fbUser.email || '',
      role: role,
      avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`
    };

    try {
      await setDoc(userDocRef, {
        id: profileData.id,
        email: profileData.email,
        displayName: profileData.name,
        photoURL: profileData.avatar,
        role: profileData.role,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn("Could not write user profile to firestore, using local fallback", err);
    }

    StorageService.setUser(profileData);
    return profileData;
  },

  // Auth Methods
  async loginWithGoogle(): Promise<UserProfile> {
    const cred = await signInWithPopup(auth, googleProvider);
    return await this.syncUserProfile(cred.user);
  },

  async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return await this.syncUserProfile(cred.user);
  },

  async registerWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    return await this.syncUserProfile(cred.user);
  },

  async logout(): Promise<void> {
    await signOut(auth);
    StorageService.setUser({
      id: 'guest_' + Date.now(),
      name: 'Guest Creator',
      email: 'guest@vspark.edu',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
  },

  // Poster Designs in Firestore
  async getDesigns(userId?: string): Promise<PosterDesign[]> {
    try {
      const colRef = collection(db, 'designs');
      let q = query(colRef);
      if (userId && auth.currentUser) {
        q = query(colRef, where('userId', '==', userId));
      }
      const snap = await getDocs(q);
      const list: PosterDesign[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as PosterDesign);
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn("Failed fetching designs from Firestore, loading local designs", err);
    }
    return StorageService.getDesigns();
  },

  async saveDesign(design: PosterDesign): Promise<void> {
    // Save to local storage first for snappy UI
    StorageService.saveDesign(design);
    
    // Persist to real Firestore if authenticated
    if (auth.currentUser) {
      try {
        const path = `designs/${design.id}`;
        await setDoc(doc(db, 'designs', design.id), design);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `designs/${design.id}`);
      }
    }
  },

  async deleteDesign(designId: string): Promise<void> {
    StorageService.deleteDesign(designId);
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'designs', designId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `designs/${designId}`);
      }
    }
  },

  // Competitions
  async getCompetitions(): Promise<Competition[]> {
    try {
      const snap = await getDocs(collection(db, 'competitions'));
      const list: Competition[] = [];
      snap.forEach(d => list.push(d.data() as Competition));
      if (list.length > 0) return list;
    } catch {
      // Fallback
    }
    return INITIAL_COMPETITIONS;
  },

  async saveCompetition(comp: Competition): Promise<void> {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'competitions', comp.id), comp);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `competitions/${comp.id}`);
      }
    }
  },

  // Events
  async getEvents(): Promise<CampusEvent[]> {
    try {
      const snap = await getDocs(collection(db, 'events'));
      const list: CampusEvent[] = [];
      snap.forEach(d => list.push(d.data() as CampusEvent));
      if (list.length > 0) return list;
    } catch {
      // Fallback
    }
    return INITIAL_EVENTS;
  },

  async saveEvent(event: CampusEvent): Promise<void> {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'events', event.id), event);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `events/${event.id}`);
      }
    }
  }
};
