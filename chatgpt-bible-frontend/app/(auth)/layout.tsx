import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ - GPT Bible',
  description: 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเข้าถึง prompts คุณภาพสูง',
};

/**
 * Auth Layout - Minimal layout for login/signup pages
 * No navbar to keep the focus on authentication
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
