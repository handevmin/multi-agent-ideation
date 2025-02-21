
import React, { FormEvent, useState } from "react";
import { Task, TaskFormProps } from "../types";
import { startIdeation } from "../services/api";

interface ExtendedTaskFormProps extends TaskFormProps {
  sessionId: string;
}

const TaskForm: React.FC<ExtendedTaskFormProps> = ({ 
  isLoading, 
  setIsLoading, 
  setMessages, 
  sessionId 
}) => {
  const [formData, setFormData] = useState<Task>({
    goal: "아이디어 5개 도출 및 우선순위화된 상위 3개 아이디어 선정",
    target_users: "20~30대, 모바일 중심으로 콘텐츠를 소비하는 사용자",
    constraints: "앱 내 검색 기능 개선에만 초점, 외부 플랫폼 제외",
    scope: "앱 내 검색 기능 개선"
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessages([]);
    setIsLoading(true);
    try {
      await startIdeation(formData, sessionId);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        agent: "system",
        phase: "error",
        message: error instanceof Error ? error.message : "An unknown error occurred"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="goal">목표</label>
        <input
          type="text"
          id="goal"
          value={formData.goal}
          onChange={e => setFormData(prev => ({ ...prev, goal: e.target.value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="targetUsers">대상 사용자</label>
        <input
          type="text"
          id="targetUsers"
          value={formData.target_users}
          onChange={e => setFormData(prev => ({ ...prev, target_users: e.target.value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="constraints">제약사항</label>
        <input
          type="text"
          id="constraints"
          value={formData.constraints}
          onChange={e => setFormData(prev => ({ ...prev, constraints: e.target.value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="scope">범위</label>
        <input
          type="text"
          id="scope"
          value={formData.scope}
          onChange={e => setFormData(prev => ({ ...prev, scope: e.target.value }))}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "처리 중..." : "아이디어 생성 시작"}
      </button>
    </form>
  );
};

export default TaskForm;