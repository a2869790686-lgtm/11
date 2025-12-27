
import { User, Post, Message, Group } from './types';

export const TRANSLATIONS = {
  en: {
    wechat: 'WeChat',
    chats: 'Chats',
    contacts: 'Contacts',
    discover: 'Discover',
    me: 'Me',
    search: 'Search',
    moments: 'Moments',
    scan: 'Scan',
    shake: 'Shake',
    top_stories: 'Top Stories',
    games: 'Games',
    mini_programs: 'Mini Programs',
    services: 'Services',
    favorites: 'Favorites',
    sticker_gallery: 'Sticker Gallery',
    settings: 'Settings',
    log_out: 'Log Out',
    privacy: 'Privacy',
    general: 'General',
    new_friends: 'New Friends',
    group_chats: 'Group Chats',
    tags: 'Tags',
    official_accounts: 'Official Accounts'
  },
  zh: {
    wechat: '微信',
    chats: '微信',
    contacts: '通讯录',
    discover: '发现',
    me: '我',
    search: '搜索',
    moments: '朋友圈',
    scan: '扫一扫',
    shake: '摇一摇',
    top_stories: '看一看',
    games: '游戏',
    mini_programs: '小程序',
    services: '服务',
    favorites: '收藏',
    sticker_gallery: '表情',
    settings: '设置',
    log_out: '退出登录',
    privacy: '隐私',
    general: '通用',
    new_friends: '新的朋友',
    group_chats: '群聊',
    tags: '标签',
    official_accounts: '公众号'
  }
};

export const CURRENT_USER: User = {
  id: 'me',
  name: '未婚妻', 
  avatar: 'https://loremflickr.com/200/200/girl,cute?lock=100',
  phone: '13800138000',
  wxid: 'lucky_one',
  signature: '查理苏的未婚妻。'
};

export const INITIAL_FRIENDS: User[] = [
  // --- 特殊角色：查理苏 ---
  { 
    id: 'charlie_su', 
    name: '查理苏', 
    avatar: 'https://loremflickr.com/200/200/man,elegant,doctor?lock=777', 
    phone: '18888888888', 
    wxid: 'Charlie_Masterpiece', 
    signature: '只有查理苏，才能超越查理苏。旷世奇作，即刻降临。' 
  },
  
  // --- 原有联系人 ---
  { id: '2', name: '妈', avatar: 'https://picsum.photos/seed/mom_flower/200/200', phone: '13900000002', wxid: 'mom_love', signature: '知足常乐，平安是福。🍎' },
  { id: '3', name: 'Boss张', avatar: 'https://picsum.photos/seed/boss_suit/200/200', phone: '13900000003', wxid: 'boss_zhang_pro', signature: '结果导向，效率第一。' },
  { id: '8', name: '老婆大人', avatar: 'https://loremflickr.com/200/200/girl,beautiful?lock=8', phone: '13900000008', wxid: 'my_queen', signature: '家里我最大 ❤️' },
  { id: '43', name: '刘伯伯(二叔)', avatar: 'https://loremflickr.com/200/200/man,rich?lock=43', phone: '13900000043', wxid: 'cement_king_888', signature: '承接各型号水泥沙石，量大从优。' },
  { id: '44', name: '小李', avatar: 'https://loremflickr.com/200/200/man,young?lock=44', phone: '13900000044', wxid: 'lee_young', signature: '奋斗中...' },

  // --- 新增中国社会典型人物 ---
  { id: '51', name: '美团小哥-王师傅', avatar: 'https://loremflickr.com/200/200/man,worker,yellow?lock=51', phone: '13900000051', wxid: 'takeaway_pro', signature: '风里雨里，我也在楼下等你。' },
  { id: '52', name: '社区团长-陈姐', avatar: 'https://loremflickr.com/200/200/woman,market?lock=52', phone: '13900000052', wxid: 'tuan_zhang_chen', signature: '今日特价：吐鲁番巨峰葡萄，速度拼单！' },
  { id: '53', name: '保险顾问-王姐', avatar: 'https://loremflickr.com/200/200/woman,suit?lock=53', phone: '13900000053', wxid: 'safe_life_wang', signature: '重疾险不等人，为了家人请加我咨询。' },
  { id: '54', name: '物业小赵', avatar: 'https://loremflickr.com/200/200/man,security?lock=54', phone: '13900000054', wxid: 'property_service', signature: '您的满意是我们最大的追求。' },
  { id: '55', name: '健身房-李教练', avatar: 'https://loremflickr.com/200/200/man,fitness?lock=55', phone: '13900000055', wxid: 'gym_beast_lee', signature: '今天不练腿，明天准后悔。' },
  { id: '56', name: 'Tony老师', avatar: 'https://loremflickr.com/200/200/man,hairdresser?lock=56', phone: '13900000056', wxid: 'tony_style_001', signature: '发型决定人生，预约请私信。' },
  { id: '57', name: '中介小张-自如', avatar: 'https://loremflickr.com/200/200/man,suit,agent?lock=57', phone: '13900000057', wxid: 'ziroom_zhang', signature: '租房找小张，生活不将就。' },
  { id: '58', name: '大姨', avatar: 'https://loremflickr.com/200/200/woman,elder?lock=58', phone: '13900000058', wxid: 'auntie_love', signature: '转发：这十种食物千万不能一起吃！' },
  { id: '59', name: '高中李老师', avatar: 'https://loremflickr.com/200/200/man,teacher?lock=59', phone: '13900000059', wxid: 'teacher_lee_high', signature: '为人师表，厚德载物。' },
  { id: '60', name: '顺丰快递', avatar: 'https://loremflickr.com/200/200/man,delivery?lock=60', phone: '13900000060', wxid: 'sf_express_01', signature: '顺丰速运，使命必达。' },
  { id: '61', name: '实习生小周', avatar: 'https://loremflickr.com/200/200/girl,student?lock=61', phone: '13900000061', wxid: 'intern_zhou', signature: '早日转正！加油加油！' },
  { id: '62', name: '老同学张伟', avatar: 'https://loremflickr.com/200/200/man,casual?lock=62', phone: '13900000062', wxid: 'zhang_wei_old_friend', signature: '怀念那时候的操场。' }
];

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: '相亲相爱一家人', avatar: 'https://picsum.photos/seed/lotus_flower/200/200', members: ['me', '2', '43', '58'], notice: '过年记得回家吃饭！' },
  { id: 'g2', name: '打工人互助群', avatar: 'https://picsum.photos/seed/office/200/200', members: ['me', '3', '44', '61'], notice: '不准在群里发广告。' }
];

const generateBatchMessages = () => {
  const now = Date.now();
  const msgs: Message[] = [
    { id: 'ch_1', senderId: 'charlie_su', receiverId: 'me', content: '未婚妻，今天又是被我的完美所震撼的一天吗？', type: 'text', timestamp: now - 1000, read: false },
    { id: 'm3_1', senderId: '3', receiverId: 'me', content: '周报怎么还没发我？', type: 'text', timestamp: now - 3600000, read: false },
    { id: 'm51_1', senderId: '51', receiverId: 'me', content: '外卖放前台了，记得趁热吃。', type: 'text', timestamp: now - 7200000, read: true },
    { id: 'm52_1', senderId: '52', receiverId: 'me', content: '陈姐：你要的葡萄到了，下班来取。', type: 'text', timestamp: now - 10000000, read: false },
    { id: 'm53_1', senderId: '53', receiverId: 'me', content: '有一款新的教育分红险挺适合你。', type: 'text', timestamp: now - 15000000, read: false },
    { id: 'm54_1', senderId: '54', receiverId: 'me', content: '通知：明天14:00停水检修。', type: 'text', timestamp: now - 20000000, read: true },
    { id: 'm2_1', senderId: '2', receiverId: 'me', content: '降温了，多穿件衣服。', type: 'text', timestamp: now - 86400000, read: true },
    { id: 'm56_1', senderId: '56', receiverId: 'me', content: 'Tony：最近有空来剪个头发吗？', type: 'text', timestamp: now - 90000000, read: true },
    { id: 'm57_1', senderId: '57', receiverId: 'me', content: '您关注的那套房降价200了。', type: 'text', timestamp: now - 100000000, read: true },
    { id: 'm58_1', senderId: '58', receiverId: 'me', content: '[链接] 震惊！睡前喝这个竟然... ', type: 'text', timestamp: now - 110000000, read: true },
    { id: 'm61_1', senderId: '61', receiverId: 'me', content: '周姐，表格我填好了，您看下。', type: 'text', timestamp: now - 120000000, read: true }
  ];
  return msgs.sort((a, b) => b.timestamp - a.timestamp);
};

export const MOCK_MESSAGES: Message[] = generateBatchMessages();

export const MOCK_POSTS_INITIAL: Post[] = [
  { 
    id: 'p_charlie_1', 
    authorId: 'charlie_su', 
    content: '今日在手术室完成了一场艺术品般的缝合。毕竟，完美的手指只为完美的生命跳动。未婚妻，你是这世界上除了我之外，最幸运的存在。', 
    images: ['https://loremflickr.com/400/300/medical,hospital?lock=1'], 
    likes: ['me', '44', '51'], 
    comments: [], 
    timestamp: Date.now() - 3600000 
  },
  { 
    id: 'p_mom', 
    authorId: '2', 
    content: '阳台上的花开了。', 
    images: ['https://picsum.photos/400/300?random=2'], 
    likes: ['me', '58'], 
    comments: [], 
    timestamp: Date.now() - 7200000 
  },
  { 
    id: 'p_agent', 
    authorId: '57', 
    content: '静安区绝美精装一居室，拎包入住！手慢无！', 
    images: ['https://loremflickr.com/400/300/room?lock=57'], 
    likes: [], 
    comments: [], 
    timestamp: Date.now() - 15000000 
  }
];
