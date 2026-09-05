import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  RefreshCw,
  FolderGit2,
  Trash2,
  Cpu,
  Layers,
  HelpCircle,
} from "lucide-react";
import { ProjectIdea, ChatMessage } from "../types";
import { useProject } from "../context/ProjectContext";
import { sendMentorMessageAPI } from "../services/api";

interface MentorChatPageProps {
  initialProject?: ProjectIdea | null;
}

const DEFAULT_SUGGESTIONS = [
  "How should our team divide modules between 3 members?",
  "Which database should we use: PostgreSQL, MongoDB, or Firebase?",
  "What free APIs and hosting tiers can we use to keep costs zero?",
  "How can we add Gemini AI features to this project effectively?",
  "What difficult questions will the external viva examiner ask?",
  "How do we structure our dissertation report according to IEEE standards?",
];

export const MentorChatPage: React.FC<MentorChatPageProps> = ({ initialProject }) => {
  const { savedProjects, selectedProject, setSelectedProject } = useProject();
  const currentProject = initialProject || selectedProject;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        text: `Hello! I am your Senior Project Mentor and Faculty Guide. ${
          currentProject
            ? `I have reviewed your capstone project proposal for **${currentProject.title}** (${currentProject.estimatedDuration}, ${currentProject.difficultyLevel} level).`
            : "I am here to advise you on college final-year engineering projects, architecture design, and viva defense."
        }
        
How can I assist your engineering team today? You can ask about database choices, team workload division, API integrations, or viva defense questions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const replyText = await sendMentorMessageAPI(query, currentProject, historyPayload);

      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        text:
          "I encountered a temporary connection issue. Please ensure your backend is accessible and retry your question.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "msg-reset",
        role: "assistant",
        text: `Chat session reset. I am ready to advise you on **${
          currentProject?.title || "your college project"
        }**. What's on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div id="mentor-chat-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Active Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                AI Project Mentor & Viva Advisor
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Context-aware guidance for architecture, team division, and oral defense
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Context:
          </span>
          <select
            id="mentor-project-context-select"
            value={currentProject?.id || ""}
            onChange={(e) => {
              const proj = savedProjects.find((p) => p.id === e.target.value);
              if (proj) setSelectedProject(proj);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 max-w-[220px] truncate focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {currentProject && !savedProjects.some((p) => p.id === currentProject.id) && (
              <option value={currentProject.id}>{currentProject.title}</option>
            )}
            {savedProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
            <option value="">-- General College Advice --</option>
          </select>

          <button
            id="clear-chat-btn"
            onClick={handleClearChat}
            title="Clear Chat"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Project Ribbon if selected */}
      {currentProject && (
        <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
              {currentProject.title}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300">{currentProject.difficultyLevel}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300">{currentProject.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-1">
            {currentProject.techStack?.slice(0, 3).map((t, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Conversation Container */}
      <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      : "bg-indigo-600 text-white shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-70 border-t border-black/5 dark:border-white/5 pt-1">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="hover:opacity-100 transition-opacity flex items-center space-x-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Mentor is drafting advice & architecture suggestions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {DEFAULT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => handleSendMessage(s)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              id="mentor-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your mentor (e.g., 'How to split backend and frontend roles for 3 students?')..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              id="send-mentor-msg-btn"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
