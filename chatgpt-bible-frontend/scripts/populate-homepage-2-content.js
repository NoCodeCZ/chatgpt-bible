/**
 * Populate Homepage 2 Block Collections with Content
 * 
 * Extracts content from generated HTML and populates:
 * - block_pain_points
 * - block_timeline
 * - block_registration
 * 
 * Usage:
 *   node scripts/populate-homepage-2-content.js
 */

require('dotenv').config({ path: '.env.local' });
const { createDirectus, rest, authentication, createItems } = require('@directus/sdk');

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || process.env.directus_token || process.env.DIRECTUS_STATIC_TOKEN;
const DIRECTUS_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const DIRECTUS_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

if (!DIRECTUS_URL) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL not found in .env.local');
  process.exit(1);
}

const directus = createDirectus(DIRECTUS_URL).with(rest()).with(authentication('json'));

async function authenticate() {
  if (DIRECTUS_TOKEN) {
    await directus.setToken(DIRECTUS_TOKEN);
    console.log('✅ Authenticated using token');
  } else if (DIRECTUS_EMAIL && DIRECTUS_PASSWORD) {
    await directus.login(DIRECTUS_EMAIL, DIRECTUS_PASSWORD);
    console.log('✅ Authenticated using email/password');
  } else {
    console.error('❌ Error: No authentication method found');
    process.exit(1);
  }
}

async function populateContent() {
  try {
    console.log('🚀 Starting Homepage 2 content population...\n');
    
    await authenticate();

    // 1. Create Pain Points Block
    console.log('📝 Creating Pain Points block...');
    const painPointsData = {
      heading: 'คุณเคยรู้สึกแบบนี้ไหม?',
      description: 'ปัญหาที่คนทำ Affiliate ส่วนใหญ่ต้องเจอ',
      pain_points: [
        {
          icon: 'lucide:clock',
          title: 'ทำคลิปทั้งวันได้น้อยมาก',
          description: 'ใช้เวลา 2-3 ชม. ทำได้แค่ 1 คลิป แต่ยอดขายไม่มา',
        },
        {
          icon: 'lucide:camera-off',
          title: 'ไม่กล้าออกกล้อง',
          description: 'อายที่จะโชว์หน้า หรือพูดไม่เก่ง รู้สึกไม่มั่นใจ',
        },
        {
          icon: 'lucide:shopping-bag',
          title: 'ซื้อสินค้ามาแล้วขายไม่ได้',
          description: 'ลงทุนซื้อสินค้ามารีวิว แต่ไม่มีใครสนใจ เสียเงินฟรี',
        },
        {
          icon: 'lucide:trending-down',
          title: 'เห็นคนอื่นสำเร็จ แต่ตัวเองไม่',
          description: 'ทำตามที่สอน แต่ทำไมผลลัพธ์ไม่เหมือนกัน?',
        },
        {
          icon: 'lucide:users',
          title: 'ไม่มี Follower',
          description: 'เริ่มต้นจาก 0 รู้สึกว่าต้องใช้เวลานานกว่าจะมีคนติดตาม',
        },
      ],
      transition_text: 'แต่ถ้าบอกว่า...\nมีวิธีที่ไม่ต้องทำสิ่งเหล่านั้นเลยล่ะ?',
      theme: 'dark',
      status: 'published',
    };

    const painPointsResult = await directus.request(
      createItems('block_pain_points', [painPointsData])
    );
    console.log(`   ✅ Created Pain Points block: ${painPointsResult[0].id}\n`);

    // 2. Create Timeline Block
    console.log('📝 Creating Timeline block...');
    const timelineData = {
      heading: 'เส้นทางที่เราผ่านมาก่อนจะสำเร็จ',
      description: '3 ปีแห่งการลองผิดลองถูก เพื่อสร้างระบบที่ใช้ได้จริง',
      timeline_items: [
        {
          year: 'ปีที่ 1',
          title: 'ทำงานหนัก 12-14 ชม./วัน',
          description: 'ทำคลิปเอง ตัดต่อเอง อัพเอง แต่ยอดขายแทบไม่มี',
          color: 'red',
        },
        {
          year: 'ปีที่ 2',
          title: 'เสียเงินไปกว่า 100,000 บาท',
          description: 'ค่า Subscription Tools, ค่าคอร์สต่างๆ, ค่าทดลองสินค้า',
          color: 'amber',
        },
        {
          year: 'ปีที่ 3',
          title: 'ค้นพบระบบที่ใช้ได้จริง',
          description: 'รวมความเชี่ยวชาญ AI + Affiliate Strategy = ระบบอัตโนมัติที่ทำเงินได้จริง',
          color: 'emerald',
        },
      ],
      price_anchor_text: 'ถ้าคุณลองผิดลองถูกเอง จะต้องเสีย:',
      price_anchor_time: '3 ปี',
      price_anchor_cost: '>100,000฿',
      theme: 'dark',
      status: 'published',
    };

    const timelineResult = await directus.request(
      createItems('block_timeline', [timelineData])
    );
    console.log(`   ✅ Created Timeline block: ${timelineResult[0].id}\n`);

    // 3. Create Registration Block
    console.log('📝 Creating Registration block...');
    const registrationData = {
      heading: 'ถ้าคุณพร้อมที่จะเริ่มต้น...',
      description: 'ลงทะเบียนง่ายๆ เพียง 3 ขั้นตอน',
      steps: [
        {
          number: 1,
          title: 'เลือกแพ็คเกจ',
          description: 'พิมพ์ A, B หรือ C',
        },
        {
          number: 2,
          title: 'กรอกข้อมูล',
          description: 'ชื่อ และ เบอร์โทร',
        },
        {
          number: 3,
          title: 'ส่งทาง Line',
          description: 'ทีมงานจะติดต่อกลับ',
        },
      ],
      line_id: 'aigc_aff',
      line_url: 'https://line.me/R/ti/p/@aigc_aff',
      // Note: line_qr_code needs to be uploaded separately in Directus Admin UI
      bonuses: [
        {
          icon: 'lucide:file-code',
          title: 'AI Template 50+ แบบ',
          value: 'มูลค่า 2,990 บาท',
        },
        {
          icon: 'lucide:list',
          title: 'Hot Product List',
          value: 'มูลค่า 1,990 บาท',
        },
        {
          icon: 'lucide:book-open',
          title: 'E-book กลยุทธ์ลับ',
          value: 'มูลค่า 990 บาท',
        },
        {
          icon: 'lucide:users',
          title: 'เข้ากลุ่ม VIP ตลอดชีพ',
          value: 'มูลค่า 4,990 บาท',
        },
      ],
      future_pacing_text: 'ลองจินตนาการดู... อีก 3 เดือนข้างหน้า คุณอาจมีรายได้เสริม 20,000-50,000 บาท/เดือน โดยไม่ต้องออกจากบ้าน ไม่ต้องเผชิญหน้าลูกค้า แค่กดปุ่มสร้างคลิป AI',
      theme: 'dark',
      status: 'published',
    };

    const registrationResult = await directus.request(
      createItems('block_registration', [registrationData])
    );
    console.log(`   ✅ Created Registration block: ${registrationResult[0].id}\n`);

    console.log('✅ All blocks created successfully!\n');
    console.log('📋 Created Blocks:');
    console.log(`   • Pain Points: ${painPointsResult[0].id}`);
    console.log(`   • Timeline: ${timelineResult[0].id}`);
    console.log(`   • Registration: ${registrationResult[0].id}\n`);
    console.log('📝 Next Steps:');
    console.log('   1. Upload QR code image for Registration block in Directus Admin UI');
    console.log('   2. Link these blocks to a page via page_blocks collection');
    console.log('   3. Test rendering on the frontend');

  } catch (error) {
    console.error('\n❌ Error populating content:');
    console.error(error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

populateContent();
