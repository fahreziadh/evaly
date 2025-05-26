import { api } from '@convex/_generated/api'
import { useMutation } from 'convex/react'
import { GithubIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { GridPattern } from '../magicui/grid-pattern'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'

const Whistlist = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const addToWaitlist = useMutation(api.whistlist.newWhistlist)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    await addToWaitlist({ email })
    setEmail('')
    toast.success('Thank you! You have been added to the waitlist')
    setLoading(false)
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-2">
      <GridPattern strokeDasharray={'4 2'} />
      <Card className="border-foreground/25 z-10 container flex max-w-5xl flex-col gap-6 rounded-xl p-2 md:flex-row">
        <div className="flex flex-1 flex-col items-start justify-center p-3 md:p-6">
          <a href="https://github.com/fahreziadh/evaly">
            <Button
              variant={'outline-solid'}
              size={'xs'}
              className="mb-4 w-max px-2"
              rounded
            >
              <GithubIcon /> Star on Github
            </Button>
          </a>
          <h1 className="text-3xl font-bold text-pretty">
            A modern <span className="bg-foreground/10">open-source</span> platform for
            assessments and quizzes
          </h1>
          <p className="mt-4">
            Online examination platform that makes creating, distributing, and analyzing
            tests easy and secure.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full flex-col gap-2 md:flex-row md:items-center"
          >
            <Input
              type="email"
              required
              className="border-foreground/50 h-10"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button size={'lg'} type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Join the waitlist'}
            </Button>
          </form>
        </div>
        <div className="hidden aspect-square h-[40vh] flex-1 rounded-lg bg-[url('/images/login-bg.webp')] bg-cover bg-center md:block"></div>
      </Card>
    </div>
  )
}

export default Whistlist
