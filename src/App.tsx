import { useState } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import StartMenu from './components/StartMenu'
import Window from './components/Window'
import Terminal from './components/Terminal'
import FileExplorer from './components/FileExplorer'
import Settings from './components/Settings'
import { WindowState } from './types'

function App() {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  const openWindow = (type: string, title: string) => {
    const id = `${type}-${Date.now()}`
    const newWindow: WindowState = {
      id,
      type,
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1,
    }
    setWindows([...windows, newWindow])
    setActiveWindowId(id)
    setStartMenuOpen(false)
  }

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: true } : w))
  }

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
  }

  const focusWindow = (id: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0)
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w))
    setActiveWindowId(id)
  }

  const renderWindowContent = (type: string) => {
    switch (type) {
      case 'terminal': return <Terminal />
      case 'explorer': return <FileExplorer />
      case 'settings': return <Settings />
      default: return <div className="p-4">内容</div>
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Desktop onOpenWindow={openWindow} />
      
      {windows.map(win => (
        <Window
          key={win.id}
          window={win}
          isActive={activeWindowId === win.id}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => maximizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {renderWindowContent(win.type)}
        </Window>
      ))}

      <StartMenu 
        isOpen={startMenuOpen} 
        onClose={() => setStartMenuOpen(false)}
        onOpenWindow={openWindow}
      />
      
      <Taskbar 
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={focusWindow}
      />
    </div>
  )
}

export default App
