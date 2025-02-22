import React, { useEffect, useRef } from "react";
import { ChatContainerProps, Message } from "../types";
import { getAgentDisplayName, getPhaseDisplayName } from "../utils/helpers";

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (message: string) => {
    // 모든 마크다운 문법과 코드 블록 제거
    return message
      .replace(/```.*?\n/g, '')
      .replace(/```$/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/<\/?code>/g, '')
      .replace(/\*\*/g, '');  // 볼드체 제거
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
            {formatMessage(message.message)}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatContainer;