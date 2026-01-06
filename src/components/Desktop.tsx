import { Monitor, FolderOpen, Settings, Terminal } from 'lucide-react'

interface DesktopProps {
  onOpenWindow: (type: string, title: string) => void
}

const desktopIcons = [
  { id: 'explorer', icon: FolderOpen, label: '文件资源管理器', type: 'explorer' },
  { id: 'terminal', icon: Terminal, label: '终端', type: 'terminal' },
  { id: 'settings', icon: Settings, label: '设置', type: 'settings' },
  { id: 'pc', icon: Monitor, label: '此电脑', type: 'explorer' },
]

export default function Desktop({ onOpenWindow }: DesktopProps) {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="p-4 grid grid-cols-1 gap-2 w-24">
        {desktopIcons.map(item => (
          <button
            key={item.id}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors group"
            onDoubleClick={() => onOpenWindow(item.type, item.label)}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <span className="mt-1 text-xs text-white text-center drop-shadow-lg">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
