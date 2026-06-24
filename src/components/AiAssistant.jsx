import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Command, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your AI Glossary Assistant. Type any component or technical term to find its meaning." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const searchMeaning = async (rawQuery) => {
    // Clean basic punctuation for the dictionary search
    const cleanWord = rawQuery.replace(/[?!.]/g, '').trim();

    try {
      // 1. Try Dictionary API if it seems like a single keyword
      if (!cleanWord.includes(' ')) {
        const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
        const data = dictRes.data[0];
        const meaning = data.meanings[0].definitions[0].definition;
        return `**${data.word}** (${data.meanings[0].partOfSpeech}): ${meaning}`;
      }
      throw new Error("Multi-word query, fallback to Wikipedia Search");
    } catch (dictError) {
      // 2. Fallback to Wikipedia Search API to handle natural language queries
      try {
        // First, search Wikipedia for the closest matching article title
        const searchRes = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(rawQuery)}&utf8=&format=json&origin=*`);
        
        if (searchRes.data?.query?.search?.length > 0) {
          const bestMatchTitle = searchRes.data.query.search[0].title;
          
          // Then fetch the actual summary for that article
          const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatchTitle)}`);
          if (wikiRes.data && wikiRes.data.extract) {
            return `**${wikiRes.data.title}**: ${wikiRes.data.extract}`;
          }
        }
        throw new Error('Not found');
      } catch (wikiError) {
        return `I'm sorry, I couldn't find a clear definition for "${rawQuery}". Try typing just the specific keyword you are looking for (like "rotor" or "motor").`;
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
    setIsTyping(true);

    const answer = await searchMeaning(userMessage);

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 right-8 z-50 p-3 lg:p-4 rounded-full bg-gradient-to-r from-primary to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all hover:scale-110 flex items-center justify-center text-white"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Slide-out Panel Layer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 right-6 w-80 md:w-96 h-[600px] max-h-[75vh] z-40 flex flex-col glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl text-primary">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-white text-lg">AI Glossary</h3>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5 shadow-inner'}`}>
                    {/* Minimal markdown-like bolding support */}
                    {msg.text.split('**').map((chunk, i) => (
                      i % 2 === 1 ? <strong key={i} className="text-white">{chunk}</strong> : chunk
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-gray-400 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/5">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                  <Command size={18} />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask for a definition..."
                  className="w-full bg-white/5 text-white pl-10 pr-12 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 flex-shrink-0 focus:ring-primary/50 placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-2 p-1.5 bg-primary hover:bg-indigo-500 rounded-lg text-white transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
