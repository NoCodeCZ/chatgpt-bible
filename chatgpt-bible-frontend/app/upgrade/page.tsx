import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * Upgrade to Premium Page
 *
 * Features:
 * - One-time purchase pricing (฿990)
 * - Benefits list (100+ prompts, lifetime access)
 * - Line contact button for payment
 * - Payment instructions (bank transfer, QR code)
 * - Link back to browse prompts
 * - Mobile-responsive design
 */
export default function UpgradePage() {
  const LINE_ID = process.env.NEXT_PUBLIC_LINE_ID || '@YOUR_LINE_ID';

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-purple-800/5 blur-[150px] opacity-50" />
      </div>

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-xs text-zinc-500">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <span>หน้าแรก</span>
          </Link>
          <span className="text-zinc-700">{'>'}</span>
          <Link
            href="/prompts"
            className="transition-colors hover:text-zinc-300"
          >
            Prompts
          </Link>
          <span className="text-zinc-700">{'>'}</span>
          <span className="text-zinc-300">อัปเกรดเป็น Premium</span>
        </nav>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            ปลดล็อค Prompts ทั้งหมด
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            อัปเกรดเป็นสมาชิก Premium เพื่อเข้าถึง Prompts คุณภาพสูงทั้งหมด
            <br />
            ช่วยให้งานของคุณมีประสิทธิภาพมากขึ้น
          </p>
        </div>

        {/* Pricing & Benefits Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 mb-8">
          {/* Pricing */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-baseline gap-2 mb-2">
              <span className="text-5xl sm:text-6xl font-bold text-white">฿990</span>
              <span className="text-xl text-zinc-400">/ ครั้งเดียว</span>
            </div>
            <p className="text-sm text-green-400 mt-2 font-medium">
              ชำระครั้งเดียว เข้าถึงได้ตลอดชีพ
            </p>
          </div>

          {/* Benefits List */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              ที่คุณจะได้รับ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Benefit 1: 100+ Prompts */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Prompts คุณภาพสูง 100+</h3>
                  <p className="text-sm text-zinc-400">
                    เข้าถึงคลัง Prompts ทั้งหมดสำหรับงานระดับมืออาชีพ
                  </p>
                </div>
              </div>

              {/* Benefit 2: Lifetime Access */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">เข้าถึงตลอดชีพ</h3>
                  <p className="text-sm text-zinc-400">
                    ไม่มีค่าสมัครสมาชิกซ้ำ จ่ายครั้งเดียว ใช้ได้ตลอดไป
                  </p>
                </div>
              </div>

              {/* Benefit 3: Weekly Updates */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">อัปเดตใหม่ทุกสัปดาห์</h3>
                  <p className="text-sm text-zinc-400">
                    Prompts ใหม่ๆ เพิ่มเข้ามาทุกสัปดาห์ ให้คุณนำไปใช้งานได้เลย
                  </p>
                </div>
              </div>

              {/* Benefit 4: Unlimited Access */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">ไม่จำกัดการใช้งาน</h3>
                  <p className="text-sm text-zinc-400">
                    คัดลอก ปรับแต่ง และใช้ Prompts ได้ไม่จำกัด
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Line Contact */}
          <div className="text-center mb-8">
            <a
              href={`https://line.me/${LINE_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#06C755] to-[#05a647] hover:from-[#05a647] hover:to-[#049b42] text-white font-semibold text-lg transition-all shadow-lg hover:shadow-green-500/25"
              aria-label="ติดต่อทาง Line เพื่อสมัครสมาชิก"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 5.91 2 10.5c0 2.92 1.84 5.49 4.63 7.07-.2.76-.75 2.76-.86 3.19-.13.53.19.52.4.38.17-.11 2.63-1.79 3.7-2.52.38.05.76.08 1.13.08 5.52 0 10-3.91 10-8.5S17.52 2 12 2z"/>
              </svg>
              <span>ติดต่อทาง Line เพื่อสมัครสมาชิก</span>
            </a>
            <p className="text-sm text-zinc-500 mt-4">
              คลิกเพื่อติดต่อเราทาง Line สำหรับข้อมูลการชำระเงิน
            </p>
          </div>

          {/* Payment Instructions */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              วิธีชำระเงิน
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Bank Transfer */}
              <div className="p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-400"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white">โอนเงินผ่านธนาคาร</h4>
                </div>
                <p className="text-sm text-zinc-400">
                  โอนเงิน ฿990 ผ่านบัญชีธนาคาร
                  <br />
                  แล้วส่งหลักฐานการโอนเงินทาง Line
                </p>
              </div>

              {/* QR Code */}
              <div className="p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white">QR Code</h4>
                </div>
                <p className="text-sm text-zinc-400">
                  สแกน QR Code เพื่อชำระเงิน
                  <br />
                  ส่งหลักฐานการโอนเงินทาง Line
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-4 text-center">
              หลังจากยืนยันการชำระเงิน เราจะเปิดให้เข้าถึง Prompts ทั้งหมดภายใน 24 ชั่วโมง
            </p>
          </div>
        </div>

        {/* Back to Prompts Link */}
        <div className="text-center">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-purple-500/50 text-white font-medium transition-all hover:bg-zinc-800/60 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>กลับไปดู Prompts</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

/**
 * Page Metadata
 */
export const metadata: Metadata = {
  title: 'อัปเกรดเป็น Premium | GPT Bible',
  description: 'อัปเกรดเป็นสมาชิก Premium เพื่อเข้าถึง Prompts คุณภาพสูง 100+ ชำระครั้งเดียว เข้าถึงได้ตลอดชีพ',
};
