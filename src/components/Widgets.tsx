import { useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Calendar, Clock, Cloud, Sun, X } from 'lucide-react'

// 简单的农历转换（模拟数据）
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

function getLunarDate() {
  const day = new Date().getDate()
  return `${lunarMonths[11]}月${lunarDays[day - 1]}`
}

// 日历组件
interface WidgetProps {
  onClose?: () => void
  style?: React.CSSProperties
}

export function CalendarWidget({ onClose }: WidgetProps) {
  const [currentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = currentDate.getDate()
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="w-full h-full min-w-[200px] min-h-[200px] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 relative group overflow-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white text-lg font-medium">
            {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
          </div>
          <div className="text-white/60 text-sm flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            农历 {getLunarDate()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-white/50 py-1">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {days.map((day, i) => (
          <div
            key={i}
            className={`py-1.5 rounded-full ${
              day === today 
                ? 'bg-blue-500 text-white' 
                : day 
                  ? 'text-white hover:bg-white/10 cursor-pointer' 
                  : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

// 音乐播放器组件
export function MusicWidget({ onClose }: WidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [currentSong] = useState({
    title: '夜曲',
    artist: '周杰伦',
    album: '十一月的肖邦',
    duration: '3:45',
    current: '1:18',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80'
  })

  return (
    <div className="w-full h-full min-w-[250px] min-h-[250px] bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 relative group flex flex-col">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      {/* Album Art Background */}
      <div className="relative flex-1 min-h-[120px] rounded-t-2xl overflow-hidden">
        <img 
          src={currentSong.cover} 
          alt={currentSong.album}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Vinyl Record */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div 
              className={`w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} 
              style={{ animationDuration: '3s' }}
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.album}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="absolute inset-3 rounded-full border border-white/5" />
              <div className="absolute inset-5 rounded-full border border-white/5" />
            </div>
          </div>
        </div>

        {/* Song Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-white font-medium text-sm truncate">{currentSong.title}</div>
          <div className="text-white/70 text-xs truncate">{currentSong.artist} · {currentSong.album}</div>
        </div>
      </div>
      
      <div className="p-4 bg-black/20 rounded-b-2xl">
        {/* Progress */}
        <div className="group/progress">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1.5">
            <span>{currentSong.current}</span>
            <span>{currentSong.duration}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-95">
            <SkipBack className="w-4 h-4 text-white/80" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full hover:from-violet-400 hover:to-fuchsia-400 transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-95">
            <SkipForward className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </div>
    </div>
  )
}

// 时钟组件
export function ClockWidget({ onClose }: WidgetProps) {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full h-full min-w-[150px] min-h-[80px] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 relative group flex flex-col justify-center overflow-hidden">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
        <Clock className="w-3 h-3" />
        北京时间
      </div>
      <div className="text-white text-4xl font-light">
        {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-white/60 text-sm mt-1">
        {time.toLocaleDateString('zh-CN', { weekday: 'long' })}
      </div>
    </div>
  )
}

// 天气组件
export function WeatherWidget({ onClose }: WidgetProps) {
  return (
    <div className="w-full h-full min-w-[150px] min-h-[100px] bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 relative group flex flex-col justify-center">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/60 text-xs">北京</div>
          <div className="text-white text-3xl font-light">22°C</div>
          <div className="text-white/80 text-sm">晴朗</div>
        </div>
        <Sun className="w-12 h-12 text-yellow-300" />
      </div>
      <div className="flex justify-between mt-3 text-xs text-white/60">
        <span>最高 26°</span>
        <span>最低 18°</span>
      </div>
    </div>
  )
}


// 系统监控组件
export function SystemMonitorWidget({ onClose }: WidgetProps) {
  const [stats, setStats] = useState({
    cpu: 35,
    memory: 62,
    disk: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setStats({
        cpu: Math.min(100, Math.max(10, stats.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.min(100, Math.max(30, stats.memory + (Math.random() - 0.5) * 10)),
        disk: stats.disk + (Math.random() - 0.5) * 2,
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [stats])

  const CircleProgress = ({ value, color, label, size = 60 }: { value: number; color: string; label: string; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-medium">{Math.round(value)}%</span>
          </div>
        </div>
        <span className="text-white/60 text-xs mt-1">{label}</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-w-[200px] min-h-[120px] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 relative group">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      <div className="text-white/60 text-xs mb-3">系统监控</div>
      <div className="flex justify-around items-center">
        <CircleProgress value={stats.cpu} color="#60A5FA" label="CPU" />
        <CircleProgress value={stats.memory} color="#A78BFA" label="内存" />
        <CircleProgress value={stats.disk} color="#34D399" label="硬盘" />
      </div>
    </div>
  )
}


// 待办事项组件
const TODO_STORAGE_KEY = 'win12-todo-items'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

export function TodoWidget({ onClose }: WidgetProps) {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(TODO_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')

  const saveTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos)
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(newTodos))
  }

  const addTodo = () => {
    if (!input.trim()) return
    saveTodos([...todos, { id: Date.now(), text: input.trim(), done: false }])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id: number) => {
    saveTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="w-full h-full min-w-[200px] min-h-[150px] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 relative group flex flex-col">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
      <div className="text-white/60 text-xs mb-2">待办事项</div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加任务..."
          className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none placeholder-white/40"
        />
        <button
          onClick={addTodo}
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-auto space-y-1">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 group/item"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                todo.done ? 'border-green-400 bg-green-500' : 'border-white/30'
              }`}
            >
              {todo.done && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${todo.done ? 'text-white/40 line-through' : 'text-white'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="w-5 h-5 text-white/30 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="text-white/30 text-sm text-center py-4">暂无待办事项</div>
        )}
      </div>
    </div>
  )
}
