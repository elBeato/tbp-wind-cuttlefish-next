'use client'
import { TextEffect } from '../../components/ui/text-effect'
import Link from 'next/link'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="flex items-center text-2xl gap-2 hover:underline hover:underline-offset-4">
          WINDSEEKER APP
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Relax and wait for an email from your favorite windspot.
        </TextEffect>
      </div>
    </header>
  )
}
