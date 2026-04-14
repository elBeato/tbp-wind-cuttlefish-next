import { Link } from 'react-router-dom'
import { TextEffect } from '../components/ui/text-effect'

export function Header() {
  return (
    <header className="mb-0 flex items-center justify-between pt-10 pb-8">
      <div>
        <Link to="/" className="flex items-center text-2xl gap-2 hover:underline hover:underline-offset-4">
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