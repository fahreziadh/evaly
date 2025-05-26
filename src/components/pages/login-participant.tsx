'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

const LoginParticipantPage = () => {
  return (
    <div className="flex flex-row">
      <div className="container flex min-h-screen flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-primary text-3xl font-bold">Welcome to Evaly</h1>
          <h2 className="text-muted-foreground mt-2 mb-6">
            Login to your account to continue starting your exams
          </h2>

          <div className="w-full max-w-sm">
            <div className="flex w-full flex-wrap items-center gap-2">
              <GoogleLogin />
            </div>
          </div>

          <span className="text-muted-foreground fixed bottom-4 mt-4 max-w-md text-xs">
            By continuing, you agree to our{' '}
            <Link to={'/'} className="underline">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link to={'/'} className="underline">
              Privacy Policy
            </Link>
          </span>
        </div>
      </div>
      <div className="hidden h-screen flex-1 bg-[url('/images/login-bg.webp')] bg-cover bg-center lg:block">
        {/* <Image
          className="flex-1 w-full h-full object-cover"
          src={"/images/login-bg.png"}
          alt="Login Image"
          width={2000}
          height={2000}
          quality={100}
        /> */}
      </div>
    </div>
  )
}
export default LoginParticipantPage

const GoogleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="h-5 w-5"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

const GoogleLogin = () => {
  const { signIn } = useAuthActions()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', {
      redirectTo: location.toString()
    })
    setIsLoading(false)
  }

  return (
    <Button
      variant="outline"
      type="button"
      size="lg"
      className="border-foreground/20 w-full flex-1 gap-2 font-medium"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          <GoogleIcon />
          Sign in with Google
        </>
      )}
    </Button>
  )
}
