// src/hooks/useWebSocket.ts

import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 5;
    
    const connectWebSocket = useCallback((id: string) => {
        const ws = new WebSocket(`wss://multi-agent-ideation-47d7ed810e04.herokuapp.com/ws/${id}`);
        
        ws.onopen = () => {
            setIsConnected(true);
            setRetryCount(0);
            console.log('WebSocket Connected');
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket Disconnected');
            
            // 재연결 시도
            if (retryCount < MAX_RETRIES) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    connectWebSocket(id);
                }, 1000 * Math.pow(2, retryCount)); // 지수 백오프
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        setSocket(ws);
    }, [retryCount]);

    useEffect(() => {
        // 세션 ID 생성 또는 복구
        const existingSessionId = localStorage.getItem('sessionId');
        const newSessionId = existingSessionId || crypto.randomUUID();
        if (!existingSessionId) {
            localStorage.setItem('sessionId', newSessionId);
        }
        setSessionId(newSessionId);

        // WebSocket 연결
        connectWebSocket(newSessionId);

        // Cleanup
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [connectWebSocket]);

    // 활성 상태 유지를 위한 ping
    useEffect(() => {
        if (!socket) return;

        const interval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send('ping');
            }
        }, 30000); // 30초마다 ping

        return () => clearInterval(interval);
    }, [socket]);

    return { socket, isConnected, sessionId };
};