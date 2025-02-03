// App.tsx
import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import ChatContainer from "./components/ChatContainer";
import { Message, StateUpdate } from "./types";
import { useWebSocket } from "./hooks/useWebSocket";
import "./styles/App.css";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as StateUpdate;
        console.log('Received WebSocket data:', data); // 웹소켓으로 받은 데이터 로깅
        
        const newMessage: Message = {
          agent: data.agent,
          phase: data.phase,
          message: data.message,
          agentUsage: data.agent_usage,
          nextAgent: data.next_agent,
          timestamp: new Date().toISOString()
        };
        
        console.log('Created new message:', newMessage); // 생성된 메시지 객체 로깅
        
        setMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          console.log('Updated messages state:', updatedMessages); // 상태 업데이트 로깅
          return updatedMessages;
        });
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
      />

      {isLoading && (
        <div className="loading">처리 중...</div>
      )}
      
      <ChatContainer messages={messages} />
    </div>
  );
}

export default App;