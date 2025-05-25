import { Suspense } from 'react'

import LogIn from '@/components/shared/login'

const LoginPage = () => {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Suspense>
        <LogIn />
      </Suspense>
    </div>
  )
}

export default LoginPage
