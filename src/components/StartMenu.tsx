import { FolderOpen, Settings, Terminal, Chrome, Mail, Calendar, Calculator, Image, Music } from 'lucide-react'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenWindow: (type: string, title: string) => void
}

const pinnedApps = [
  { icon: Chrome, label: 'Edge', type: 'browser' },
  { icon: FolderOpen, label: '文件', type: 'explorer' },
  { icon: Terminal, label: '终端', type: 'terminal' },
  { icon: Settings, label: '设置', type: 'settings' },
  { icon: Mail, label: '邮件', type: 'mail' },
  { icon: Calendar, label: '日历', type: 'calendar' },
  { icon: Calculator, label: '计算器', type: 'calculator' },
  { icon: Image, label: '照片', type: 'photos' },
  { icon: Music, label: '音乐', type: 'music' },
]

export default function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[600px] bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Search */}
        <div className="p-6 pb-4">
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
            <input 
              type="text" 
              placeholder="搜索应用、设置和文档" 
              className="bg-transparent text-white text-sm outline-none w-full placeholder-white/60"
            />
          </div>
        </div>

        {/* Pinned Apps */}
        <div className="px-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-medium">已固定</span>
            <button className="text-xs text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/10">
              所有应用 &gt;
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {pinnedApps.map((app, i) => (
              <button
                key={i}
                onClick={() => onOpenWindow(app.type, app.label)}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <app.icon className="w-5 h-5 text-white" />
                </div>
                <span className="mt-2 text-xs text-white">{app.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-medium">推荐</span>
            <button className="text-xs text-white/60 hover:text-white px-3 py-1 rounded-md hover:bg-white/10">
              更多 &gt;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['最近文档.docx', '项目计划.xlsx', '演示文稿.pptx', '代码笔记.md'].map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white/60" />
                </div>
                <div>
                  <div className="text-sm text-white">{name}</div>
                  <div className="text-xs text-white/40">昨天</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User & Power */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
            <span className="text-white text-sm">用户</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <path fill="currentColor" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0119 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.47 1.28-4.64 3.22-5.89l-1.42-1.42A8.962 8.962 0 003 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.8-1.28-5.3-3.17-6.83z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
