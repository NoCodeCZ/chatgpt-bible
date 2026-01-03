'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Change Password Form Component
 */
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    if (newPassword.length < 8) {
      setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          เปลี่ยนรหัสผ่านสำเร็จแล้ว
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-300 mb-2">
          รหัสผ่านปัจจุบัน
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="กรอกรหัสผ่านปัจจุบัน"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300 mb-2">
          รหัสผ่านใหม่
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            กำลังบันทึก...
          </>
        ) : (
          'เปลี่ยนรหัสผ่าน'
        )}
      </button>
    </form>
  );
}

/**
 * Account Settings Page
 *
 * Features:
 * - Change password
 * - View account info
 * - Back to dashboard link
 */
export default function AccountSettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/login?redirect=/account/settings');
    return null;
  }

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

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* Background Gradient */}
      <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            กลับไป Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">ตั้งค่าบัญชี</h1>
          <p className="text-zinc-400">จัดการข้อมูลส่วนตัวและความปลอดภัยของคุณ</p>
        </div>

        {/* Account Info Card */}
        <div className="mb-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4">ข้อมูลบัญชี</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-zinc-800">
              <span className="text-sm text-zinc-400">อีเมล</span>
              <span className="text-sm text-white font-medium">{user.email}</span>
            </div>
            {user.first_name && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-zinc-800">
                <span className="text-sm text-zinc-400">ชื่อ</span>
                <span className="text-sm text-white font-medium">
                  {user.first_name} {user.last_name || ''}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-sm text-zinc-400">สถานะสมาชิก</span>
              <span className="text-sm text-white font-medium">
                {user.subscription_status === 'paid' ? 'Premium Member' : 'Free Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4">เปลี่ยนรหัสผ่าน</h2>
          <Suspense fallback={<div className="h-64 animate-pulse bg-zinc-800/50 rounded-xl" />}>
            <ChangePasswordForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
