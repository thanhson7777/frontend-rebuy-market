import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/PageLoadingSpinner/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerifycation() {
  let [searchParams] = useSearchParams()

  const { email, token } = Object.fromEntries([...searchParams])
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  if (!verified) {
    return <PageLoadingSpinner caption="Đang xác minh..." />
  }
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerifycation