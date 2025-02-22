import { useState, useEffect, useRef } from 'react';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const socketRef = useRef<WebSocket | null>(null);

    const connect = () => {
        // 기존 연결이 있다면 닫기
        if (socketRef.current) {
            socketRef.current.close();
        }

        const existingSessionId = localStorage.getItem('sessionId');
        const newSessionId = existingSessionId || crypto.randomUUID();
        if (!existingSessionId) {
            localStorage.setItem('sessionId', newSessionId);
        }
        setSessionId(newSessionId);

        const wsUrl = `wss://multi-agent-ideation-47d7ed810e04.herokuapp.com/ws/${newSessionId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
            reconnectAttempts.current = 0;
            socketRef.current = ws;
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            socketRef.current = null;

            // 재연결 시도
            if (reconnectAttempts.current < maxReconnectAttempts) {
                const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                console.log(`Reconnecting in ${timeout}ms...`);
                setTimeout(() => {
                    reconnectAttempts.current += 1;
                    connect();
                }, timeout);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        setSocket(ws);
    };

    useEffect(() => {
        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    // Keep-alive mechanism
    useEffect(() => {
        if (!socket) return;

        const interval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send("ping");
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [socket]);

    return { socket, isConnected, sessionId };
};