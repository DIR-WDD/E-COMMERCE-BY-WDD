import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

interface AiShoppingAssistantProps {
  products: Product[];
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AiShoppingAssistant: React.FC<AiShoppingAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: 'Hi! I\'m your Nexus AI assistant. Ask me about our products, bulk pricing, or compatibility!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct context from products
      const productContext = products.map(p => 
        `- ${p.name} (SKU: ${p.sku}): $${p.price} (B2B: $${p.b2bPrice}). ${p.description}. Stock: ${p.stock}`
      ).join('\n');

      const systemInstruction = `You are a helpful sales assistant for Nexus Commerce (B2B & B2C Platform). 
      Use the following product catalog to answer questions:
      ${productContext}
      
      Rules:
      1. Be concise, professional, and helpful.
      2. If asked about prices, mention both standard and B2B/wholesale pricing if the user seems interested in bulk.
      3. If a product isn't listed, politely say we don't carry it.
      4. Highlight stock levels if low.`;

      // Build history for the API
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: 'user', parts: [{ text: input }]}],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const text = response.text || "I'm having trouble connecting right now. Please try again.";
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I encountered an error. Please check your API key configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-brand-500/25 ${isOpen ? 'hidden' : 'bg-brand-600 text-white'}`}
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-fade-in-up ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-brand-900 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Nexus Assistant</h3>
                <p className="text-xs text-brand-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online • Gemini 2.5
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-md shadow-brand-500/10' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-500 shadow-sm border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center h-10">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-2 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about products..."
                className="flex-1 bg-transparent border-none px-3 text-sm focus:ring-0 outline-none placeholder:text-slate-400 text-slate-700"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiShoppingAssistant;