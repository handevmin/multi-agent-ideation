export interface Message {
  agent: string;
  phase: string;
  message: string;
  progress?: number | null;
  agentUsage?: AgentUsage;
  nextAgent?: string;
  timestamp?: string;
}

export interface Task {
  goal: string;
  target_users: string;
  constraints: string;
  scope: string;
}

export interface AgentUsage {
  [key: string]: number;
}

export interface StateUpdate {
  agent: string;
  phase: string;
  message: string;
  agent_usage: AgentUsage;
  next_agent: string;
}

export interface ChatContainerProps {
  messages: Message[];
}

export interface TaskFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}