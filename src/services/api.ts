import { Task, Message } from "../types";

const API_BASE_URL = 'https://multi-agent-ideation-47d7ed810e04.herokuapp.com';

export const startIdeation = async (task: Task): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ideate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};