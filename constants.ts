

import { User, Post, Message, Group } from './types';

export const TRANSLATIONS = {
  en: {
    // Tabs
    chats: 'Chats',
    contacts: 'Contacts',
    discover: 'Discover',
    me: 'Me',
    // Headers
    wechat: 'WeChat',
    // Discover
    moments: 'Moments',
    channels: 'Channels',
    scan: 'Scan',
    shake: 'Shake',
    top_stories: 'Top Stories',
    search: 'Search',
    games: 'Games',
    music: 'Music',
    mini_programs: 'Mini Programs',
    // Me
    services: 'Services',
    favorites: 'Favorites',
    sticker_gallery: 'Sticker Gallery',
    settings: 'Settings',
    profile_photo: 'Profile Photo',
    name: 'Name',
    wechat_id: 'WeChat ID',
    my_qr_code: 'My QR Code',
    more: 'More',
    incoming_call_ringtone: 'Incoming Call Ringtone',
    set_name: 'Set Name',
    set_wxid: 'Set WeChat ID',
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    enter_name: 'Enter your name',
    enter_wxid: 'Enter new WeChat ID',
    wxid_hint: 'WeChat ID can only be changed once a year.',
    // Contacts
    new_friends: 'New Friends',
    group_chats: 'Group Chats',
    tags: 'Tags',
    official_accounts: 'Official Accounts',
    set_remark: 'Set Remark and Tag',
    remark: 'Remark',
    // Chat
    send: 'Send',
    hold_to_talk: 'Hold to Talk',
    voice_message: 'Voice Message',
    // Settings
    account_security: 'Account Security',
    message_notifications: 'Message Notifications',
    friends_permissions: "Friends' Permissions",
    personal_info_collection: 'Personal Information Collection List',
    third_party_lists: 'Third-Party Lists',
    general: 'General',
    privacy: 'Privacy',
    help_feedback: 'Help & Feedback',
    about: 'About WeChat',
    switch_account: 'Switch Account',
    log_out: 'Log Out',
    appearance: 'Appearance',
    dark_mode: 'Dark Mode',
    language: 'Language',
    font_size: 'Font Size',
    manage_storage: 'Manage Storage',
    tools: 'Tools',
    wechat_pay: 'WeChat Pay',
    system_default: 'System Default',
    off: 'Off',
    // Services
    money: 'Money',
    wallet: 'Wallet',
    financial_services: 'Financial Services',
    daily_services: 'Daily Services',
    travel_transport: 'Travel & Transportation',
    shopping_entertainment: 'Shopping & Entertainment',
    card_repay: 'Card Repay',
    wealth: 'Wealth',
    insurance: 'Insurance',
    stocks: 'Stocks',
    mobile_top_up: 'Mobile Top Up',
    utilities: 'Utilities',
    health: 'Health',
    public_services: 'Public Services',
    tencent_charity: 'Tencent Charity',
    ride_hailing: 'Ride Hailing',
    rail_flights: 'Rail & Flights',
    hotels: 'Hotels',
    bike_share: 'Bike Share',
    specials: 'Specials',
    movie_tickets: 'Movie Tickets',
    delivery: 'Delivery',
    flash_sales: 'Flash Sales',
    // Games & Features
    play: 'Play',
    popular: 'Popular',
    recommended: 'Recommended',
    friends_playing: 'Friends are playing',
    warm_home: 'Warm Home',
    // General
    back: 'Back',
    delete: 'Delete',
    messages: 'Messages',
    add_contacts: 'Add to Contacts'
  },
  zh: {
    // Tabs
    chats: '微信',
    contacts: '通讯录',
    discover: '发现',
    me: '我',
    // Headers
    wechat: '微信',
    // Discover
    moments: '朋友圈',
    channels: '视频号',
    scan: '扫一扫',
    shake: '摇一摇',
    top_stories: '看一看',
    search: '搜一搜',
    games: '游戏',
    music: '音乐',
    mini_programs: '小程序',
    // Me
    services: '服务',
    favorites: '收藏',
    sticker_gallery: '表情',
    settings: '设置',
    profile_photo: '头像',
    name: '名字',
    wechat_id: '微信号',
    my_qr_code: '我的二维码',
    more: '更多',
    incoming_call_ringtone: '来电铃声',
    set_name: '设置名字',
    set_wxid: '设置微信号',
    cancel: '取消',
    save: '保存',
    done: '完成',
    enter_name: '输入你的名字',
    enter_wxid: '输入新的微信号',
    wxid_hint: '微信号一年只能修改一次。',
    // Contacts
    new_friends: '新的朋友',
    group_chats: '群聊',
    tags: '标签',
    official_accounts: '公众号',
    set_remark: '设置备注和标签',
    remark: '备注名',
    // Chat
    send: '发送',
    hold_to_talk: '按住 说话',
    voice_message: '语音消息',
    // Settings
    account_security: '账号与安全',
    message_notifications: '新消息通知',
    friends_permissions: '朋友权限',
    personal_info_collection: '个人信息收集清单',
    third_party_lists: '第三方信息共享清单',
    general: '通用',
    privacy: '隐私',
    help_feedback: '帮助与反馈',
    about: '关于微信',
    switch_account: '切换账号',
    log_out: '退出登录',
    appearance: '外观',
    dark_mode: '深色模式',
    language: '语言',
    font_size: '字体大小',
    manage_storage: '存储空间',
    tools: '辅助功能',
    wechat_pay: '微信支付',
    system_default: '跟随系统',
    off: '已关闭',
    // Services
    money: '零钱',
    wallet: '钱包',
    financial_services: '金融理财',
    daily_services: '生活服务',
    travel_transport: '交通出行',
    shopping_entertainment: '购物娱乐',
    card_repay: '信用卡还款',
    wealth: '理财通',
    insurance: '保险服务',
    stocks: '证券',
    mobile_top_up: '手机充值',
    utilities: '生活缴费',
    health: '医疗健康',
    public_services: '城市服务',
    tencent_charity: '腾讯公益',
    ride_hailing: '出行服务',
    rail_flights: '火车票机票',
    hotels: '酒店',
    bike_share: '共享单车',
    specials: '特价好货',
    movie_tickets: '电影演出赛事',
    delivery: '外卖',
    flash_sales: '品牌特卖',
    // Games & Features
    play: '开始',
    popular: '热门推荐',
    recommended: '为你推荐',
    friends_playing: '好友在玩',
    warm_home: '暖暖家园',
    // General
    back: '返回',
    delete: '删除',
    messages: '发消息',
    add_contacts: '添加到通讯录'
  }
};

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Leo',
  avatar: 'https://picsum.photos/seed/me_cool/200/200',
  phone: '13800138000',
  wxid: 'hu2869790686',
  signature: 'Dream big, work hard. 🚀'
};

// Groups
export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: '相亲相爱一家人', // Family Group
    avatar: 'https://picsum.photos/seed/lotus_flower/200/200',
    members: ['me', '2', '17', '20'], // Me, Mom, Relative, Auntie
    notice: 'Family first! ❤️'
  },
  {
    id: 'g2',
    name: 'Project Alpha Team',
    avatar: 'https://picsum.photos/seed/tech_group/200/200',
    members: ['me', '3', '10', '19', '18'], // Me, Boss, Jack, HR Sara, Student Intern
    notice: 'No deployment on Fridays.'
  }
];

export const INITIAL_FRIENDS: User[] = [
  { id: '2', name: '妈', avatar: 'https://picsum.photos/seed/mom_flower/200/200', phone: '13900000002', wxid: 'mom_love', signature: '知足常乐，平安是福。🍎' }, 
  { id: '3', name: 'Boss', avatar: 'https://picsum.photos/seed/boss_suit/200/200', phone: '13900000003', wxid: 'boss_zhang', signature: 'Execution is everything.' },
  { id: '4', name: 'A01 置业顾问小王', avatar: 'https://picsum.photos/seed/agent_suit/200/200', phone: '13900000004', wxid: 'wang_estate', signature: '专业买房卖房，24小时在线' },
  { id: '5', name: 'momo', avatar: 'https://picsum.photos/seed/pink_dino/200/200', phone: '13900000005', wxid: 'momo_user', signature: 'momo大军一号' },
  { id: '6', name: '文件传输助手', avatar: 'https://picsum.photos/seed/folder_green/200/200', phone: '00000000000', wxid: 'file_transfer', signature: '' },
  { id: '7', name: 'AAA建材批发老李', avatar: 'https://picsum.photos/seed/worker_man/200/200', phone: '13900000007', wxid: 'li_construction', signature: '诚信经营，量大从优' },
  // Fixed Wife's avatar to be feminine
  { id: '8', name: '老婆', avatar: 'https://loremflickr.com/200/200/girl,beautiful?lock=8', phone: '13900000008', wxid: 'my_love', signature: 'Love you 3000 ❤️' },
  { id: '9', name: '菜鸟驿站', avatar: 'https://picsum.photos/seed/box_delivery/200/200', phone: '13900000009', wxid: 'cainiao', signature: '营业时间 9:00-21:00' },
  { id: '10', name: '卷王 (Jack)', avatar: 'https://picsum.photos/seed/geek_man/200/200', phone: '13900000010', wxid: 'jack_work', signature: 'Talk is cheap, show me the code.' },
  { id: '11', name: 'Tony老师', avatar: 'https://picsum.photos/seed/hair_stylist/200/200', phone: '13900000011', wxid: 'tony_hair', signature: '首席设计总监，周一公休' },
  { id: '12', name: '房东', avatar: 'https://picsum.photos/seed/landlord/200/200', phone: '13900000012', wxid: 'landlord', signature: '记得按时交租' },
  { id: '13', name: '小学同学', avatar: 'https://picsum.photos/seed/old_friend/200/200', phone: '13900000013', wxid: 'old_classmate', signature: '时光不老，我们不散' },
  { id: '14', name: 'A.日韩代购大表姐', avatar: 'https://loremflickr.com/200/200/woman,shopping?lock=14', phone: '13900000014', wxid: 'daigou_sis', signature: '人肉背回，保真！' },
  { id: '15', name: '平安保险-小刘', avatar: 'https://picsum.photos/seed/insurance/200/200', phone: '13900000015', wxid: 'insurance_liu', signature: '为您的一生保驾护航' },
  { id: '16', name: '健身教练Mark', avatar: 'https://loremflickr.com/200/200/man,muscle?lock=16', phone: '13900000016', wxid: 'mark_fit', signature: 'No Pain No Gain 💪' },
  { id: '17', name: '快乐每一天', avatar: 'https://picsum.photos/seed/flower_lotus/200/200', phone: '13900000017', wxid: 'happy_daily', signature: '笑口常开' },
  { id: '18', name: 'L', avatar: 'https://picsum.photos/seed/anime_dark/200/200', phone: '13900000018', wxid: 'l_notebook', signature: '...' },
  { id: '19', name: 'HR Sara', avatar: 'https://loremflickr.com/200/200/woman,office?lock=19', phone: '13900000019', wxid: 'hr_sara', signature: 'Recruiting top talent!' },
  { id: '20', name: '王阿姨 (广场舞)', avatar: 'https://picsum.photos/seed/scarf_lady/200/200', phone: '13900000020', wxid: 'auntie_wang', signature: '最美夕阳红' },
  { id: '21', name: '修车小张', avatar: 'https://picsum.photos/seed/car_repair/200/200', phone: '13900000021', wxid: 'zhang_cars', signature: '专业汽修' },
  { id: '22', name: '班长', avatar: 'https://picsum.photos/seed/book/200/200', phone: '13900000022', wxid: 'class_monitor', signature: '好好学习，天天向上' },
  { id: '23', name: 'AAA 纯手工水饺', avatar: 'https://picsum.photos/seed/dumplings_ad/200/200', phone: '13900000023', wxid: 'dumplings_sell', signature: '皮薄馅大，童叟无欺' },
  { id: '24', name: '铲屎官', avatar: 'https://picsum.photos/seed/cat_face/200/200', phone: '13900000024', wxid: 'cat_slave', signature: 'Meow~ 🐱' },
  
  // NEW ACG CHARACTERS
  { id: '30', name: '鹿目圆香', avatar: 'https://loremflickr.com/200/200/anime,girl,pink?lock=30', phone: '13900000030', wxid: 'madoka_magica', signature: '不要放弃希望！✨' },
  { id: '31', name: 'Asuka', avatar: 'https://loremflickr.com/200/200/anime,girl,red?lock=31', phone: '13900000031', wxid: 'asuka_langley', signature: '你是笨蛋吗？' },
  { id: '32', name: 'Rei', avatar: 'https://loremflickr.com/200/200/anime,girl,blue?lock=32', phone: '13900000032', wxid: 'ayanami_00', signature: '...' },
];

export const MOCK_MESSAGES: Message[] = [
  // Boss - Work pressure
  { id: 'm1', senderId: '3', receiverId: 'me', content: '小Leo，那个PPT做好了吗？', type: 'text', timestamp: Date.now() - 300000, read: false },
  
  // Mom - Care
  { id: 'm2', senderId: '2', receiverId: 'me', content: '儿砸，最近天气冷了，记得穿秋裤啊！', type: 'audio', duration: 12, timestamp: Date.now() - 1800000, read: true }, 
  
  // Wife - Dinner
  { id: 'm3', senderId: 'me', receiverId: '8', content: '今晚吃火锅吗？', type: 'text', timestamp: Date.now() - 3600000, read: true },
  { id: 'm4', senderId: '8', receiverId: 'me', content: '好呀，记得买点虾滑 🦐', type: 'text', timestamp: Date.now() - 3500000, read: false },

  // Group Messages - Family (g1)
  { id: 'gm1', senderId: '2', receiverId: 'g1', content: '震惊！常吃这个竟然会致癌...', type: 'text', timestamp: Date.now() - 7200000, read: true },
  { id: 'gm2', senderId: '17', receiverId: 'g1', content: '收到！谢谢嫂子分享。', type: 'text', timestamp: Date.now() - 7100000, read: true },
  
  // Group Messages - Work (g2)
  { id: 'gm3', senderId: '3', receiverId: 'g2', content: '@All Today\'s meeting is cancelled.', type: 'text', timestamp: Date.now() - 3600000, read: true },
  { id: 'gm4', senderId: '10', receiverId: 'g2', content: 'Received. Back to coding.', type: 'text', timestamp: Date.now() - 3500000, read: true },

  // momo
  { id: 'm9', senderId: '5', receiverId: 'me', content: '尊嘟假嘟 O.o', type: 'text', timestamp: Date.now() - 60000, read: false },
  
  // New Anime Characters
  { id: 'm30', senderId: '30', receiverId: 'me', content: '早安！今天也要元气满满哦！(≧∇≦)/', type: 'text', timestamp: Date.now() - 5000, read: false },
  { id: 'm31', senderId: '31', receiverId: 'me', content: '笨蛋！快点回消息啊！💢', type: 'text', timestamp: Date.now() - 15000, read: false },
  { id: 'm32', senderId: '32', receiverId: 'me', content: '...', type: 'text', timestamp: Date.now() - 25000, read: false },

  // Filling up chat list for everyone else
  { id: 'm_agent', senderId: '4', receiverId: 'me', content: '哥，那套房子降价了！这周末来看吗？', type: 'text', timestamp: Date.now() - 400000, read: true },
  { id: 'm_file', senderId: 'me', receiverId: '6', content: '[File] project_backup.zip', type: 'text', timestamp: Date.now() - 800000, read: true },
  { id: 'm_li', senderId: '7', receiverId: 'me', content: '老板，你要的水泥到了。', type: 'text', timestamp: Date.now() - 1200000, read: false },
  { id: 'm_cainiao', senderId: '9', receiverId: 'me', content: '取件码：8-2-3012，请及时取件。', type: 'text', timestamp: Date.now() - 2000000, read: true },
  { id: 'm_jack', senderId: '10', receiverId: 'me', content: 'PR merged. Check staging.', type: 'text', timestamp: Date.now() - 3000000, read: true },
  { id: 'm_tony', senderId: '11', receiverId: 'me', content: '帅哥，该剪头发了，最近有活动办卡充500送200', type: 'text', timestamp: Date.now() - 5000000, read: true },
  { id: 'm_landlord', senderId: '12', receiverId: 'me', content: '下个月房租记得转我。', type: 'text', timestamp: Date.now() - 6000000, read: true },
  { id: 'm_classmate', senderId: '13', receiverId: 'me', content: '老同学，听说你在这个城市，出来聚聚？', type: 'text', timestamp: Date.now() - 7000000, read: true },
  { id: 'm_daigou', senderId: '14', receiverId: 'me', content: '亲，神仙水到了，给你寄过去？', type: 'text', timestamp: Date.now() - 8000000, read: false },
  { id: 'm_ins', senderId: '15', receiverId: 'me', content: '了解一下最新的重疾险吗？', type: 'text', timestamp: Date.now() - 9000000, read: true },
  { id: 'm_gym', senderId: '16', receiverId: 'me', content: 'Bro, leg day today? 🦵', type: 'text', timestamp: Date.now() - 10000000, read: true },
  { id: 'm_l', senderId: '18', receiverId: 'me', content: 'Did you see the new episode?', type: 'text', timestamp: Date.now() - 11000000, read: false },
  { id: 'm_sara', senderId: '19', receiverId: 'me', content: 'Hi Leo, are you open to new opportunities?', type: 'text', timestamp: Date.now() - 12000000, read: true },
  { id: 'm_auntie', senderId: '20', receiverId: 'me', content: '[Video] 广场舞教学.mp4', type: 'text', timestamp: Date.now() - 13000000, read: true },
  { id: 'm_car', senderId: '21', receiverId: 'me', content: '机油该换了。', type: 'text', timestamp: Date.now() - 14000000, read: true },
  { id: 'm_mon', senderId: '22', receiverId: 'me', content: '收到请回复。', type: 'text', timestamp: Date.now() - 15000000, read: true },
  { id: 'm_dump', senderId: '23', receiverId: 'me', content: '韭菜鸡蛋馅的还有两斤。', type: 'text', timestamp: Date.now() - 16000000, read: true },
  { id: 'm_cat', senderId: '24', receiverId: 'me', content: '喵？', type: 'text', timestamp: Date.now() - 17000000, read: true },

];

export const MOCK_POSTS_INITIAL: Post[] = [
  {
    id: 'p1',
    authorId: '2', 
    content: '今天是立冬，大家记得吃饺子！转发这条锦鲤，好运连连！🎏 [Blessing][Blessing]',
    images: ['https://loremflickr.com/400/300/dumpling,food?lock=1'],
    likes: ['2', 'me', '3', '7', '17', '20'],
    comments: [
      { id: 'c2', userId: 'me', userName: 'Leo', content: '妈，我晚上回去吃。', timestamp: Date.now() - 1800000 },
      { id: 'c2a', userId: '20', userName: '王阿姨 (广场舞)', content: '真不错，改天一起去跳舞呀！', timestamp: Date.now() - 1500000 }
    ],
    timestamp: Date.now() - 7200000
  },
  {
    id: 'p_tech_1',
    authorId: '10',
    content: '凌晨三点的科技园，见过吗？又是通宵发布版本的一天。Bug fix done. 🚀 #程序员 #加班',
    images: ['https://loremflickr.com/400/400/code,screen?lock=99', 'https://loremflickr.com/400/400/office,night?lock=98'],
    likes: ['3', 'me', '19'],
    comments: [
      { id: 'c_tech_1', userId: '3', userName: 'Boss', content: '辛苦了，明天早上准时复盘。', timestamp: Date.now() - 6000000 },
      { id: 'c_tech_2', userId: '19', userName: 'HR Sara', content: '注意身体，调休记得提流程。', timestamp: Date.now() - 5000000 }
    ],
    timestamp: Date.now() - 8000000 
  },
  {
    id: 'p2',
    authorId: '5',
    content: '无语死了一整个... 避雷这家店，服务态度巨差🙄 再也不来了！😤',
    images: [],
    likes: ['10', '13', '18'],
    comments: [
        { id: 'c_momo_1', userId: '13', userName: '小学同学', content: '哪家店？求避雷', timestamp: Date.now() - 11000000 }
    ],
    timestamp: Date.now() - 12000000
  },
  {
    id: 'p30_1',
    authorId: '30',
    content: '魔法少女的茶会！🍰 今天也是充满希望的一天呢！✨ #Cosplay',
    images: ['https://loremflickr.com/400/400/anime,cosplay?lock=30'],
    likes: ['31', 'me'],
    comments: [],
    timestamp: Date.now() - 13000000
  },
  {
    id: 'p_sales_1',
    authorId: '4',
    content: '【急售】业主出国急售！低于市场价50万！这种好房哪里找？手慢无！🏠 看房随时联系！',
    images: ['https://loremflickr.com/400/300/apartment,livingroom?lock=2', 'https://loremflickr.com/400/300/bedroom?lock=3', 'https://loremflickr.com/400/300/kitchen?lock=4'],
    likes: ['7', '15', '21'],
    comments: [],
    timestamp: Date.now() - 15000000
  },
  {
    id: 'p_cat_1',
    authorId: '24',
    content: '主子今天心情好，赏了个脸给摸摸。🐱',
    images: ['https://loremflickr.com/400/400/cat,kitten?lock=55', 'https://loremflickr.com/400/400/cat,sleeping?lock=56'],
    likes: ['5', '8', '11', 'me'],
    comments: [
         { id: 'c_cat_1', userId: '8', userName: '老婆', content: '好可爱呀！！！我们要不要也养一只？', timestamp: Date.now() - 16000000 }
    ],
    timestamp: Date.now() - 18000000
  },
  {
    id: 'p_food_1',
    authorId: '8',
    content: '和闺蜜的下午茶，这家提拉米苏绝绝子！🍰☕️ 又是长胖的一天～',
    images: ['https://loremflickr.com/400/400/cake,dessert?lock=6', 'https://loremflickr.com/400/400/coffee,latte?lock=7', 'https://loremflickr.com/400/400/selfie,girl?lock=8'],
    likes: ['me', '2', '5', '11', '14', '19'],
    comments: [
      { id: 'c5', userId: 'me', userName: 'Leo', content: '给我留一块！', timestamp: Date.now() - 40000000 },
      { id: 'c5b', userId: '8', userName: '老婆', content: '早就吃完啦😝', timestamp: Date.now() - 39000000 }
    ],
    timestamp: Date.now() - 43200000
  },
  {
    id: 'p_gym_1',
    authorId: '16', // Gym Bro
    content: 'Today\'s workout. No pain no gain. 干就完事了！🏋️ #Fitness #GymLife',
    images: ['https://loremflickr.com/400/400/gym,weights?lock=18'],
    likes: ['me', '4', '10'],
    comments: [],
    timestamp: Date.now() - 45000000
  },
  {
    id: 'p_ad_1',
    authorId: '14', // Daigou
    content: '🇯🇵 人肉背回，CPB隔离，SKII神仙水，数量有限，先到先得！拼手速的时候到了！💄💋',
    images: ['https://loremflickr.com/400/400/cosmetics,makeup?lock=22', 'https://loremflickr.com/400/400/shopping,bag?lock=23'],
    likes: ['8', '19'],
    comments: [
        { id: 'c_ad_1', userId: '8', userName: '老婆', content: '亲，神仙水多少钱？', timestamp: Date.now() - 50000000 }
    ],
    timestamp: Date.now() - 55000000
  },
  {
    id: 'p_nature_1',
    authorId: '17', // Auntie
    content: '早安！新的一天，愿你被世界温柔以待。🌺🌻🌹 [Rose][Rose][Sun]',
    images: ['https://loremflickr.com/400/300/flower,garden?lock=88'],
    likes: ['2', '20', '7'],
    comments: [],
    timestamp: Date.now() - 86400000
  },
  {
    id: 'p_music_1',
    authorId: '18', // L
    content: 'Sharing a song. 🎵',
    images: [], // Pure text sharing song
    likes: ['10'],
    comments: [],
    timestamp: Date.now() - 90000000
  }
];