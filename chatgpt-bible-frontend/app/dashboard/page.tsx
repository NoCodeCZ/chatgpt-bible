'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

/**
 * User Dashboard Page
 *
 * Features:
 * - Welcome message with user's email
 * - Subscription status card (Free/Paid, renewal date)
 * - Quick link to prompts
 * - Logout button
 * - Upgrade CTA for free users
 * - Manage Subscription link for paid users
 * - Mobile-responsive design
 */
export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout, isPaidUser } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-zinc-400">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Format subscription expiry date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const renewalDate = formatDate(user.subscription_expires_at);

  // Safely derive a display name. In some edge cases (e.g. freshly created
  // Directus users), the `email` field might be missing or undefined, which
  // would cause `user.email.split(...)` to throw a runtime error.
  const displayName =
    user.first_name ||
    (typeof user.email === 'string' && user.email.includes('@')
      ? user.email.split('@')[0]
      : 'ผู้ใช้');

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* Background Gradient */}
      <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            ยินดีต้อนรับ, {displayName}!
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">{user.email}</p>
        </div>

        {/* Subscription Status Card */}
        <div className="mb-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">สถานะการสมัครสมาชิก</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isPaidUser
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-zinc-700/50 text-zinc-300 border border-zinc-600/50'
                  }`}
                >
                  {isPaidUser ? 'Premium Member' : 'Free Member'}
                </span>
              </div>
            </div>
          </div>

          {isPaidUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>คุณมีสิทธิ์เข้าถึง Prompts ทั้งหมด</span>
              </div>

              {renewalDate ? (
                <p className="text-sm text-zinc-400">
                  หมดอายุ: {renewalDate}
                </p>
              ) : (
                <p className="text-sm text-zinc-400">
                  สมาชิกตลอดชีพ (ไม่มีวันหมดอายุ)
                </p>
              )}

              <div className="pt-2">
                <Link
                  href="/prompts"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all"
                >
                  <span>ดู Prompts ทั้งหมด</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                อัปเกรดเป็น Premium เพื่อเข้าถึง Prompts ทั้งหมด
              </p>

              <div className="pt-2">
                <Link
                  href="/upgrade"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25"
                >
                  <span>อัปเกรดเป็น Premium</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">เมนูด่วน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/prompts"
              className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    ดู Prompts
                  </h3>
                  <p className="text-sm text-zinc-400">เรียกดูคอลเลกชัน prompts ทั้งหมด</p>
                </div>
              </div>
            </Link>

            <Link
              href="/account/settings"
              className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    ตั้งค่าบัญชี
                  </h3>
                  <p className="text-sm text-zinc-400">เปลี่ยนรหัสผ่านและข้อมูลส่วนตัว</p>
                </div>
              </div>
            </Link>

            <button
              onClick={async () => {
                try {
                  await logout();
                } catch (error) {
                  console.error('Logout failed:', error);
                }
              }}
              className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                    ออกจากระบบ
                  </h3>
                  <p className="text-sm text-zinc-400">ออกจากบัญชีของคุณ</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-4">ข้อมูลบัญชี</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-sm text-zinc-400">อีเมล</span>
              <span className="text-sm text-white font-medium">{user.email}</span>
            </div>
            {user.first_name && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-zinc-400">ชื่อ</span>
                <span className="text-sm text-white font-medium">
                  {user.first_name} {user.last_name || ''}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-sm text-zinc-400">สถานะ</span>
              <span className="text-sm text-white font-medium">
                {isPaidUser ? 'Premium Member' : 'Free Member'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

