import { useState } from 'react'
import { Folder, File, ChevronRight, Home, HardDrive, Download, Image, Music, Film, FileText } from 'lucide-react'

interface FileItem {
  name: string
  type: 'folder' | 'file'
  icon?: React.ElementType
}

const sidebarItems = [
  { icon: Home, label: '主页', path: 'home' },
  { icon: HardDrive, label: '此电脑', path: 'thispc' },
  { icon: Download, label: '下载', path: 'downloads' },
  { icon: FileText, label: '文档', path: 'documents' },
  { icon: Image, label: '图片', path: 'pictures' },
  { icon: Music, label: '音乐', path: 'music' },
  { icon: Film, label: '视频', path: 'videos' },
  { icon: HardDrive, label: '本地磁盘 (C:)', path: 'c' },
]

const files: Record<string, FileItem[]> = {
  home: [
    { name: '桌面', type: 'folder' },
    { name: '文档', type: 'folder' },
    { name: '下载', type: 'folder' },
    { name: '图片', type: 'folder' },
    { name: '音乐', type: 'folder' },
    { name: '视频', type: 'folder' },
  ],
  downloads: [
    { name: 'setup.exe', type: 'file' },
    { name: 'document.pdf', type: 'file' },
    { name: 'image.png', type: 'file' },
    { name: 'archive.zip', type: 'file' },
  ],
  documents: [
    { name: '工作', type: 'folder' },
    { name: '个人', type: 'folder' },
    { name: '报告.docx', type: 'file' },
    { name: '预算.xlsx', type: 'file' },
  ],
  pictures: [
    { name: '截图', type: 'folder' },
    { name: '相机', type: 'folder' },
    { name: 'wallpaper.jpg', type: 'file' },
  ],
  music: [
    { name: '播放列表', type: 'folder' },
    { name: 'song.mp3', type: 'file' },
  ],
  videos: [
    { name: '电影', type: 'folder' },
    { name: 'video.mp4', type: 'file' },
  ],
  c: [
    { name: 'Program Files', type: 'folder' },
    { name: 'Users', type: 'folder' },
    { name: 'Windows', type: 'folder' },
  ],
}

const thisPCItems: FileItem[] = [
  { name: '桌面', type: 'folder' },
  { name: '文档', type: 'folder' },
  { name: '下载', type: 'folder' },
  { name: '图片', type: 'folder' },
  { name: '音乐', type: 'folder' },
  { name: '视频', type: 'folder' },
  { name: '本地磁盘 (C:)', type: 'folder', icon: HardDrive },
  { name: '本地磁盘 (D:)', type: 'folder', icon: HardDrive },
]

interface FileExplorerProps {
  showThisPC?: boolean
}

export default function FileExplorer({ showThisPC }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState(showThisPC ? 'thispc' : 'home')
  const currentFiles = currentPath === 'thispc' ? thisPCItems : (files[currentPath] || [])

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-52 bg-white/5 border-r border-white/10 p-2">
        {sidebarItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrentPath(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPath === item.path ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 flex items-center gap-2 px-4 border-b border-white/10">
          <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center bg-white/5 rounded-lg px-3 py-1.5 mx-2">
            <span className="text-white/60 text-sm">{currentPath === 'home' ? '主页' : currentPath}</span>
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-6 gap-4">
            {currentFiles.map((file, i) => (
              <button
                key={i}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors group"
                onDoubleClick={() => file.type === 'folder' && setCurrentPath(file.name.toLowerCase())}
              >
                {file.type === 'folder' ? (
                  <Folder className="w-12 h-12 text-yellow-400" fill="currentColor" />
                ) : (
                  <File className="w-12 h-12 text-white/60" />
                )}
                <span className="mt-2 text-xs text-white text-center truncate w-full">
                  {file.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-8 flex items-center px-4 border-t border-white/10 text-xs text-white/50">
          {currentFiles.length} 个项目
        </div>
      </div>
    </div>
  )
}
