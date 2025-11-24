
import { User, Post, Message } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Leo',
  avatar: 'https://picsum.photos/seed/me_cool/200/200', // Modern young person avatar
  phone: '13800138000',
  wxid: 'wxid_leo888'
};

// Chinese Internet Culture Archetypes
export const INITIAL_FRIENDS: User[] = [
  { id: '1', name: '相亲相爱一家人', avatar: 'https://picsum.photos/seed/lotus_flower/200/200', phone: '13900000001', wxid: 'family_group' }, // Family Group (Lotus flower avatar)
  { id: '2', name: '妈', avatar: 'https://picsum.photos/seed/nature_peony/200/200', phone: '13900000002', wxid: 'mom_love' }, // Mom (Peony/Scenery)
  { id: '3', name: 'Boss', avatar: 'https://picsum.photos/seed/suit_man/200/200', phone: '13900000003', wxid: 'boss_zhang' }, // Boss
  { id: '4', name: 'A01 置业顾问小王', avatar: 'https://picsum.photos/seed/suit_smile/200/200', phone: '13900000004', wxid: 'wang_estate' }, // Real Estate Agent (A01 to be at top)
  { id: '5', name: 'momo', avatar: 'https://picsum.photos/seed/pink_dino/200/200', phone: '13900000005', wxid: 'momo_user' }, // The "momo" trend
  { id: '6', name: '文件传输助手', avatar: 'https://picsum.photos/seed/folder_green/200/200', phone: '00000000000', wxid: 'file_transfer' }, // File Transfer Helper
  { id: '7', name: 'AAA建材批发老李', avatar: 'https://picsum.photos/seed/truck_goods/200/200', phone: '13900000007', wxid: 'li_construction' }, // Business owner
  { id: '8', name: '老婆', avatar: 'https://picsum.photos/seed/girl_cute/200/200', phone: '13900000008', wxid: 'my_love' }, // Wife/GF
  { id: '9', name: '菜鸟驿站', avatar: 'https://picsum.photos/seed/box_delivery/200/200', phone: '13900000009', wxid: 'cainiao' }, // Package delivery
  { id: '10', name: '卷王 (Jack)', avatar: 'https://picsum.photos/seed/code_screen/200/200', phone: '13900000010', wxid: 'jack_work' }, // Workaholic colleague
  { id: '11', name: 'Tony老师', avatar: 'https://picsum.photos/seed/hair_style/200/200', phone: '13900000011', wxid: 'tony_hair' }, // Hairdresser
  { id: '12', name: '房东', avatar: 'https://picsum.photos/seed/keys/200/200', phone: '13900000012', wxid: 'landlord' }, // Landlord
  { id: '13', name: '小学同学', avatar: 'https://picsum.photos/seed/childhood/200/200', phone: '13900000013', wxid: 'old_classmate' },
];

export const MOCK_MESSAGES: Message[] = [
  // Boss - Work pressure
  { id: 'm1', senderId: '3', receiverId: 'me', content: '小Leo，那个PPT做好了吗？', type: 'text', timestamp: Date.now() - 300000, read: false },
  
  // Mom - Care
  { id: 'm2', senderId: '2', receiverId: 'me', content: '儿砸，最近天气冷了，记得穿秋裤啊！', type: 'audio', duration: 12, timestamp: Date.now() - 1800000, read: true }, // "Did you eat?"
  { id: 'm2_txt', senderId: '2', receiverId: 'me', content: '[语音]', type: 'text', timestamp: Date.now() - 1800000, read: true }, // Fallback display? No, handled by type. 
  
  // Wife - Dinner
  { id: 'm3', senderId: 'me', receiverId: '8', content: '今晚吃火锅吗？', type: 'text', timestamp: Date.now() - 3600000, read: true },
  { id: 'm4', senderId: '8', receiverId: 'me', content: '好呀，记得买点虾滑 🦐', type: 'text', timestamp: Date.now() - 3500000, read: false },

  // Real Estate - Spam
  { id: 'm5', senderId: '4', receiverId: 'me', content: '哥，这边新出了个楼盘，首付只要30万，考虑一下吗？', type: 'text', timestamp: Date.now() - 86400000, read: true },

  // Family Group - Health rumor
  { id: 'm6', senderId: '2', receiverId: '1', content: '震惊！常吃这个竟然会致癌...', type: 'text', timestamp: Date.now() - 7200000, read: true },
  
  // Delivery - Pickup
  { id: 'm7', senderId: '9', receiverId: 'me', content: '取件码：8-2-3056，请及时取件。', type: 'text', timestamp: Date.now() - 1200000, read: true },

  // Tony - Appointment
  { id: 'm8', senderId: '11', receiverId: 'me', content: '帅哥，该剪头发了，这周有空吗？', type: 'text', timestamp: Date.now() - 200000000, read: true },

  // momo - Internet slang
  { id: 'm9', senderId: '5', receiverId: 'me', content: '尊嘟假嘟 O.o', type: 'text', timestamp: Date.now() - 60000, read: false },
];

export const MOCK_POSTS_INITIAL: Post[] = [
  {
    id: 'p1',
    authorId: '2', // Mom
    content: '今天是立冬，大家记得吃饺子！转发这条锦鲤，好运连连！🎏',
    images: ['https://loremflickr.com/400/300/dumpling,food?lock=1'],
    likes: ['1', 'me', '3', '7'],
    comments: [
      { id: 'c1', userId: '1', userName: '相亲相爱一家人', content: '收到！', timestamp: Date.now() - 3600000 },
      { id: 'c2', userId: 'me', userName: 'Leo', content: '妈，我晚上回去吃。', timestamp: Date.now() - 1800000 }
    ],
    timestamp: Date.now() - 7200000
  },
  {
    id: 'p2',
    authorId: '5', // momo
    content: '无语死了一整个... 🙄 #避雷',
    images: [],
    likes: ['10', '13'],
    comments: [],
    timestamp: Date.now() - 12000000
  },
  {
    id: 'p3',
    authorId: '4', // Real Estate
    content: '【急售】业主出国急售，低于市场价50万！手慢无！🏠',
    images: ['https://loremflickr.com/400/300/apartment,room?lock=2', 'https://loremflickr.com/400/300/livingroom?lock=3', 'https://loremflickr.com/400/300/kitchen?lock=4'],
    likes: [],
    comments: [],
    timestamp: Date.now() - 15000000
  },
  {
    id: 'p4',
    authorId: '10', // Workaholic
    content: '凌晨三点的科技园。加油，打工人！💪 ☕️',
    images: ['https://loremflickr.com/400/400/computer,code?lock=5'],
    likes: ['3', 'me'],
    comments: [
      { id: 'c4', userId: '3', userName: 'Boss', content: '辛苦了，明天早上开会说一下进度。', timestamp: Date.now() - 14000000 }
    ],
    timestamp: Date.now() - 20000000 // ~5 hours ago
  },
  {
    id: 'p5',
    authorId: '8', // Wife
    content: '和闺蜜的下午茶 🍰☕️',
    images: ['https://loremflickr.com/400/400/cake,dessert?lock=6', 'https://loremflickr.com/400/400/coffee?lock=7'],
    likes: ['me', '2', '5', '11'],
    comments: [
      { id: 'c5', userId: 'me', userName: 'Leo', content: '给我留一块！', timestamp: Date.now() - 40000000 }
    ],
    timestamp: Date.now() - 43200000
  },
  {
    id: 'p6',
    authorId: '7', // Construction Li
    content: '诚信经营，童叟无欺。专业承接各种水电改造。',
    images: ['https://loremflickr.com/400/300/drill,tools?lock=8'],
    likes: [],
    comments: [],
    timestamp: Date.now() - 100000000
  },
  {
    id: 'p7',
    authorId: '13', // Classmate
    content: '终于去了一直想去的环球影城！',
    images: ['https://loremflickr.com/400/400/amusementpark?lock=9', 'https://loremflickr.com/400/400/castle?lock=10'],
    likes: ['me', '5'],
    comments: [],
    timestamp: Date.now() - 120000000
  },
  {
    id: 'p8',
    authorId: '11', // Tony
    content: '今日作品，复古卷发。✨',
    images: ['https://loremflickr.com/400/400/hair,fashion?lock=11'],
    likes: ['4', '12'],
    comments: [],
    timestamp: Date.now() - 150000000
  }
];
