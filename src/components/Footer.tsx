import { TextLoop } from './ui/text-loop'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <a href="https://github.com/ibelick/nim" target="_blank">
          <TextLoop className="text-xs text-zinc-500">
            <span>© 2025 GlobeX</span>
            <span>Built with LOVE 💗 and ...</span>
            <span>built with Motion-Primitives.</span>
          </TextLoop>
        </a>
      </div>
    </footer>
  )
}