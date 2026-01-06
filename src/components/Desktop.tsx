import { Monitor, FolderOpen, Settings, Terminal, LayoutGrid, FileText } from 'lucide-react'
import { CalendarWidget, MusicWidget, ClockWidget, WeatherWidget, SystemMonitorWidget, TodoWidget } from './Widgets'
import { useState, useRef } from 'react'

interface DesktopProps {
  onOpenWindow: (type: string, title: string) => void
}

const desktopIcons = [
  { id: 'explorer', icon: FolderOpen, label: '文件资源管理器', type: 'explorer' },
  { id: 'terminal', icon: Terminal, label: '终端', type: 'terminal' },
  { id: 'notepad', icon: FileText, label: '记事本', type: 'notepad' },
  { id: 'settings', icon: Settings, label: '设置', type: 'settings' },
  { id: 'pc', icon: Monitor, label: '此电脑', type: 'thispc' },
]

const availableWidgets = [
  { id: 'clock', name: '时钟', component: ClockWidget },
  { id: 'weather', name: '天气', component: WeatherWidget },
  { id: 'calendar', name: '日历', component: CalendarWidget },
  { id: 'music', name: '音乐', component: MusicWidget },
  { id: 'monitor', name: '系统监控', component: SystemMonitorWidget },
  { id: 'todo', name: '待办事项', component: TodoWidget },
]

interface WidgetPosition {
  x: number
  y: number
}

interface WidgetSize {
  width: number
  height: number
}

const defaultSizes: Record<string, WidgetSize> = {
  clock: { width: 288, height: 140 },
  weather: { width: 288, height: 160 },
  calendar: { width: 288, height: 320 },
  music: { width: 288, height: 300 },
  monitor: { width: 288, height: 160 },
  todo: { width: 288, height: 220 },
}

const defaultPositions: Record<string, WidgetPosition> = {
  clock: { x: window.innerWidth - 220, y: 20 },
  weather: { x: window.innerWidth - 220, y: 160 },
  calendar: { x: window.innerWidth - 320, y: 320 },
  music: { x: window.innerWidth - 320, y: 660 },
  monitor: { x: window.innerWidth - 270, y: 320 },
  todo: { x: window.innerWidth - 270, y: 480 },
}

const STORAGE_KEYS = {
  positions: 'win12-widget-positions',
  sizes: 'win12-widget-sizes',
  active: 'win12-active-widgets',
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export default function Desktop({ onOpenWindow }: DesktopProps) {
  const [showWidgetPanel, setShowWidgetPanel] = useState(false)
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => 
    loadFromStorage(STORAGE_KEYS.active, ['clock', 'weather', 'calendar', 'music'])
  )
  const [widgetPositions, setWidgetPositions] = useState<Record<string, WidgetPosition>>(() =>
    loadFromStorage(STORAGE_KEYS.positions, defaultPositions)
  )
  const [widgetSizes, setWidgetSizes] = useState<Record<string, WidgetSize>>(() =>
    loadFromStorage(STORAGE_KEYS.sizes, defaultSizes)
  )
  const [dragging, setDragging] = useState<string | null>(null)
  const [resizing, setResizing] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 })

  const toggleWidget = (id: string) => {
    setActiveWidgets(prev => {
      const newWidgets = prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
      localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(newWidgets))
      return newWidgets
    })
  }

  const removeWidget = (id: string) => {
    setActiveWidgets(prev => {
      const newWidgets = prev.filter(w => w !== id)
      localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(newWidgets))
      return newWidgets
    })
  }

  const handleMouseDown = (e: React.MouseEvent, widgetId: string) => {
    e.stopPropagation()
    const pos = widgetPositions[widgetId] || defaultPositions[widgetId] || { x: 100, y: 100 }
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    setDragging(widgetId)
  }

  const handleResizeStart = (e: React.MouseEvent, widgetId: string) => {
    e.stopPropagation()
    const size = widgetSizes[widgetId] || defaultSizes[widgetId] || { width: 200, height: 150 }
    resizeStart.current = { 
      width: size.width, 
      height: size.height, 
      mouseX: e.clientX, 
      mouseY: e.clientY 
    }
    setResizing(widgetId)
  }

  const SNAP_THRESHOLD = 15 // 吸附阈值

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      let newX = e.clientX - dragOffset.current.x
      let newY = e.clientY - dragOffset.current.y
      const currentSize = widgetSizes[dragging] || defaultSizes[dragging] || { width: 200, height: 150 }

      // 检查与其他小组件的对齐
      activeWidgets.forEach(widgetId => {
        if (widgetId === dragging) return
        const otherPos = widgetPositions[widgetId] || defaultPositions[widgetId]
        const otherSize = widgetSizes[widgetId] || defaultSizes[widgetId]
        if (!otherPos || !otherSize) return

        // 左边对齐
        if (Math.abs(newX - otherPos.x) < SNAP_THRESHOLD) newX = otherPos.x
        // 右边对齐
        if (Math.abs(newX + currentSize.width - (otherPos.x + otherSize.width)) < SNAP_THRESHOLD) {
          newX = otherPos.x + otherSize.width - currentSize.width
        }
        // 左边对齐到其他右边
        if (Math.abs(newX - (otherPos.x + otherSize.width + 10)) < SNAP_THRESHOLD) {
          newX = otherPos.x + otherSize.width + 10
        }
        // 右边对齐到其他左边
        if (Math.abs(newX + currentSize.width + 10 - otherPos.x) < SNAP_THRESHOLD) {
          newX = otherPos.x - currentSize.width - 10
        }
        // 顶部对齐
        if (Math.abs(newY - otherPos.y) < SNAP_THRESHOLD) newY = otherPos.y
        // 底部对齐
        if (Math.abs(newY + currentSize.height - (otherPos.y + otherSize.height)) < SNAP_THRESHOLD) {
          newY = otherPos.y + otherSize.height - currentSize.height
        }
        // 顶部对齐到其他底部
        if (Math.abs(newY - (otherPos.y + otherSize.height + 10)) < SNAP_THRESHOLD) {
          newY = otherPos.y + otherSize.height + 10
        }
      })

      setWidgetPositions(prev => ({
        ...prev,
        [dragging]: {
          x: Math.max(0, Math.min(window.innerWidth - 100, newX)),
          y: Math.max(0, Math.min(window.innerHeight - 100, newY)),
        }
      }))
    }
    if (resizing) {
      const deltaX = e.clientX - resizeStart.current.mouseX
      const deltaY = e.clientY - resizeStart.current.mouseY
      setWidgetSizes(prev => ({
        ...prev,
        [resizing]: {
          width: Math.max(150, resizeStart.current.width + deltaX),
          height: Math.max(100, resizeStart.current.height + deltaY),
        }
      }))
    }
  }

  const handleMouseUp = () => {
    if (dragging) {
      localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(widgetPositions))
    }
    if (resizing) {
      localStorage.setItem(STORAGE_KEYS.sizes, JSON.stringify(widgetSizes))
    }
    setDragging(null)
    setResizing(null)
  }
  return (
    <div 
      className="absolute inset-0"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        background: `
          radial-gradient(ellipse 200% 100% at 50% 100%, #4a9c2d 0%, transparent 50%),
          radial-gradient(ellipse 150% 80% at 30% 90%, #6abf4a 0%, transparent 40%),
          radial-gradient(ellipse 180% 90% at 70% 95%, #5cb32b 0%, transparent 45%),
          radial-gradient(ellipse 120% 60% at 20% 85%, #7ec850 0%, transparent 35%),
          radial-gradient(ellipse 140% 70% at 80% 88%, #5cb32b 0%, transparent 40%),
          linear-gradient(to bottom, 
            #1a5fb4 0%, 
            #3584e4 25%, 
            #62a0ea 40%, 
            #99c1f1 55%,
            #7ec850 55%,
            #5cb32b 100%
          )
        `,
      }}
    >
      <div className="p-4 grid grid-cols-1 gap-2 w-24">
        {desktopIcons.map(item => (
          <button
            key={item.id}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors group"
            onClick={() => onOpenWindow(item.type, item.label)}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-black/30 rounded-xl backdrop-blur-md group-hover:bg-black/40 transition-colors">
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <span className="mt-1 text-xs text-white text-center drop-shadow-lg">
              {item.label}
            </span>
          </button>
        ))}
        
        {/* Widget Toggle Button */}
        <button
          className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors group mt-4"
          onClick={() => setShowWidgetPanel(!showWidgetPanel)}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-black/30 rounded-xl backdrop-blur-md group-hover:bg-black/40 transition-colors">
            <LayoutGrid className="w-7 h-7 text-white" />
          </div>
          <span className="mt-1 text-xs text-white text-center drop-shadow-lg">
            小组件
          </span>
        </button>
      </div>

      {/* Widget Selection Panel */}
      {showWidgetPanel && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowWidgetPanel(false)} />
          <div className="absolute left-28 top-4 w-64 bg-black/70 backdrop-blur-2xl rounded-xl border border-white/10 z-40 p-4">
            <div className="text-white font-medium mb-3">小组件</div>
            <div className="space-y-2">
              {availableWidgets.map(widget => (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeWidgets.includes(widget.id) 
                      ? 'bg-blue-500/30 text-white' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{widget.name}</span>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    activeWidgets.includes(widget.id) ? 'border-blue-400 bg-blue-500' : 'border-white/30'
                  }`}>
                    {activeWidgets.includes(widget.id) && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Desktop Widgets */}
      {availableWidgets.map(widget => {
        if (!activeWidgets.includes(widget.id)) return null
        const WidgetComponent = widget.component
        const pos = widgetPositions[widget.id] || { x: 100, y: 100 }
        const size = widgetSizes[widget.id] || defaultSizes[widget.id]
        return (
          <div
            key={widget.id}
            className={`absolute group ${dragging === widget.id ? 'cursor-grabbing z-50' : 'cursor-grab'} ${resizing === widget.id ? 'z-50' : ''}`}
            style={{ left: pos.x, top: pos.y, width: size.width, height: size.height }}
            onMouseDown={(e) => handleMouseDown(e, widget.id)}
          >
            <div className="w-full h-full">
              <WidgetComponent onClose={() => removeWidget(widget.id)} />
            </div>
            {/* Resize Handle - invisible but functional */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, widget.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
