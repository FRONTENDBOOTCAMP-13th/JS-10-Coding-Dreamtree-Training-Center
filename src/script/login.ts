import { signup, login, findPassword, resetPassword } from '../service/auth.ts';
import type { SignupFormData, FindPasswordFormData } from '../types/user.type.ts';

window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form') as HTMLFormElement;
  const signupForm = document.getElementById('signup-form') as HTMLFormElement;
  const findpwForm = document.getElementById('findpw-form') as HTMLFormElement;
  const findpwResetSection = document.getElementById('findpw-reset-section')!;
  const findpwSubmitBtn = document.getElementById('findpw-submit-btn')!;
  let findpwUserEmail: string | null = null;

  // 폼 전환 이벤트 초기화
  document.getElementById('show-signup')!.onclick = (e) => {
    e.preventDefault();
    switchToForm('signup');
  };

  document.getElementById('show-findpw')!.onclick = (e) => {
    e.preventDefault();
    switchToForm('findpw');
  };

  document.getElementById('back-to-login-from-signup')!.onclick = (e) => {
    e.preventDefault();
    switchToForm('login');
  };

  document.getElementById('back-to-login-from-findpw')!.onclick = (e) => {
    e.preventDefault();
    switchToForm('login');
  };

  function switchToForm(formType: 'login' | 'signup' | 'findpw'): void {
    loginForm.classList.toggle('hidden', formType !== 'login');
    signupForm.classList.toggle('hidden', formType !== 'signup');
    findpwForm.classList.toggle('hidden', formType !== 'findpw');
  }

  // 폼 제출 이벤트 초기화
  signupForm.onsubmit = async (e: Event) => {
    e.preventDefault();
    const formData: SignupFormData = {
      email: (document.getElementById('signup-email') as HTMLInputElement).value.trim(),
      password: (document.getElementById('signup-password') as HTMLInputElement).value,
      question: (document.getElementById('signup-question') as HTMLSelectElement).value,
      answer: (document.getElementById('signup-answer') as HTMLInputElement).value.trim(),
    };

    if (!formData.email || !formData.password || !formData.question || !formData.answer) {
      alert('모든 항목을 입력하세요.');
      return;
    }

    const success = await signup(formData);
    if (!success) {
      alert('이미 존재하는 이메일입니다.');
      return;
    }

    alert('회원가입이 완료되었습니다. 로그인 해주세요!');
    document.getElementById('back-to-login-from-signup')!.click();
  };

  loginForm.onsubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.querySelector('input[type=email]') as HTMLInputElement).value.trim();
    const password = (form.querySelector('input[type=password]') as HTMLInputElement).value;

    const success = await login({ email, password });
    if (!success) {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      return;
    }

    window.location.href = '/';
  };

  findpwForm.onsubmit = async (e: Event) => {
    e.preventDefault();
    const formData: FindPasswordFormData = {
      email: (document.getElementById('findpw-email') as HTMLInputElement).value.trim(),
      question: (document.getElementById('findpw-question') as HTMLSelectElement).value,
      answer: (document.getElementById('findpw-answer') as HTMLInputElement).value.trim(),
    };

    const success = await findPassword(formData);
    if (!success) {
      alert('입력하신 정보가 일치하지 않습니다.');
      return;
    }

    findpwUserEmail = formData.email;
    findpwResetSection.classList.remove('hidden');
    findpwSubmitBtn.classList.add('hidden');
  };

  // 비밀번호 재설정 이벤트 초기화
  document.getElementById('findpw-reset-btn')!.onclick = async () => {
    const newPassword = (document.getElementById('findpw-newpw') as HTMLInputElement).value;

    if (!newPassword || !findpwUserEmail) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }

    const success = await resetPassword(findpwUserEmail, newPassword);
    if (!success) {
      alert('비밀번호 재설정에 실패했습니다.');
      return;
    }

    alert('비밀번호가 재설정되었습니다. 로그인 해주세요!');
    document.getElementById('back-to-login-from-findpw')!.click();
    findpwResetSection.classList.add('hidden');
    findpwSubmitBtn.classList.remove('hidden');
    (document.getElementById('findpw-newpw') as HTMLInputElement).value = '';
  };
});
