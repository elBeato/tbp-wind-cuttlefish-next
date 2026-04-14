import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export default function Layout() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full max-w-screen-sm flex flex-col flex-1 px-2">
        <Header />

        {/* Divider */}
        <div className="border-spacing-0 border-zinc-200 dark:border-zinc-800 mb-6" />

        <main className="flex-1 w-full">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}