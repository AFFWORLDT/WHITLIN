// Temporary in-memory OTP store
// In production, use Redis or database

interface OTPData {
  otp: string
  email: string
  expiresAt: Date
  isUsed: boolean
}

const otpStore = new Map<string, OTPData>()

export const storeOTP = (email: string, otp: string, expiresAt: Date): void => {
  otpStore.set(email.toLowerCase(), {
    otp,
    email: email.toLowerCase(),
    expiresAt,
    isUsed: false
  })
  
  // Clean up expired OTPs
  setTimeout(() => {
    otpStore.delete(email.toLowerCase())
  }, 10 * 60 * 1000) // 10 minutes
}

export const getOTP = (email: string): OTPData | null => {
  const data = otpStore.get(email.toLowerCase())
  
  if (!data) {
    return null
  }
  
  // Check if expired
  if (new Date() > data.expiresAt) {
    otpStore.delete(email.toLowerCase())
    return null
  }
  
  return data
}

export const verifyOTP = (email: string, otp: string): boolean => {
  const data = getOTP(email)
  
  if (!data || data.isUsed) {
    return false
  }
  
  if (data.otp !== otp) {
    return false
  }
  
  return true
}

export const markOTPAsUsed = (email: string): void => {
  const data = otpStore.get(email.toLowerCase())
  if (data) {
    data.isUsed = true
    otpStore.set(email.toLowerCase(), data)
  }
}

export const clearOTP = (email: string): void => {
  otpStore.delete(email.toLowerCase())
}

// Debug function
export const getAllOTPs = (): Map<string, OTPData> => {
  return otpStore
}
