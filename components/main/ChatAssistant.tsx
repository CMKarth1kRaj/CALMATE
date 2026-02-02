import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { chatWithAI } from '../../services/geminiService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatAssistant: React.FC = () => {
    const { userProfile, meals } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hey! I\'m your CALMATE nutrition buddy. How can I help you crush your goals today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim() || !userProfile) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const response = await chatWithAI(newMessages, userProfile, meals);
            setMessages([...newMessages, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: "Sorry, I hit a snag. Try again?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-32 md:bottom-12 right-6 md:right-12 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-6 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-card-custom backdrop-blur-3xl rounded-[3rem] border border-border-custom shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                    {/* Header */}
                    <div className="p-8 bg-primary/10 border-b border-border-custom flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl shadow-lg">🤖</div>
                            <div>
                                <h3 className="text-primary-custom font-black uppercase italic tracking-wider leading-none">C-AI Buddy</h3>
                                <p className="text-[10px] text-secondary-custom font-bold uppercase tracking-widest mt-1">Always Active</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-black/20 rounded-full transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                            >
                                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-app border border-border-custom text-primary-custom rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-app border border-border-custom p-4 rounded-[1.5rem] rounded-tl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-app/50 border-t border-border-custom">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your diet..."
                                className="w-full bg-card-custom border border-border-custom rounded-full py-5 px-8 pr-16 text-primary-custom text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-secondary-custom/50 shadow-inner italic"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                <span className="text-lg">➔</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group ${isOpen ? 'bg-secondary-custom rotate-45' : 'bg-[#CCFF00] rotate-0'
                    }`}
            >
                {isOpen ? (
                    <span className="text-4xl text-black">×</span>
                ) : (
                    <div className="relative">
                        <span className="text-4xl">🤖</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-[#CCFF00] animate-pulse"></div>
                    </div>
                )}

                {/* Notification Badge if closed */}
                {!isOpen && (
                    <span className="absolute -top-4 -left-4 bg-black text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl italic whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Ask Me Anything
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatAssistant;
