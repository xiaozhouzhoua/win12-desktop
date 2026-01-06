import { useState, useEffect } from 'react'
import { Search, Wifi, Volume2, Cloud, Sun, CloudRain, Calendar, Newspaper, WifiOff, VolumeX, Volume1, Bell } from 'lucide-react'
import { WindowState } from '../types'

interface TaskbarProps {
  onStartClick: () => void
  windows: WindowState[]
  activeWindowId: string | null
  onWindowClick: (id: string) => void
}

// 模拟事件数据
const todayEvents = [
  { time: '09:00', title: '团队会议', type: 'meeting' },
  { time: '14:00', title: '项目评审', type: 'meeting' },
  { time: '16:30', title: '代码审查', type: 'task' },
]

const newsItems = [
  '科技巨头发布新一代AI助手',
  '全球开发者大会即将召开',
  '新编程语言受到广泛关注',
]

export default function Taskbar({ onStartClick, windows, activeWindowId, onWindowClick }: TaskbarProps) {
  const [time, setTime] = useState(new Date())
  const [showSearchPanel, setShowSearchPanel] = useState(false)
  const [showQuickSettings, setShowQuickSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [weather] = useState({ temp: 22, condition: 'sunny' })
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [volume, setVolume] = useState(75)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const WeatherIcon = weather.condition === 'sunny' ? Sun : weather.condition === 'rainy' ? CloudRain : Cloud
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-center px-2">
      {/* Start Button */}
      <button
        onClick={onStartClick}
        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#4FC3F7" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
        </svg>
      </button>

      {/* Search with Weather/Events */}
      <div className="relative mx-2">
        <button 
          onClick={() => setShowSearchPanel(!showSearchPanel)}
          className="flex items-center bg-white/10 rounded-full px-4 py-1.5 w-72 hover:bg-white/15 transition-colors"
        >
          <Search className="w-4 h-4 text-white/60 mr-2" />
          <span className="text-white/60 text-sm flex-1 text-left">搜索</span>
          <div className="flex items-center gap-2 border-l border-white/20 pl-3 ml-2">
            <WeatherIcon className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-xs">{weather.temp}°C</span>
          </div>
        </button>

        {/* Search Panel */}
        {showSearchPanel && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSearchPanel(false)} />
            <div className="absolute bottom-12 left-0 w-[480px] bg-black/80 backdrop-blur-2xl rounded-xl border border-white/10 z-50 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
                  <Search className="w-4 h-4 text-white/60 mr-2" />
                  <input 
                    type="text" 
                    placeholder="搜索应用、文档、网页等..." 
                    className="bg-transparent text-white text-sm outline-none w-full placeholder-white/60"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex">
                {/* Weather & Events */}
                <div className="flex-1 p-4 border-r border-white/10">
                  {/* Weather Card */}
                  <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white/60 text-xs">北京</div>
                        <div className="text-white text-3xl font-light">{weather.temp}°C</div>
                        <div className="text-white/80 text-sm">晴朗</div>
                      </div>
                      <Sun className="w-16 h-16 text-yellow-300" />
                    </div>
                  </div>

                  {/* Today's Events */}
                  <div>
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                      <Calendar className="w-3 h-3" />
                      今日日程
                    </div>
                    <div className="space-y-2">
                      {todayEvents.map((event, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                          <div className="text-xs text-white/50 w-12">{event.time}</div>
                          <div className="w-1 h-6 bg-blue-400 rounded-full" />
                          <div className="text-sm text-white">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* News Feed */}
                <div className="w-48 p-4">
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                    <Newspaper className="w-3 h-3" />
                    热点资讯
                  </div>
                  <div className="space-y-3">
                    {newsItems.map((news, i) => (
                      <div key={i} className="text-xs text-white/80 hover:text-white cursor-pointer leading-relaxed">
                        {news}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
      <div className="absolute right-2 flex items-center gap-1 text-white">
        {/* Quick Settings Button */}
        <button 
          onClick={() => { setShowQuickSettings(!showQuickSettings); setShowNotifications(false) }}
          className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          {wifiEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-white/50" />}
          <VolumeIcon className="w-4 h-4" />
        </button>

        {/* Date/Time & Notifications */}
        <button 
          onClick={() => { setShowNotifications(!showNotifications); setShowQuickSettings(false) }}
          className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <div className="text-xs text-right">
            <div>{time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</div>
          </div>
          <Bell className="w-4 h-4" />
        </button>

        {/* Quick Settings Panel */}
        {showQuickSettings && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowQuickSettings(false)} />
            <div className="absolute bottom-12 right-0 w-80 bg-black/80 backdrop-blur-2xl rounded-xl border border-white/10 z-50 p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button 
                  onClick={() => setWifiEnabled(!wifiEnabled)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-colors ${wifiEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                >
                  <Wifi className="w-5 h-5 mb-1" />
                  <span className="text-xs">Wi-Fi</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-xl bg-blue-500">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mb-1" fill="currentColor">
                    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                  </svg>
                  <span className="text-xs">蓝牙</span>
                </button>
                <button className="flex flex-col items-center p-3 rounded-xl bg-white/10 hover:bg-white/20">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mb-1" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7a.996.996 0 111.41-1.41L10 14.17l6.88-6.88a.996.996 0 111.41 1.41l-7.59 7.59a.996.996 0 01-1.41 0z"/>
                  </svg>
                  <span className="text-xs">飞行模式</span>
                </button>
              </div>
              
              {/* Volume Slider */}
              <div className="flex items-center gap-3 p-2">
                <VolumeIcon className="w-4 h-4 text-white/60" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-xs text-white/60 w-8">{volume}%</span>
              </div>

              {/* Brightness Slider */}
              <div className="flex items-center gap-3 p-2">
                <Sun className="w-4 h-4 text-white/60" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="80"
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>
          </>
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute bottom-12 right-0 w-80 bg-black/80 backdrop-blur-2xl rounded-xl border border-white/10 z-50 overflow-hidden">
              {/* Calendar */}
              <div className="p-4 border-b border-white/10">
                <div className="text-lg text-white mb-2">
                  {time.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                </div>
              </div>
              
              {/* Notifications */}
              <div className="p-4">
                <div className="text-xs text-white/60 mb-3">通知</div>
                <div className="space-y-2">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-white">系统更新可用</div>
                    <div className="text-xs text-white/50 mt-1">点击查看详情</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-white">新邮件 (3)</div>
                    <div className="text-xs text-white/50 mt-1">来自工作邮箱</div>
                  </div>
                </div>
                <button className="w-full mt-3 text-xs text-white/60 hover:text-white py-2">
                  清除所有通知
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
