import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Users, Gamepad2, Settings, Radio } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatPanelProps {
  toolboxOpen: boolean;
  onToggleToolbox: () => void;
}

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 1, sender: 'user', text: '左边那些桶里装的是什么？' },
  { id: 2, sender: 'bot', text: '看起来像是酒桶，但是也有可能装着武器，建议查验一下。' },
];

export default function ChatPanel({ toolboxOpen, onToggleToolbox }: ChatPanelProps) {
  const [messages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toolboxItems = [
    { icon: Camera, label: '拍照' },
    { icon: Users, label: '识别' },
    { icon: Gamepad2, label: '游戏' },
    { icon: Settings, label: '设置' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/70 backdrop-blur-xl border-t border-gray-200" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}>
      {/* Drag handle */}
      <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing">
        <div className="w-10 h-1 rounded-full bg-gray-300" />
      </div>
      <motion.div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2"
        layout
        transition={{ duration: 0.3 }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">🤖</span>
              </div>
            )}
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">我</span>
              </div>
            )}
            <div
              className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Radio size={16} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入文字，拍照，或者说话"
          className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm outline-none placeholder-gray-400"
        />
        <button
          onClick={onToggleToolbox}
          className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform ${
            toolboxOpen ? 'rotate-45' : ''
          }`}
        >
          <Plus size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Toolbox */}
      <AnimatePresence>
        {toolboxOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="grid grid-cols-4 gap-3 px-4 py-3">
              {toolboxItems.map((item, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 bg-white/50 active:bg-gray-100 transition-colors"
                >
                  <item.icon size={24} className="text-gray-600" />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
