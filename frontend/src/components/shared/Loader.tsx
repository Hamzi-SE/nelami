import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        <p className="text-sm text-neutral-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Loader
