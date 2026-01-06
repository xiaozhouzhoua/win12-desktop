import { ReactNode, useState, useRef, useEffect } from 'react'
import { X, Minus, Square, Copy } from 'lucide-react'
import { WindowState } from '../types'

interface WindowProps {
  window: WindowState
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  children: ReactNode
}

export default function Window({ window: win, isActive, onClose, onMinimize, onMaximize, onFocus, children }: WindowProps) {
  const [position, setPosition] = useState({ x: 100 + Math.random() * 200, y: 50 + Math.random() * 100 })
  const [size, setSize] = useState({ width: 800, height: 500 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: Math.max(0, e.clientY - dragOffset.current.y)
        })
      }
      if (isResizing) {
        setSize({
          width: Math.max(400, resizeStart.current.width + (e.clientX - resizeStart.current.x)),
          height: Math.max(300, resizeStart.current.height + (e.clientY - resizeStart.current.y))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing])

  if (win.isMinimized) return null

  const handleDragStart = (e: React.MouseEvent) => {
    if (win.isMaximized) return
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    setIsDragging(true)
    onFocus()
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (win.isMaximized) return
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height }
    setIsResizing(true)
  }

  const windowStyle = win.isMaximized
    ? { top: 0, left: 0, right: 0, bottom: 48, width: '100%', height: 'calc(100% - 48px)' }
    : { top: position.y, left: position.x, width: size.width, height: size.height }

  return (
    <div
      className={`absolute bg-black/70 backdrop-blur-2xl rounded-xl overflow-hidden border transition-shadow ${
        isActive ? 'border-white/20 shadow-2xl' : 'border-white/10 shadow-lg'
      }`}
      style={{ ...windowStyle, zIndex: win.zIndex }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="h-10 flex items-center justify-between px-4 bg-black/30 cursor-move"
        onMouseDown={handleDragStart}
        onDoubleClick={onMaximize}
      >
        <span className="text-white text-sm font-medium">{win.title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onMaximize}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
          >
            {win.isMaximized ? <Copy className="w-3.5 h-3.5 text-white" /> : <Square className="w-3.5 h-3.5 text-white" />}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-500 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  )
}
