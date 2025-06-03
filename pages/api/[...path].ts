import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query
  const pathString = Array.isArray(path) ? path.join('/') : path || ''
  
  // Ensure trailing slash for Django compatibility
  const apiPath = pathString.endsWith('/') ? pathString : `${pathString}/`
  
  try {
    // Forward the request to Django backend
    const response = await axios({
      method: req.method as any,
      url: `${BACKEND_URL}/api/${apiPath}`,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        // Forward authorization header if present
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    })
    
    // Forward the response
    res.status(response.status).json(response.data)
  } catch (error: any) {
    console.error('API proxy error:', error.message)
    
    if (error.response) {
      // Forward error response from Django
      res.status(error.response.status).json(error.response.data)
    } else {
      // Network or other error
      res.status(500).json({ 
        error: 'Backend service unavailable',
        details: error.message 
      })
    }
  }
}