import mongoose from 'mongoose'

const MONGO_URI = 'mongodb+srv://affworldtechnologies:wMbiyR0ZM8JWfOYl@loc.6qmwn3p.mongodb.net/keragold-ecommerce?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&socketTimeoutMS=45000'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

        if (!cached.promise) {
          const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // 5 seconds (reduced)
            socketTimeoutMS: 30000, // 30 seconds (reduced) 
            connectTimeoutMS: 5000, // 5 seconds (reduced)
            maxPoolSize: 5, // Maintain up to 5 socket connections (reduced)
            minPoolSize: 2, // Maintain a minimum of 2 socket connections (reduced)
            maxIdleTimeMS: 20000, // Close connections after 20 seconds of inactivity (reduced)
            retryWrites: true,
            w: 'majority',
            heartbeatFrequencyMS: 10000, // Check connection health every 10 seconds
            maxStalenessSeconds: 90, // Maximum staleness
          }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('MongoDB connection error:', error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
