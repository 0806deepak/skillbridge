import { Request, Response, NextFunction } from 'express'
import { clerkClient, verifyToken } from '@clerk/clerk-sdk-node'
import  prisma  from '../lib/prisma'

// Extend Express Request to hold our user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

// requireAuth: checks Clerk token, loads user from DB, attaches to req.user
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the Clerk JWT token
    const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        issuer: null
    })

    const clerkUserId = payload.sub

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// requireRole: call AFTER requireAuth, checks if user has one of the allowed roles
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required: ${roles.join(' or ')}. You are: ${req.user.role}` 
      })
    }
    next()
  }
}