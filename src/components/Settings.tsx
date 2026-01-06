import { useState } from 'react'
import { 
  Wifi, Bluetooth, Monitor, Palette, Bell, Lock, User, 
  HardDrive, Battery, Info, ChevronRight, Search
} from 'lucide-react'

const settingsCategories = [
  { icon: Wifi, label: '网络和 Internet', desc: 'Wi-Fi、飞行模式、VPN' },
  { icon: Bluetooth, label: '蓝牙和设备', desc: '蓝牙、打印机、鼠标' },
  { icon: Monitor, label: '显示', desc: '亮度、夜间模式、显示器' },
  { icon: Palette, label: '个性化', desc: '背景、颜色、主题' },
  { icon: Bell, label: '通知', desc: '通知、免打扰' },
  { icon: Lock, label: '隐私和安全', desc: '位置、相机、麦克风' },
  { icon: User, label: '账户', desc: '你的账户、电子邮件' },
  { icon: HardDrive, label: '存储', desc: '存储空间、清理建议' },
  { icon: Battery, label: '电源', desc: '电池、睡眠、性能' },
  { icon: Info, label: '系统', desc: '关于、更新、恢复' },
]

export default function Settings() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="h-full bg-[#202020] flex">
      {/* Sidebar */}
      <div className="w-72 p-4 border-r border-white/10">
        {/* Search */}
        <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
          <Search className="w-4 h-4 text-white/50 mr-2" />
          <input 
            type="text" 
            placeholder="查找设置" 
            className="bg-transparent text-white text-sm outline-none w-full placeholder-white/50"
          />
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <div>
            <div className="text-white font-medium">用户</div>
            <div className="text-xs text-white/50">本地账户</div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-1">
          {settingsCategories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat.label)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                selectedCategory === cat.label 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="text-sm">{cat.label}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {selectedCategory ? (
          <div>
            <h1 className="text-2xl font-light text-white mb-6">{selectedCategory}</h1>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">示例设置项</div>
                    <div className="text-sm text-white/50">这是一个设置项的描述</div>
                  </div>
                  <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">另一个设置</div>
                    <div className="text-sm text-white/50">点击查看更多选项</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-light text-white mb-6">设置</h1>
            <div className="grid grid-cols-2 gap-4">
              {settingsCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat.label)}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-xl">
                    <cat.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white">{cat.label}</div>
                    <div className="text-xs text-white/50">{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
