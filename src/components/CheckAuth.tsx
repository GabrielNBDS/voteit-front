import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import api from '../services/api'

const CheckAuth: React.FC = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get('/sessions/auth')

        if (window.location.pathname === '/login') {
          router.push('/dashboard')
        }
      } catch {
        if (window.location.pathname !== '/login') {
          router.push('/login')
        }
      }
    }

    checkAuth()
  }, [])

  return <>{children}</>
}

export default CheckAuth
