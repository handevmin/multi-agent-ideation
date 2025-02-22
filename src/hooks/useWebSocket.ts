import { useState, useEffect, useRef } from 'react';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const socketRef = useRef<WebSocket | null>(null);

    const connect = () => {
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

            if (reconnectAttempts.current < maxReconnectAttempts) {
                const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                console.log(`Reconnecting in ${timeout}ms...`);
                setTimeout(() => {
                    reconnectAttempts.current += 1;
                    connect();
                }, timeout);
            }
        };

        ws.onmessage = (event) => {
            // ping/pong 메시지는 무시
            if (event.data === 'pong') {
                return;
            }
            
            try {
                // 나머지 메시지는 JSON으로 파싱
                const data = JSON.parse(event.data);
                // 여기서 메시지 처리
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
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