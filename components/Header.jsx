import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'
import { CalendarDays } from 'lucide-react'
import CreditButton from './CreditButton'
import RoleRedirect from './RoleRedirect'

const Header = async () => {
  let user = null;
  try {
    user = await checkUser();
  } catch (err) {
    console.error("Header: checkUser failed, rendering as signed-out", err?.message);
  }
  return (
    <nav className='fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 py-3 border-b border-white/7 backdrop-blur-xl'>
      {/* logo */}
      <div>
        <Link href="/">
          <Image src='/lockin.png' alt="LockIn Logo" width={100} height={100} style={{ width: 'auto', height: 'auto' }} />
        </Link>
      </div>
      {user && <RoleRedirect role={user.role} />}
      {/* auth */}
      <div className='flex items-center gap-4'>
        <Show when="signed-out">



          <SignInButton >
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="gold">Sign Up</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          {user?.role === "INTERVIEWER" && (
            <Button variant='ghost' asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          {user?.role === "INTERVIEWEE" && (<>
            <Button variant='ghost' asChild>
              <Link href="/explore">Explore</Link>
            </Button>
            <Button variant='default' asChild>
              <Link href="/appointments">
                <CalendarDays size={16} />
                <span className='hidden md:inline'> My Appointments</span>
              </Link>
            </Button>
          </>)}
          <CreditButton
            role={user?.role == "INTERVIEWER" ? "INTERVIEWER" : "INTERVIEWEE"}
            credits={
              (user?.role == "INTERVIEWER"
                ? user?.creditBalance : user?.credits) ?? 0
            }
          />
          <UserButton />
        </Show>
      </div>
    </nav>
  )
}

export default Header