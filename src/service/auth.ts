import bcrypt from 'bcryptjs';
import type {
  User,
  LoginFormData,
  SignupFormData,
  FindPasswordFormData,
} from '../types/user.type.ts';

// 유저 데이터 로컬스토리지 조회
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

export function setUsers(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

// 인증 상태 관리
export function setAuthState(email: string) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('loginUser', email);
}

export function clearAuthState() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginUser');
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// 회원가입
export async function signup(data: SignupFormData): Promise<boolean> {
  const { email, password, question, answer } = data;
  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    return false;
  }

  const hashedPw = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(answer, 10);

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password: hashedPw,
    question,
    answer: hashedAnswer,
  };

  users.push(newUser);
  setUsers(users);
  return true;
}

// 로그인
export async function login(data: LoginFormData): Promise<boolean> {
  const { email, password } = data;
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return false;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }

  setAuthState(email);
  return true;
}

// 비밀번호 찾기
export async function findPassword(data: FindPasswordFormData): Promise<boolean> {
  const { email, question, answer } = data;
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.question === question);

  if (!user) {
    return false;
  }

  const answerMatch = await bcrypt.compare(answer, user.answer);
  if (!answerMatch) {
    return false;
  }

  return true;
}

// 비밀번호 재설정
export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email);

  if (idx === -1) {
    return false;
  }

  const hashedNewPw = await bcrypt.hash(newPassword, 10);
  users[idx].password = hashedNewPw;
  setUsers(users);
  return true;
}
