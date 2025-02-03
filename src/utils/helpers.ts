export const getAgentDisplayName = (agent: string): string => {
  const names: { [key: string]: string } = {
    "facilitator": "진행자",
    "white_hat": "White Hat (객관적 데이터 분석)",
    "red_hat": "Red Hat (감정/직관적 분석)",
    "black_hat": "Black Hat (비판적 분석)",
    "yellow_hat": "Yellow Hat (긍정적 분석)",
    "green_hat": "Green Hat (창의적 분석)",
    "system": "시스템"
  };
  return names[agent.toLowerCase()] || agent;
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