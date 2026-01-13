import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from "@google/genai";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'Neural link established. I am NeuroCell. How can I assist with your biological data analysis today?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef(createChatSession());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const responseStream = await chatSession.current.sendMessageStream(userMessage.text);
      
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '', isStreaming: true }]);

      let fullText = '';
      
      for await (const chunk of responseStream) {
        const contentChunk = chunk as GenerateContentResponse;
        const text = contentChunk.text || '';
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: fullText } : msg
        ));
      }

      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: 'Error: Neural pathway interrupted. Please retry.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-glass-bg backdrop-blur-md rounded-2xl border border-glass-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-glass-border bg-black/20 flex items-center justify-between">
        <h2 className="text-bio-green font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-bio-green rounded-full animate-pulse"></span>
          AI_ASSISTANT: CONNECTED
        </h2>
        <span className="text-xs text-gray-500 font-mono">GEMINI-3-PRO-PREVIEW</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl text-sm font-mono leading-relaxed relative ${
                msg.role === 'user' 
                  ? 'bg-bio-cyan/10 border border-bio-cyan/30 text-gray-100 rounded-tr-none' 
                  : 'bg-black/40 border border-white/10 text-gray-300 rounded-tl-none'
              }`}
            >
              {msg.role === 'model' && (
                <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-black border border-bio-purple flex items-center justify-center">
                  <div className="w-2 h-2 bg-bio-purple rounded-full"></div>
                </div>
              )}
              {msg.text}
              {msg.isStreaming && <span className="inline-block w-2 h-4 bg-bio-purple ml-1 animate-pulse align-middle"></span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/20 border-t border-glass-border">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input query for neural processing..."
            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-bio-cyan/50 focus:ring-1 focus:ring-bio-cyan/20 transition-all placeholder-gray-600"
          />
          <button 
            type="submit" 
            disabled={isProcessing || !input.trim()}
            className="px-6 py-2 bg-bio-green/10 text-bio-green border border-bio-green/30 rounded-xl hover:bg-bio-green/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono uppercase text-xs tracking-wider"
          >
            Transmit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
