import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Hash, Users, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  room: string;
  author: string;
  text: string;
  timestamp: number;
}

const ROOMS = ['general', 'games', 'study-hall'] as const;

export const MessagingView: React.FC = () => {
  const [room, setRoom] = useState<(typeof ROOMS)[number]>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [username, setUsername] = useState(
    () => localStorage.getItem('calc67_user') || `user_${Math.floor(100 + Math.random() * 900)}`
  );
  const [onlineCount, setOnlineCount] = useState(1);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = useCallback(async (targetRoom: string) => {
    try {
      const res = await fetch(`/api/messages?room=${encodeURIComponent(targetRoom)}`);
      const data = (await res.json()) as { messages: ChatMessage[] };
      setMessages(data.messages ?? []);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    fetchMessages(room);
  }, [room, fetchMessages]);

  useEffect(() => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${proto}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string) as
          | { type: 'presence'; count: number }
          | { type: 'chat:message'; message: ChatMessage };

        if (payload.type === 'presence') {
          setOnlineCount(payload.count);
        } else if (payload.type === 'chat:message' && payload.message.room === room) {
          setMessages((prev) =>
            prev.some((m) => m.id === payload.message.id)
              ? prev
              : [...prev, payload.message]
          );
        }
      } catch {
        // Ignore malformed packets
      }
    };

    return () => ws.close();
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room, author: username, text }),
      });
      if (res.ok) {
        const data = (await res.json()) as { message: ChatMessage };
        setMessages((prev) =>
          prev.some((m) => m.id === data.message.id) ? prev : [...prev, data.message]
        );
        setDraft('');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar Rooms */}
      <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Channels
          </div>
          <div className="space-y-1">
            {ROOMS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoom(r)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  room === r
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Hash className="w-4 h-4 shrink-0" />
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-800 space-y-2.5">
          <label className="text-xs text-zinc-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            Handle
          </label>
          <input
            type="text"
            value={username}
            maxLength={24}
            onChange={(e) => {
              setUsername(e.target.value);
              localStorage.setItem('calc67_user', e.target.value);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{onlineCount} connected</span>
          </div>
        </div>
      </div>

      {/* Chat Stream */}
      <div className="lg:col-span-9 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm text-zinc-100">
            <Hash className="w-4 h-4 text-emerald-400" />
            {room}
          </div>
          <span className="text-xs text-zinc-500">Live WebSocket Room</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((msg) => {
            const isSystem = msg.author === 'system';
            const isSelf = msg.author === username;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold ${
                      isSystem
                        ? 'text-amber-400'
                        : isSelf
                          ? 'text-emerald-400'
                          : 'text-zinc-300'
                    }`}
                  >
                    {msg.author}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-mono-num">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`px-3.5 py-2 rounded-2xl text-sm max-w-[85%] break-words ${
                    isSystem
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                      : isSelf
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-800 text-zinc-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-3.5 border-t border-zinc-800 bg-zinc-950/50 flex gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message #${room}...`}
            maxLength={500}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-medium inline-flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
