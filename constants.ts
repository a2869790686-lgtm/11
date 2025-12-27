
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
  signature: '正在被五个人同时宠爱着。'
};

export const INITIAL_FRIENDS: User[] = [
  // --- 光与夜之恋 五大男主 ---
  { id: 'charlie_su', name: '查理苏', avatar: 'https://loremflickr.com/200/200/man,elegant,doctor?lock=777', phone: '18888888888', wxid: 'Charlie_Masterpiece', signature: '只有查理苏，才能超越查理苏。' },
  { id: 'sariel_qi', name: '齐司礼', avatar: 'https://loremflickr.com/200/200/man,whitehair,elegant?lock=111', phone: '18888888811', wxid: 'Sariel_Qi', signature: '不要在无谓的事情上浪费我的时间。' },
  { id: 'osborn_xiao', name: '萧逸', avatar: 'https://loremflickr.com/200/200/man,cool,racer?lock=222', phone: '18888888822', wxid: 'Osborn_Xiao', signature: '我的赛车后座，永远只为你留。' },
  { id: 'evan_lu', name: '陆沉', avatar: 'https://loremflickr.com/200/200/man,suit,ceo?lock=333', phone: '18888888833', wxid: 'Evan_Lu', signature: '有些深渊，是值得跳下去的。' },
  { id: 'jesse_xia', name: '夏鸣星', avatar: 'https://loremflickr.com/200/200/man,idol,singer?lock=444', phone: '18888888844', wxid: 'Jesse_Xia', signature: '大小姐，还记得我们的那个夏天吗？' },
  
  // --- 亲友与同事 ---
  { id: '2', name: '妈', avatar: 'https://picsum.photos/seed/mom/200/200', phone: '13900000002', wxid: 'mom_love', signature: '平安是福。🍎' },
  { id: '3', name: 'Boss张', avatar: 'https://picsum.photos/seed/boss/200/200', phone: '13900000003', wxid: 'boss_zhang', signature: '细节决定成败。' },
  { id: '43', name: '刘伯伯(二叔)', avatar: 'https://loremflickr.com/200/200/man,rich?lock=43', phone: '13900000043', wxid: 'cement_king_888', signature: '专业承接水泥黄沙。' },
  { id: '58', name: '大姨', avatar: 'https://loremflickr.com/200/200/woman,elder?lock=58', phone: '13900000058', wxid: 'auntie_love', signature: '快乐生活每一天。' },
  { id: '71', name: '表哥-张强', avatar: 'https://loremflickr.com/200/200/man,casual?lock=71', phone: '13900000071', wxid: 'qiang_brother', signature: '承接广告推广。' },
  { id: '61', name: '实习生小周', avatar: 'https://loremflickr.com/200/200/girl,student?lock=61', phone: '13900000061', wxid: 'intern_zhou', signature: '努力学习中，多指教！' },
  { id: '72', name: '甲方-王经理', avatar: 'https://loremflickr.com/200/200/man,suit?lock=72', phone: '13900000072', wxid: 'party_a_wang', signature: '下班时间不谈工作。' },
  { id: '101', name: '微商-小丽(代购)', avatar: 'https://loremflickr.com/200/200/girl,fashion?lock=101', phone: '13900000101', wxid: 'daigou_li', signature: '韩国直邮，只做正品。' },
  { id: '56', name: 'Tony老师', avatar: 'https://loremflickr.com/200/200/man,hair?lock=56', phone: '13900000056', wxid: 'tony_001', signature: '发型决定颜值。' }
];

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: '相亲相爱一家人', avatar: 'https://picsum.photos/seed/lotus/200/200', members: ['me', '2', '43', '58', '71'], notice: '过年记得回家吃饭！' },
  { id: 'g2', name: '产品部沟通群', avatar: 'https://picsum.photos/seed/work/200/200', members: ['me', '3', '61', '72'], notice: '禁止发表情包。' }
];

export const MOCK_MESSAGES: Message[] = [
  // 未读消息 1：查理苏 (1条)
  { id: 'm_c1', senderId: 'charlie_su', receiverId: 'me', content: '未婚妻，今天看到的一朵玫瑰很像你，所以我把它买下来了。', type: 'text', timestamp: Date.now() - 3600000, read: false },
  
  // 已读消息：齐司礼
  { id: 'm_s1', senderId: 'sariel_qi', receiverId: 'me', content: '笨鸟，昨天的稿子漏洞百出，重做。', type: 'text', timestamp: Date.now() - 7200000, read: true },
  
  // 未读消息：Boss张 (2条)
  { id: 'm_b1', senderId: '3', receiverId: 'me', content: '方案改好了吗？明天开会要用。', type: 'text', timestamp: Date.now() - 600000, read: false },
  { id: 'm_b2', senderId: '3', receiverId: 'me', content: '人呢？收到回复一下。', type: 'text', timestamp: Date.now() - 300000, read: false },
  
  // 未读消息：代购小丽 (3条 - 营销轰炸)
  { id: 'm_l1', senderId: '101', receiverId: 'me', content: '亲，韩妆到货了，最后五套！', type: 'text', timestamp: Date.now() - 5000000, read: false },
  { id: 'm_l2', senderId: '101', receiverId: 'me', content: '快看朋友圈，超多实拍图。', type: 'text', timestamp: Date.now() - 4000000, read: false },
  { id: 'm_l3', senderId: '101', receiverId: 'me', content: '全场顺丰包邮，错过等一年。', type: 'text', timestamp: Date.now() - 3000000, read: false },

  // 未读消息：群聊 - 家人群 (5条)
  { id: 'm_g1', senderId: '43', receiverId: 'g1', content: '转发文章：[震惊！长期吃这种蔬菜竟然有毒...]', type: 'text', timestamp: Date.now() - 800000, read: false },
  { id: 'm_g2', senderId: '58', receiverId: 'g1', content: '老二又在发这些没用的。', type: 'text', timestamp: Date.now() - 750000, read: false },
  { id: 'm_g3', senderId: '2', receiverId: 'g1', content: '晚上回来吃饭不？', type: 'text', timestamp: Date.now() - 700000, read: false },
  { id: 'm_g4', senderId: '71', receiverId: 'g1', content: '赞', type: 'text', timestamp: Date.now() - 650000, read: false },
  { id: 'm_g5', senderId: '2', receiverId: 'g1', content: '@未婚妻 怎么没反应？', type: 'text', timestamp: Date.now() - 600000, read: false },

  // 未读红包消息：萧逸
  { id: 'm_o1', senderId: 'osborn_xiao', receiverId: 'me', content: '小朋友，去喝奶茶。', type: 'red_packet', amount: '52.00', timestamp: Date.now() - 2000000, read: false }
];

export const MOCK_POSTS_INITIAL: Post[] = [
  { id: 'p_charlie', authorId: 'charlie_su', content: '今日在手术室完成了一场旷世奇作。', images: ['https://loremflickr.com/400/300/medical?lock=1'], likes: ['me', 'sariel_qi'], comments: [], timestamp: Date.now() - 3600000 },
  { id: 'p_mom', authorId: '2', content: '早起呼吸新鲜空气。☀️', images: ['https://loremflickr.com/400/300/park?lock=2'], likes: ['me', '58'], comments: [], timestamp: Date.now() - 14400000 },
  { id: 'p_tony', authorId: '56', content: '今天又剪了一个帅气的发型，剪头发找我！✂️', images: ['https://loremflickr.com/400/300/hair?lock=56'], likes: [], comments: [], timestamp: Date.now() - 7200000 }
];
