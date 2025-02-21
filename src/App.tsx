import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import ChatContainer from "./components/ChatContainer";
import { Message, StateUpdate } from "./types";
import { useWebSocket } from "./hooks/useWebSocket";
import "./styles/App.css";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socket, isConnected, sessionId } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as StateUpdate;
        
        const newMessage: Message = {
          agent: data.agent,
          phase: data.phase,
          message: data.message,
          agentUsage: data.agent_usage,
          nextAgent: data.next_agent,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMessage]);
      };
    }
  }, [socket]);

  return (
    <div className="container">
      <h1>아이디어 생성 시스템</h1>
      
      {!isConnected && (
        <div className="warning">
          서버에 연결 중...
        </div>
      )}
      
      <TaskForm 
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setMessages={setMessages}
        sessionId={sessionId}
      />

      {isLoading && (
        <div className="loading">처리 중...</div>
      )}
      
      <ChatContainer messages={messages} />
    </div>
  );
}

export default App;