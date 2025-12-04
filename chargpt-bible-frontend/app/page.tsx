import type { Metadata } from 'next';
import HeroBlock from '@/components/blocks/HeroBlock';
import FeaturesBlock from '@/components/blocks/FeaturesBlock';
import PromptsGridBlock from '@/components/blocks/PromptsGridBlock';
import PricingBlock from '@/components/blocks/PricingBlock';
import FAQBlock from '@/components/blocks/FAQBlock';
import CTABlock from '@/components/blocks/CTABlock';
import FooterBlock from '@/components/blocks/FooterBlock';
import BackgroundAnimation from '@/components/BackgroundAnimation';

// Force static generation for optimal performance
export const dynamic = 'force-static';
export const revalidate = false;

// SEO metadata
export const metadata: Metadata = {
  title: 'GPT Bible - ปลดล็อกพลังของ AI ด้วย Prompts คุณภาพสูง',
  description: 'รวบรวม prompts ที่ได้มาจากผู้สร้างและบุคคลมืออาชีพจากทั่วโลก เพื่อช่วยให้คุณได้ผลลัพธ์ที่ดีที่สุดจาก AI ในทุกงาน',
  keywords: 'ChatGPT prompts, AI prompts, prompt library, professional prompts, GPT Bible',
  openGraph: {
    title: 'GPT Bible - ปลดล็อกพลังของ AI ด้วย Prompts คุณภาพสูง',
    description: 'รวบรวม prompts ที่ได้มาจากผู้สร้างและบุคคลมืออาชีพจากทั่วโลก',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <main className="text-white antialiased relative min-h-screen">
      {/* Background Component - UnicornStudio animation */}
      <BackgroundAnimation />
      
      {/* Content wrapper with relative positioning - transparent to show animation */}
      <div className="relative z-10">

      {/* Hero Section */}
      <HeroBlock
        data={{
          id: 'hero-1',
          heading: 'ปลดล็อกพลังของ',
          heading2: 'AI',
          heading_line2: 'ด้วย Prompts คุณภาพสูง',
          subheading: 'รวบรวม prompts ที่ได้มาจากผู้สร้างและบุคคลมืออาชีพจากทั่วโลก เพื่อช่วยให้คุณได้ผลลัพธ์ที่ดีที่สุดจาก AI ในทุกงาน',
          cta_text: 'เริ่มต้นฟรี',
          cta_link: '/prompts',
          cta_text2: 'ดูตัวอย่าง Premium',
          cta_link2: '/premium',
          text_align: 'center',
          theme: 'dark',
          stats: [
            {
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-users w-4 h-4 text-purple-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>',
              label: '1,000+ ผู้ใช้งาน',
            },
            {
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text w-4 h-4 text-purple-400"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
              label: '500+ Prompts',
            },
            {
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-star w-4 h-4 text-purple-400"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>',
              label: '4.9/5 รีวิว',
            },
          ],
        }}
      />

      {/* Why Choose Section */}
      <FeaturesBlock
        data={{
          id: 'features-1',
          heading: 'ทำไมต้องเลือก GPT Bible?',
          description: 'เราคัดสรรแต่ prompts คุณภาพสูงที่ได้รับการทดสอบแล้ว',
          theme: 'dark',
          columns: 3,
          features: [
            {
              title: 'Prompts คุณภาพสูง',
              description: 'คัดสรรจากผู้เชี่ยวชาญใน ChatGPT และ AI ใช้ได้ผลจริงจากผู้ใช้',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-sparkles w-8 h-8 text-purple-400"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>',
            },
            {
              title: 'อัปเดตใหม่ตลอด',
              description: 'ทีม prompts ใหม่ๆ จากคนมืออาชีพเพิ่มขึ้นทุกๆ สัปดาห์',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-heart w-8 h-8 text-purple-400"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>',
            },
            {
              title: 'ใช้งานง่าย',
              description: 'คัดลอกและใช้งานได้ทันที ไม่ต้องเสียเวลาศึกษาเพิ่ม',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-zap w-8 h-8 text-purple-400"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>',
            },
          ],
        }}
      />

      {/* Popular Prompts Section */}
      <PromptsGridBlock
        data={{
          id: 'prompts-1',
          heading: 'Prompts ยอดนิยม',
          description: 'ค้นพบ prompts ที่ได้รับความนิยมสูงสุดจากผู้ใช้ของเรา',
          columns: 3,
          show_view_all: true,
          view_all_text: 'ดู Prompts ทั้งหมด',
          view_all_link: '/prompts',
          prompts: [
            {
              title: 'Business Consultant',
              tags: ['ธุรกิจ', 'GPT'],
              badge: 'free',
              views: 1892,
              link: '/prompts/business-consultant',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-briefcase w-6 h-6 text-purple-600"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>',
              icon_color: 'purple',
            },
            {
              title: 'Digital Marketing Strategist',
              tags: ['การตลาด', 'โซเชียล'],
              badge: 'free',
              views: 1778,
              link: '/prompts/marketing-strategist',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-target w-6 h-6 text-blue-600"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
              icon_color: 'blue',
            },
            {
              title: 'AI Expert',
              tags: ['AI', 'Research'],
              badge: 'free',
              views: 1534,
              link: '/prompts/ai-expert',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bot w-6 h-6 text-green-600"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>',
              icon_color: 'green',
            },
            {
              title: 'Marketing Campaign Creator',
              tags: ['การตลาด', 'แคมเปญ', 'คอนเทนต์'],
              badge: 'premium',
              views: 0,
              link: '/prompts/campaign-creator',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-megaphone w-6 h-6 text-orange-600"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"></path><path d="M8 6v8"></path></svg>',
              icon_color: 'orange',
            },
            {
              title: 'Data Analysis Expert',
              tags: ['ข้อมูล', 'วิเคราะห์'],
              badge: 'premium',
              views: 0,
              link: '/prompts/data-analysis',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bar-chart-3 w-6 h-6 text-cyan-600"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>',
              icon_color: 'cyan',
            },
            {
              title: 'Language Learning Tutor',
              tags: ['ภาษา', 'การศึกษา'],
              badge: 'premium',
              views: 0,
              link: '/prompts/language-tutor',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-book-open w-6 h-6 text-pink-600"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>',
              icon_color: 'pink',
            },
          ],
        }}
      />

      {/* Pricing Section */}
      <PricingBlock
        data={{
          id: 'pricing-1',
          heading: 'เลือกแพ็คเกจที่เหมาะกับคุณ',
          description: 'เริ่มต้นฟรี หรือเลือก Premium เพื่อเข้าถึงความสามารถมากยิ่งขึ้น',
          theme: 'dark',
          plans: [
            {
              name: 'Basic',
              price: '฿970',
              price_period: 'ชำระครั้งเดียว',
              description: 'ใช้งานได้ตลอดชีพ',
              features: [
                { text: 'GPT - Basic - PDF', included: true },
                { text: 'ใช้งานได้ตลอดชีพ', included: true },
                { text: 'อัปเดตฟรีตลอด', included: true },
              ],
              bonuses: [
                { text: 'Notion - GPT - Bible - AI Automation', included: false },
                { text: 'โลโก้ GPT - Bible - Web App', included: false },
              ],
              button_text: 'ซื้อตอนนี้ Basic',
              button_link: '/pricing/basic',
            },
            {
              name: 'Standard',
              price: '฿1,470',
              price_period: 'ชำระครั้งเดียว',
              description: 'ใช้งานได้ตลอดชีพ',
              badge: 'แนะนำ',
              featured: true,
              features: [
                { text: 'GPT - Bible - PDF', included: true },
                { text: 'GPT - Bible - Web App', included: true },
                { text: 'ใช้งานได้ตลอดชีพ', included: true },
              ],
              bonuses: [
                { text: 'Notion - GPT - Bible - AI Automation', included: true },
              ],
              button_text: 'ซื้อตอนนี้ Standard',
              button_link: '/pricing/standard',
            },
            {
              name: 'Pro',
              price: '฿1,970',
              price_period: 'ชำระครั้งเดียว',
              description: 'ใช้งานได้ตลอดชีพ',
              features: [
                { text: 'GPT - Basic - PDF', included: true },
                { text: 'GPT - Bible - Web App', included: true },
                { text: 'GPT - Bible - AI Automation', included: true },
              ],
              button_text: 'ซื้อตอนนี้ Pro',
              button_link: '/pricing/pro',
            },
          ],
        }}
      />

      {/* FAQ Section */}
      <FAQBlock
        data={{
          id: 'faq-1',
          heading: 'คำถามที่พบบ่อย',
          description: 'คำตอบสำหรับคำถามที่ผู้ใช้งาน prompts ถามบ่อยที่สุด',
          theme: 'dark',
          faqs: [
            {
              question: 'GPT Bible คืออะไร?',
              answer: 'GPT Bible เป็นแหล่งรวมคอลเลกชันของ prompts คุณภาพสูงสำหรับใช้กับ ChatGPT และ AI อื่นๆ ที่ได้รับการคัดสรรและทดสอบแล้วว่าได้ผล เพื่อช่วยให้คุณได้ผลลัพธ์ที่ดีที่สุดจากการใช้งาน AI',
            },
            {
              question: 'ใช้งานฟรีได้ไหม?',
              answer: 'ได้ครับ prompts หลายรายการสามารถใช้งานได้ฟรี หากต้องการ Premium ทั้งหมดสามารถสมัคร Premium แต่ยังใช้งานฟรีได้',
            },
            {
              question: 'แพ็คเกจ Premium มีอะไรบ้าง?',
              answer: 'สมาชิก Premium จะได้รับสิทธิ์เข้าถึง prompts ทั้งหมด, สามารถดาวน์โหลดเป็นไฟล์ได้ทันที, ได้รับ prompts ใหม่ที่เพิ่ม ก่อนใคร และเข้าถึงกลุ่ม AI Community ลับ',
            },
            {
              question: 'สามารถแชร์หรือขายต่อ prompts ได้ไหม?',
              answer: 'ไม่ สามารถแชร์ขายต่อได้ เราให้สิทธิ์การใช้งานเป็นการส่วนบุคคลเท่านั้น หากละเมิดจะถูกยกเลิกสิทธิ์การใช้งานทันที',
            },
          ],
        }}
      />

      {/* CTA Section */}
      <CTABlock
        data={{
          id: 'cta-1',
          heading: 'พร้อมเริ่มต้นแล้วหรือยัง?',
          description: 'เข้าร่วมกับผู้ใช้กว่า 1,000 คน และพบเครื่องมือพลังของ AI วันนี้!',
          button_text: 'เริ่มต้นฟรี',
          button_link: '/prompts',
          button_text2: 'ดูรายละเอียดเพิ่ม',
          button_link2: '/about',
          button_style: 'primary',
          background_gradient: 'linear-gradient(to top, rgba(139, 92, 246, 0.2), transparent)',
        }}
      />

      {/* Footer */}
      <FooterBlock
        data={{
          id: 'footer-1',
          logo_text: 'GPT Bible',
          logo_link: '/',
          copyright_text: '© 2024 GPT Bible. สงวนลิขสิทธิ์ทุกประการ',
          links: [
            { label: 'Homepage', url: '/', isExternal: false },
            { label: 'แพ็คเกจ', url: '/pricing', isExternal: false },
            { label: 'Prompts', url: '/prompts', isExternal: false },
            { label: 'เกี่ยวกับเราในการใช้งาน', url: '/about', isExternal: false },
            { label: 'นโยบายความเป็นส่วนตัว', url: '/privacy', isExternal: false },
          ],
          social_links: [
            {
              platform: 'twitter',
              url: '#',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-twitter w-4 h-4 text-zinc-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>',
            },
            {
              platform: 'facebook',
              url: '#',
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-facebook w-4 h-4 text-zinc-400"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
            },
          ],
          theme: 'dark',
        }}
      />
      </div>
    </main>
  );
}
