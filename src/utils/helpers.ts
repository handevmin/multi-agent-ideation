export const getAgentDisplayName = (agent: string): string => {
  const names: { [key: string]: string } = {
    "supervisor": "관리자",
    "fact_analyzer": "데이터 분석가",
    "emotional": "감성 분석가",
    "critical": "비판적 분석가",
    "positive": "긍정 분석가",
    "creative": "창의적 분석가",
    "system": "시스템"
  };
  return names[agent] || agent;
};

export const getPhaseDisplayName = (phase: string): string => {
  const phases: { [key: string]: string } = {
    "initial": "초기화",
    "research": "리서치",
    "ideation": "아이디어 생성",
    "evaluation": "평가",
    "summary": "요약",
    "complete": "완료"
  };
  return phases[phase] || phase;
};
