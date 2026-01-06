import { useState, useEffect } from 'react'
import { Search, Wifi, Volume2, Battery } from 'lucide-react'
import { WindowState } from '../types'

interface TaskbarProps {
  onStartClick: () => void
  windows: WindowState[]
  activeWindowId: string | null
  onWindowClick: (id: string) => void
}

export default function Taskbar({ onStartClick, windows, activeWindowId, onWindowClick }: TaskbarProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-center px-2">
      {/* Start Button */}
      <button
        onClick={onStartClick}
        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
        </svg>
      </button>

      {/* Search */}
      <div className="mx-2 flex items-center bg-white/10 rounded-full px-4 py-1.5 w-64">
        <Search className="w-4 h-4 text-white/60 mr-2" />
        <input 
          type="text" 
          placeholder="搜索" 
          className="bg-transparent text-white text-sm outline-none w-full placeholder-white/60"
        />
      </div>

      {/* Taskbar Icons */}
      <div className="flex items-center gap-1 mx-4">
        {windows.map(win => (
          <button
            key={win.id}
            onClick={() => onWindowClick(win.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              activeWindowId === win.id ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <div className={`w-1 h-1 rounded-full ${activeWindowId === win.id ? 'bg-blue-400' : 'bg-white/50'}`} />
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="absolute right-2 flex items-center gap-3 text-white">
        <Wifi className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <Battery className="w-4 h-4" />
        <div className="text-xs text-right">
          <div>{time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
          <div>{time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  )
}
