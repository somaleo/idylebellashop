import React, { createContext, useContext, useState, useEffect } from 'react';
import { validatePassword, validateEmail, hashPassword, comparePassword } from '../lib/auth';

interface User {
  id: string;
  email: string;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user storage (in memory)
const users = new Map<string, { id: string; email: string; password: string; verified: boolean }>();

// Session storage key
const SESSION_KEY = 'auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.message);
      }

      const user = users.get(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Compare password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      if (!user.verified) {
        throw new Error('Please verify your email address');
      }

      const userData = {
        id: user.id,
        email: user.email,
        lastLogin: new Date(),
      };

      setUser(userData);

      // Store session if remember me is checked
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.message);
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      if (users.has(email)) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const id = crypto.randomUUID();
      users.set(email, {
        id,
        email,
        password: hashedPassword,
        verified: false,
      });

      // Send verification email (simulated)
      console.log('Sending verification email to:', email);

      // Don't automatically sign in - require email verification
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.message);
      }

      const user = users.get(email);
      if (!user) {
        // Don't reveal if email exists
        console.log('Password reset requested for non-existent email:', email);
        return;
      }

      // Send password reset email (simulated)
      console.log('Sending password reset email to:', email);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const userData = users.get(user.email);
      if (!userData) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValid = await comparePassword(currentPassword, userData.password);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      // Hash and update password
      const hashedPassword = await hashPassword(newPassword);
      users.set(user.email, { ...userData, password: hashedPassword });
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Send verification email (simulated)
      console.log('Sending verification email to:', user.email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}