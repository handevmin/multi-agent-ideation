import React, { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { ChatContainerProps, Message } from "../types";
import { getAgentDisplayName, getPhaseDisplayName } from "../utils/helpers";

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 마크다운에서 plaintext 형식 블록 제거
  const cleanMessage = (message: string) => {
    return message.replace(/```plaintext\s*/g, '').replace(/```\s*$/g, '');
  };

  return (
    <div className="chat-container">
      {messages.map((message: Message, index: number) => (
        <div key={index} className={`message ${message.agent}`}>
          <div className="message-header">
            <span className="agent-name">
              {getAgentDisplayName(message.agent)}
            </span>
            <span className="phase-badge">
              {getPhaseDisplayName(message.phase)}
            </span>
          </div>
          <div className="message-content">
            <ReactMarkdown>
              {cleanMessage(message.message)}
            </ReactMarkdown>
          </div>
          {message.progress !== null && message.progress !== undefined && (
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${(message.progress / 5) * 100}%` }}
              />
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatContainer;