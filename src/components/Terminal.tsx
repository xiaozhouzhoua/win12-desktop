import { useState, useRef, useEffect } from 'react'

interface HistoryItem {
  command: string
  output: string
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { command: '', output: 'Last login: ' + new Date().toLocaleString() + ' on ttys000' }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
  }, [history])

  const executeCommand = (cmd: string) => {
    let output = ''
    const args = cmd.trim().split(' ')
    const command = args[0].toLowerCase()

    switch (command) {
      case '':
        break
      case 'help':
        output = `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  echo     - Print text
  date     - Show current date
  whoami   - Show current user
  pwd      - Print working directory
  ls       - List files
  cat      - Display file content
  neofetch - System information`
        break
      case 'clear':
        setHistory([])
        setCurrentInput('')
        return
      case 'echo':
        output = args.slice(1).join(' ')
        break
      case 'date':
        output = new Date().toString()
        break
      case 'whoami':
        output = 'user'
        break
      case 'pwd':
        output = '/Users/user'
        break
      case 'ls':
        output = 'Desktop    Documents  Downloads  Music      Pictures   Public'
        break
      case 'cat':
        output = args[1] ? `cat: ${args[1]}: No such file or directory` : 'usage: cat [file]'
        break
      case 'neofetch':
        output = `                    'c.          user@macbook
                 ,xNMM.          ----------------
               .OMMMMo           OS: macOS Sonoma
               OMMM0,            Host: MacBook Pro
     .;loddo:' loolloddol;.      Kernel: Darwin 23.0.0
   cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: 2 hours
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Shell: zsh
 XMMMMMMMMMMMMMMMMMMMMMMMX.      Terminal: Web Terminal
;MMMMMMMMMMMMMMMMMMMMMMMM:       CPU: Apple M2 Pro
:MMMMMMMMMMMMMMMMMMMMMMMM:       Memory: 16GB
.MMMMMMMMMMMMMMMMMMMMMMMMX.      
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.    
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk   
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.   
    kMMMMMMMMMMMMMMMMMMMMMMd     
     ;KMMMMMMMWXXWMMMMMMMk.      
       .coeli:.teleoc.`
        break
      default:
        output = `zsh: command not found: ${command}`
    }

    setHistory([...history, { command: cmd, output }])
    setCurrentInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
    }
  }

  return (
    <div 
      className="h-full text-white font-mono text-sm p-0 flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Content */}
      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        {history.map((item, i) => (
          <div key={i} className="mb-2">
            {item.command && (
              <div className="flex items-center gap-2">
                <span className="text-green-400">user@macbook</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$ {item.command}</span>
              </div>
            )}
            {item.output && (
              <pre className="text-gray-300 whitespace-pre-wrap mt-1">{item.output}</pre>
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">user@macbook</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white caret-white"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
