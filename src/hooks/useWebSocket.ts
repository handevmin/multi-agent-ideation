import { useState, useEffect } from 'react';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        const existingSessionId = localStorage.getItem('sessionId');
        const newSessionId = existingSessionId || crypto.randomUUID();
        if (!existingSessionId) {
            localStorage.setItem('sessionId', newSessionId);
        }
        setSessionId(newSessionId);

        const ws = new WebSocket(`wss://your-backend-url/ws/${newSessionId}`);

        ws.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket Connected with session:', newSessionId);
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket Disconnected');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return { socket, isConnected, sessionId };
};
