// 기본 사용자 정보
export interface User {
  id: string; // 유저 고유 식별자
  email: string; // 유저 이메일
  password: string; // bcrypt으로 해시화된 비밀번호
  question: string; // 유저 질문 타입
  answer: string; // bcrypt으로 해시화된 답변
}

export interface FindPasswordFormData {
  email: string;
  question: string;
  answer: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  question: string;
  answer: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
