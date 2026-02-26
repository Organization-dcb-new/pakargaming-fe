import { NextRequest, NextResponse } from 'next/server'
import { decryptPayload } from '@/lib/crypto'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(req, path, 'GET')
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(req, path, 'POST')
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(req, path, 'PUT')
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxyRequest(req, path, 'PATCH')
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(req, path, 'DELETE')
}

async function proxyRequest(req: NextRequest, pathSegments: string[], method: string) {
  try {
    const targetPath = pathSegments.join('/')
    const search = req.nextUrl.search
    const targetUrl = `${BACKEND_URL}/${targetPath}${search}`

    // Forward headers (strip host, add forward info)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    // Forward Authorization header if present
    const auth = req.headers.get('authorization')
    if (auth) headers['Authorization'] = auth

    let body: string | undefined

    // Decrypt payload for mutating methods
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const rawBody = await req.json().catch(() => null)

      if (rawBody && rawBody.payload) {
        // Encrypted payload — decrypt it
        const decrypted = decryptPayload(rawBody.payload)
        body = JSON.stringify(decrypted)
      } else if (rawBody) {
        // Non-encrypted payload — forward as-is (fallback)
        body = JSON.stringify(rawBody)
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    })

    const data = await response.json().catch(() => null)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy Error]', error)
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 })
  }
}
