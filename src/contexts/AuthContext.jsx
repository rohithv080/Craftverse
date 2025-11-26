import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/firebaseConfig'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid))
          if (userDoc.exists()) {
            setUser({ ...u, ...userDoc.data() })
          } else {
            setUser(u)
          }
        } catch (error) {
          // Failed to fetch user data, use basic user info
          setUser(u)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function signup({ email, password, name }) {
    try {
      // Create authentication user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile if name provided
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      
      // Create user document in Firestore
      const userDocRef = doc(db, 'users', cred.user.uid);
      
      const userData = {
        uid: cred.user.uid,
        email,
        name: name || '',
        createdAt: new Date().toISOString(),
        role: null,
        isNewUser: true
      };
      
      await setDoc(userDocRef, userData);
      
      return cred.user;
    } catch (error) {
      throw error;
    }
  }

  async function setUserRole(role) {
    if (!user || !user.uid) {
      throw new Error('No user found')
    }
    
    try {
      // Update the user document in Firestore
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        role: role,
        isNewUser: false,
        roleSelectedAt: new Date().toISOString()
      })
      
      // Update local user state
      setUser(prev => ({ ...prev, role, isNewUser: false }))
      
      return true
    } catch (error) {
      throw error
    }
  }

  function login({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  const value = { 
    user, 
    loading, 
    signup, 
    login, 
    logout, 
    setUserRole 
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


