import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Loader, 
  TrendingUp, 
  Shield, 
  Zap,
  MessageCircle,
  Brain,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AgentMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  data?: any;
  actions?: string[];
  confidence?: number;
}

interface AIHederaAgentProps {
  userAddress?: string;
  currentProperty?: any;
  className?: string;
}

export const AIHederaAgent: React.FC<AIHederaAgentProps> = ({
  userAddress,
  currentProperty,
  className = ""
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'processing'>('offline');

  useEffect(() => {
    checkAgentHealth();
    // Add welcome message
    setMessages([{
      id: '1',
      type: 'agent',
      content: 'Hello! I\'m your AI Hedera agent. I can help you analyze properties, execute smart investments, and monitor the blockchain. How can I assist you today?',
      timestamp: new Date(),
      actions: ['analyze_property', 'check_portfolio', 'market_update']
    }]);
  }, []);

  const checkAgentHealth = async () => {
    try {
      const response = await fetch('/api/agent/health');
      const data = await response.json();
      setAgentStatus(data.data?.available ? 'online' : 'offline');
    } catch (error) {
      setAgentStatus('offline');
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setAgentStatus('processing');

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: {
            userAddress,
            currentProperty,
            userProfile: { experience: 'Intermediate' }
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const agentMessage: AgentMessage = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: data.data.message,
          timestamp: new Date(),
          data: data.data.data,
          actions: data.data.actions,
          confidence: data.data.confidence
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const errorMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAgentStatus('online');
    }
  };

  const executeAction = async (action: string) => {
    switch (action) {
      case 'analyze_property':
        if (currentProperty) {
          await sendMessage(`Analyze this property: ${currentProperty.name || 'Current Property'}`);
        } else {
          await sendMessage('I need property information to analyze. Please provide property details.');
        }
        break;
      case 'check_portfolio':
        await sendMessage('Show me my portfolio status');
        break;
      case 'market_update':
        await sendMessage('Give me a market update');
        break;
      case 'contract_status':
        await sendMessage('Check smart contract status');
        break;
      default:
        await sendMessage(action.replace('_', ' '));
    }
  };

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'online': return 'text-emerald-400';
      case 'processing': return 'text-amber-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (agentStatus) {
      case 'online': return <CheckCircle className="h-3 w-3" />;
      case 'processing': return <Loader className="h-3 w-3 animate-spin" />;
      case 'offline': return <AlertCircle className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={agentStatus === 'processing' ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: agentStatus === 'processing' ? Infinity : 0, ease: "linear" }}
            className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg"
          >
            <Bot className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>AI Hedera Agent</span>
              <Brain className="h-5 w-5 text-purple-400" />
            </h2>
            <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="capitalize">{agentStatus}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Shield className="h-3 w-3" />
            <span>Hedera Secured</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-200 border border-white/20'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* Confidence indicator for agent messages */}
                {message.type === 'agent' && message.confidence && (
                  <div className="mt-2 flex items-center space-x-1 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                  </div>
                )}
                
                {/* Action buttons */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.slice(0, 3).map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeAction(action)}
                        className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/30 transition-colors"
                      >
                        {action.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin text-blue-400" />
                <span className="text-sm text-gray-300">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
              placeholder="Ask me about properties, investments, or blockchain..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              disabled={isLoading || agentStatus === 'offline'}
            />
            <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <motion.button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading || agentStatus === 'offline'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </motion.button>
        </div>
        
        {/* Quick actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['analyze_property', 'check_portfolio', 'market_update', 'contract_status'].map((action) => (
            <button
              key={action}
              onClick={() => executeAction(action)}
              disabled={isLoading || agentStatus === 'offline'}
              className="px-3 py-1 text-xs bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <Zap className="h-3 w-3 inline mr-1" />
              {action.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};