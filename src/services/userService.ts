import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';

export class UserService {
  private readonly collection = 'users';

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, this.collection, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, this.collection, uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async addSavedProperty(uid: string, propertyId: string): Promise<void> {
    const docRef = doc(db, this.collection, uid);
    await updateDoc(docRef, {
      savedProperties: arrayUnion(propertyId),
      updatedAt: new Date()
    });
  }

  async removeSavedProperty(uid: string, propertyId: string): Promise<void> {
    const docRef = doc(db, this.collection, uid);
    await updateDoc(docRef, {
      savedProperties: arrayRemove(propertyId),
      updatedAt: new Date()
    });
  }

  async updateSearchPreferences(uid: string, preferences: any): Promise<void> {
    const docRef = doc(db, this.collection, uid);
    await updateDoc(docRef, {
      searchPreferences: preferences,
      updatedAt: new Date()
    });
  }

  async updateSubscription(uid: string, subscription: any): Promise<void> {
    const docRef = doc(db, this.collection, uid);
    await updateDoc(docRef, {
      subscription: subscription,
      updatedAt: new Date()
    });
  }

  // Real-time listeners
  subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
    const docRef = doc(db, this.collection, uid);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserProfile);
      } else {
        callback(null);
      }
    });
  }
}

export const userService = new UserService();
