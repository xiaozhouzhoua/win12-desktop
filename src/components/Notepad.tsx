import { useState, useEffect } from 'react'
import { Save, FileText } from 'lucide-react'

const STORAGE_KEY = 'win12-notepad-content'

export default function Notepad() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || ''
  })
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    setSaved(false)
  }, [content])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, content)
    setSaved(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/10">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1 text-sm text-white/80 hover:bg-white/10 rounded transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
        <span className="text-xs text-white/40">
          {saved ? '已保存' : '未保存'} · Ctrl+S
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="开始输入..."
        className="flex-1 w-full p-4 bg-transparent text-white text-sm resize-none outline-none font-mono placeholder-white/30"
        spellCheck={false}
      />
    </div>
  )
}
