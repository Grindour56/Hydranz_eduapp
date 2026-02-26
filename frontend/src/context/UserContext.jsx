import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo accounts if none exist
  useEffect(() => {
    const accounts = localStorage.getItem('eduapp_accounts');
    if (!accounts) {
      const demoAccounts = [
        {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'demo123',
          avatar: '👤',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Student',
          email: 'student@example.com',
          password: 'pass123',
          avatar: '🧑',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('eduapp_accounts', JSON.stringify(demoAccounts));
      console.log('✅ Demo accounts created');
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const user = localStorage.getItem('eduapp_current_user');
        if (user) {
          setCurrentUser(JSON.parse(user));
          console.log('✅ User loaded from storage');
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = (email, password) => {
    try {
      console.log('🔐 Login attempt for:', email);
      
      // Get accounts from localStorage
      const accounts = JSON.parse(localStorage.getItem('eduapp_accounts') || '[]');
      
      // Find user by email
      const user = accounts.find(u => u.email === email);
      
      if (!user) {
        console.log('❌ User not found:', email);
        return { success: false, error: 'User not found' };
      }
      
      // Verify password
      if (user.password !== password) {
        console.log('❌ Invalid password for:', email);
        return { success: false, error: 'Invalid password' };
      }
      
      // Remove password from user object before storing in state
      const { password: _, ...safeUser } = user;
      
      // Save to current session
      setCurrentUser(safeUser);
      localStorage.setItem('eduapp_current_user', JSON.stringify(safeUser));
      
      // Update last login
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('eduapp_accounts', JSON.stringify(accounts));
      
      console.log('✅ Login successful for:', safeUser.email);
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = (name, email, password) => {
    try {
      // Get existing accounts
      const accounts = JSON.parse(localStorage.getItem('eduapp_accounts') || '[]');
      
      // Check if email exists
      if (accounts.find(u => u.email === email)) {
        return { success: false, error: 'Email already exists' };
      }

      // Validate password
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        avatar: ['👤', '🧑', '👩', '👨', '🧔', '👧'][Math.floor(Math.random() * 6)],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to accounts
      accounts.push(newUser);
      localStorage.setItem('eduapp_accounts', JSON.stringify(accounts));

      // Remove password for current user
      const { password: _, ...safeUser } = newUser;
      
      // Set as current user
      setCurrentUser(safeUser);
      localStorage.setItem('eduapp_current_user', JSON.stringify(safeUser));

      console.log('✅ Signup successful for:', safeUser.email);
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduapp_current_user');
    console.log('✅ User logged out');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    localStorage.setItem('eduapp_current_user', JSON.stringify(updatedUser));
    
    // Also update in saved accounts
    try {
      const accounts = JSON.parse(localStorage.getItem('eduapp_accounts') || '[]');
      const index = accounts.findIndex(a => a.email === updatedUser.email);
      if (index >= 0) {
        accounts[index] = { ...accounts[index], ...updatedUser, password: accounts[index].password };
        localStorage.setItem('eduapp_accounts', JSON.stringify(accounts));
      }
    } catch (error) {
      console.error('Error updating accounts:', error);
    }
  };

  const forgotPassword = (email) => {
    try {
      const accounts = JSON.parse(localStorage.getItem('eduapp_accounts') || '[]');
      const user = accounts.find(u => u.email === email);
      
      if (!user) {
        return { success: false, error: 'Email not found' };
      }
      
      // In production, you would send an email with a reset link
      return { 
        success: true, 
        message: 'Password reset email sent. Check your inbox.',
        password: user.password // Only for demo!
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isLoading, 
      login, 
      signup, 
      logout, 
      updateUser,
      forgotPassword 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
