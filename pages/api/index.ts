import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Forward the request to Django backend root API
    const response = await fetch('http://localhost:8000/api/', {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { body: JSON.stringify(req.body) }),
    })
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    let data
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }
    
    // Forward the response
    if (typeof data === 'string') {
      res.status(response.status).send(data)
    } else {
      res.status(response.status).json(data)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Proxy error', details: errorMessage })
  }
}