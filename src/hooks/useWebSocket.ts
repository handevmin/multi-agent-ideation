import { useState, useEffect } from 'react';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket('wss://multi-agent-ideation-47d7ed810e04.herokuapp.com/ws');

        ws.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket Connected');
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

    return { socket, isConnected };
};