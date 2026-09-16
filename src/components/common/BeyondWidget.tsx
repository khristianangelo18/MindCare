import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, AlertTriangle, Sparkles, Heart } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'beyond';
  text: string;
  timestamp: string;
  isCrisis?: boolean;
}

const CRISIS_KEYWORDS = ['hurt myself', 'end it all', 'kill myself', 'suicide', 'want to die', 'end my life'];

export const BeyondWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'beyond',
      text: "Hi there! I'm Beyond, your companion at MindCare. Whether you're feeling overwhelmed, looking for guidance, or simply want someone to listen—I'm here with you. What's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const lower = trimmed.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(word => lower.includes(word));

    if (isCrisis) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'beyond',
            isCrisis: true,
            text: "I am really concerned about what you are going through. You don't have to face this alone. Please reach out for immediate help: Call or text 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. There are people available 24/7 who care and want to support you.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }

    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (geminiKey && geminiKey.length > 5) {
      try {
        const prompt = `You are 'Beyond', a warm and deeply empathetic AI mental health companion for the MindCare platform.
CRITICAL PRINCIPLES:
1. Always acknowledge what the user just said first with emotional validation ('I hear you', 'That sounds really heavy', 'That must feel overwhelming').
2. Do not use robotic greetings or menus. Keep responses concise (2-4 sentences), warm, conversational, and avoid emojis.
3. If they ask about services: we offer confidential self-assessments, specialist bookings, and personalized recommendations.
User message: "${trimmed}"`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            setMessages(prev => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                sender: 'beyond',
                text: replyText.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini API call error, falling back to local empathy engine:', err);
      }
    }

    // Built-in Empathy Fallback Engine (from beyond_api.php)
    setTimeout(() => {
      let reply = "I'm here to listen and help however I can. Whether you want to talk about what's weighing on you, explore booking an appointment, or take our assessment—take all the time you need.";

      if (lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) {
        reply = "You can book a session anytime by heading to the 'Book Appointment' page in your sidebar. You'll be able to view each specialist's credentials, choose a date that suits your schedule, and reserve your time slot.";
      } else if (lower.includes('specialist') || lower.includes('therapist') || lower.includes('doctor')) {
        reply = "Our specialists are certified psychologists and psychiatrists who guide individuals through stress, anxiety, burnout, relationships, and depression. You can browse their profiles under Book Appointment.";
      } else if (lower.includes('assessment') || lower.includes('test') || lower.includes('quiz')) {
        reply = "Our mental health assessments take just a few minutes to complete and help provide insight into your emotional well-being. Head over to the Assessment tab to begin.";
      } else if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('panic') || lower.includes('stressed')) {
        reply = "It sounds like you're carrying a heavy burden right now. When anxiety flares up, it can feel so physically tightening. Let's take a slow breath together. Would you like to talk about what's triggering this feeling?";
      } else if (lower.includes('sad') || lower.includes('depressed') || lower.includes('down') || lower.includes('tired')) {
        reply = "I hear you, and I want to honor how exhausting that feels. Please remember that it's okay to not be okay today. Is there something in particular that's been weighing on your heart?";
      } else if (lower.includes('thank') || lower.includes('thanks')) {
        reply = "You're always welcome. Remember that prioritizing your mental health is a brave and meaningful step. I'm right here whenever you need.";
      } else if (/^(hi|hello|hey|good morning|good evening)/i.test(lower)) {
        reply = "Hello! I'm glad you're here. How are you holding up today?";
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'beyond',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white rounded-full shadow-lg hover:shadow-teal-500/30 flex items-center justify-center transition-all duration-300 transform hover:scale-105 z-50 group"
        aria-label="Open Beyond AI Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] sm:w-[390px] h-[540px] max-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-base">Beyond AI</h3>
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                </div>
                <p className="text-xs text-teal-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block"></span>
                  Empathetic Companion
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-zinc-950/40">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                      : msg.isCrisis
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-bl-none'
                      : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700/50'
                  }`}
                >
                  {msg.isCrisis && (
                    <div className="flex items-center gap-1.5 mb-1 font-semibold text-rose-600 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Crisis Support Notice</span>
                    </div>
                  )}
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-zinc-700/50 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-1.5 overflow-x-auto text-xs whitespace-nowrap no-scrollbar">
            <button
              onClick={() => { setInput('How do I book an appointment?'); }}
              className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
            >
              📅 Book session
            </button>
            <button
              onClick={() => { setInput('Tell me about your specialists'); }}
              className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
            >
              👩‍⚕️ Specialists
            </button>
            <button
              onClick={() => { setInput('I am feeling anxious today'); }}
              className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
            >
              🌿 I feel anxious
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Beyond anything..."
              className="flex-1 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white rounded-xl transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
