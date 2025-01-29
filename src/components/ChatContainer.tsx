import React, { useEffect, useRef } from "react";
import { ChatContainerProps, Message } from "../types";
import { getAgentDisplayName, getPhaseDisplayName } from "../utils/helpers";

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          <div className="message-content">{message.message}</div>
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