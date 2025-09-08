"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role?: 'customer' | 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem("keragold_user")
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            // Also set cookie for middleware
            document.cookie = `keragold_user=${savedUser}; path=/; max-age=86400` // 24 hours
          } catch (error) {
            console.error('Error parsing user data:', error)
            localStorage.removeItem("keragold_user")
          }
        }
      }
    }
    
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          const userDataString = JSON.stringify(userData)
          localStorage.setItem("keragold_user", userDataString)
          // Set cookie for middleware
          document.cookie = `keragold_user=${userDataString}; path=/; max-age=86400` // 24 hours
        }
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem("keragold_user", JSON.stringify(userData))
        }
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  // Initialize with admin user for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem("keragold_users") || "[]")
      const adminExists = users.find((u: any) => u.email === "admin@keragold.com")
      
      if (!adminExists) {
        const adminUser = {
          id: "admin-001",
          email: "admin@keragold.com",
          password: "admin123",
          name: "Admin User",
        }
        users.push(adminUser)
        localStorage.setItem("keragold_users", JSON.stringify(users))
      }
    }
  }, [])

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("keragold_user")
      // Clear cookie
      document.cookie = "keragold_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
