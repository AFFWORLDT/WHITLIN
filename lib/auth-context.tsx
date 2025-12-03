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
        const savedUser = localStorage.getItem("whitlin_user")
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            // Also set cookie for middleware
            const isProduction = window.location.hostname !== 'localhost'
            const cookieString = `whitlin_user=${savedUser}; path=/; max-age=86400; SameSite=Lax${isProduction ? '; Secure' : ''}`
            document.cookie = cookieString
          } catch (error) {
            console.error('Error parsing user data:', error)
            localStorage.removeItem("whitlin_user")
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
          localStorage.setItem("whitlin_user", userDataString)
          // Set cookie for middleware
          const isProduction = window.location.hostname !== 'localhost'
          const cookieString = `whitlin_user=${userDataString}; path=/; max-age=86400; SameSite=Lax${isProduction ? '; Secure' : ''}`
          document.cookie = cookieString
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
          localStorage.setItem("whitlin_user", JSON.stringify(userData))
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
      const users = JSON.parse(localStorage.getItem("whitlin_users") || "[]")
      const adminExists = users.find((u: any) => u.email === "admin@whitlin.com")
      
      if (!adminExists) {
        const adminUser = {
          id: "admin-001",
          email: "admin@whitlin.com",
          password: "admin123",
          name: "Admin User",
        }
        users.push(adminUser)
        localStorage.setItem("whitlin_users", JSON.stringify(users))
      }
    }
  }, [])

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("whitlin_user")
      // Clear cookie
      document.cookie = "whitlin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
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
