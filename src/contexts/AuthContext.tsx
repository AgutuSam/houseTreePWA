import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types/user';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileUnsubscribe, setProfileUnsubscribe] = useState<(() => void) | null>(null);

  const createUserProfile = async (user: User, role: UserRole, additionalData?: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedProperties: [],
        ...additionalData
      };
      
      await setDoc(userRef, profile);
      setUserProfile(profile);
    } else {
      setUserProfile(userDoc.data() as UserProfile);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string, role: UserRole) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await createUserProfile(user, role);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, if not, redirect to role selection
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // For now, default to hunter role - you can implement role selection
      await createUserProfile(user, 'hunter');
    } else {
      setUserProfile(userDoc.data() as UserProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    const updatedData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(userRef, updatedData);
    setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Clean up previous profile subscription
      if (profileUnsubscribe) {
        profileUnsubscribe();
        setProfileUnsubscribe(null);
      }

      if (user) {
        setCurrentUser(user);
        
        // Set up real-time listener for user profile
        const unsubscribeProfile = userService.subscribeToUserProfile(
          user.uid,
          (profile) => {
            setUserProfile(profile);
            setLoading(false);
          }
        );
        setProfileUnsubscribe(() => unsubscribeProfile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
