import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'

import api from '../services/api'

const CheckAuth: React.FC = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = Cookies.get('@voteit:token')

        if (window.location.pathname === '/login' && token) {
          router.push('/dashboard')
          return
        }

        await api.get('/sessions/auth')
      } catch {
        if (window.location.pathname !== '/login') {
          Cookies.remove('@voteit:token')
          router.push('/login')
        }
      }
    }

    checkAuth()
  }, [])

  return <>{children}</>
}

export default CheckAuth
