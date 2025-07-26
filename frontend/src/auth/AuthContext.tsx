import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { firebaseApp } from '../firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'contributor' | 'viewer';

interface User {
  email: string;
  username?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          username: firebaseUser.displayName || '',
          role: 'contributor',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  // Helper: get email from username
  const getEmailByUsername = async (username: string): Promise<string | null> => {
    const ref = doc(db, 'usernames', username);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().email;
    }
    return null;
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      let email = emailOrUsername;
      if (!emailOrUsername.includes('@')) {
        email = await getEmailByUsername(emailOrUsername) || '';
        if (!email) throw new Error('Username not found');
      }
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser({
          email: auth.currentUser.email || '',
          username: auth.currentUser.displayName || '',
          role: 'contributor',
        });
      }
      toast({ title: 'Logged in', status: 'success', duration: 2000, isClosable: true });
    } catch (err: any) {
      let msg = err.message;
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect password!';
      }
      toast({ title: msg, status: 'error', duration: 3000, isClosable: true });
      throw new Error(msg);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username });
        await setDoc(doc(db, 'usernames', username), { email });
        // Force reload to get the updated displayName
        await auth.currentUser.reload();
        setUser({
          email: auth.currentUser.email || '',
          username: auth.currentUser.displayName || '',
          role: 'contributor',
        });
      }
      toast({ title: 'Account created', status: 'success', duration: 2000, isClosable: true });
    } catch (err: any) {
      toast({ title: err.message, status: 'error', duration: 3000, isClosable: true });
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast({ title: 'Logged out', status: 'info', duration: 2000, isClosable: true });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 