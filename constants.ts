
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
  
  // --- 亲友与同事 (核心列表) ---
  { id: '2', name: '妈', avatar: 'https://picsum.photos/seed/mom/200/200', phone: '13900000002', wxid: 'mom_love', signature: '平安是福。🍎' },
  { id: '3', name: 'Boss张', avatar: 'https://picsum.photos/seed/boss/200/200', phone: '13900000003', wxid: 'boss_zhang', signature: '细节决定成败。' },
  { id: '43', name: '刘伯伯(二叔)', avatar: 'https://loremflickr.com/200/200/man,rich?lock=43', phone: '13900000043', wxid: 'cement_king_888', signature: '专业承接水泥黄沙。' },
  { id: '58', name: '大姨', avatar: 'https://loremflickr.com/200/200/woman,elder?lock=58', phone: '13900000058', wxid: 'auntie_love', signature: '快乐生活每一天。' },
  { id: '71', name: '表哥-张强', avatar: 'https://loremflickr.com/200/200/man,casual?lock=71', phone: '13900000071', wxid: 'qiang_brother', signature: '承接广告推广。' },
  { id: '61', name: '实习生小周', avatar: 'https://loremflickr.com/200/200/girl,student?lock=61', phone: '13900000061', wxid: 'intern_zhou', signature: '努力学习中，多指教！' },
  { id: '72', name: '甲方-王经理', avatar: 'https://loremflickr.com/200/200/man,suit?lock=72', phone: '13900000072', wxid: 'party_a_wang', signature: '下班时间不谈工作。' },
  { id: '73', name: '人事-赵姐', avatar: 'https://loremflickr.com/200/200/woman,suit?lock=73', phone: '13900000073', wxid: 'hr_zhao', signature: '招聘季。' },
  { id: '74', name: '行政-小美', avatar: 'https://loremflickr.com/200/200/girl,office?lock=74', phone: '13900000074', wxid: 'admin_beauty', signature: '又是想退休的一天。' },
  { id: '62', name: '老同学张伟', avatar: 'https://loremflickr.com/200/200/man,casual?lock=62', phone: '13900000062', wxid: 'zhang_wei', signature: '那年的夏天。' },
  { id: '75', name: '大学寝室长-刘萌', avatar: 'https://loremflickr.com/200/200/girl,cute?lock=75', phone: '13900000075', wxid: 'meng_meng', signature: '谁有PPT？' },
  { id: '76', name: '高中前桌-阿强', avatar: 'https://loremflickr.com/200/200/man,young?lock=76', phone: '13900000076', wxid: 'strong_strong', signature: '坚持健身，改变自己。' },
  { id: '77', name: '驴友-老驴', avatar: 'https://loremflickr.com/200/200/man,travel?lock=77', phone: '13900000077', wxid: 'old_donkey', signature: '身体和灵魂都在路上。' },
  
  // --- 生活服务 ---
  { id: '51', name: '美团小哥-王师傅', avatar: 'https://loremflickr.com/200/200/man,worker?lock=51', phone: '13900000051', wxid: 'meituan_wang', signature: '风雨无阻。' },
  { id: '52', name: '社区团长-陈姐', avatar: 'https://loremflickr.com/200/200/woman,market?lock=52', phone: '13900000052', wxid: 'tuan_zhang', signature: '鸡蛋新鲜。' },
  { id: '54', name: '物业小赵', avatar: 'https://loremflickr.com/200/200/man,security?lock=54', phone: '13900000054', wxid: 'wuye_zhao', signature: '报修请私信。' },
  { id: '56', name: 'Tony老师', avatar: 'https://loremflickr.com/200/200/man,hair?lock=56', phone: '13900000056', wxid: 'tony_001', signature: '发型决定颜值。' },
  { id: '57', name: '中介小张', avatar: 'https://loremflickr.com/200/200/man,agent?lock=57', phone: '13900000057', wxid: 'house_zhang', signature: '静安区大量好房。' },
  { id: '60', name: '顺丰快递员', avatar: 'https://loremflickr.com/200/200/man,delivery?lock=60', phone: '13900000060', wxid: 'sf_express', signature: '极速送达。' },
  { id: '78', name: '健身房-李教练', avatar: 'https://loremflickr.com/200/200/man,fitness?lock=78', phone: '13900000078', wxid: 'beast_mode', signature: '核心力量。' },
  { id: '79', name: '水管工-老李', avatar: 'https://loremflickr.com/200/200/man,plumber?lock=79', phone: '13900000079', wxid: 'plumber_li', signature: '随叫随到。' },
  { id: '80', name: '代驾-王师傅', avatar: 'https://loremflickr.com/200/200/man,driver?lock=80', phone: '13900000080', wxid: 'driver_wang', signature: '拒绝酒驾。' }
];

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: '相亲相爱一家人', avatar: 'https://picsum.photos/seed/lotus/200/200', members: ['me', '2', '43', '58', '71'], notice: '过年记得回家吃饭！' },
  { id: 'g2', name: '产品部沟通群', avatar: 'https://picsum.photos/seed/work/200/200', members: ['me', '3', '61', '73', '74'], notice: '禁止发表情包。' }
];

const generateMessages = () => {
  const now = Date.now();
  const msgs: Message[] = [];
  
  // 为全员生成初始对话，确保列表长度
  INITIAL_FRIENDS.forEach((f, i) => {
    const isLead = ['charlie_su', 'sariel_qi', 'osborn_xiao', 'evan_lu', 'jesse_xia'].includes(f.id);
    const unread = isLead ? Math.floor(Math.random() * 5) + 1 : (Math.random() > 0.6 ? 1 : 0);
    
    // 基础消息
    msgs.push({
      id: `m_${f.id}`,
      senderId: f.id,
      receiverId: 'me',
      content: isLead ? `[专属对话] 我在想你，你想我吗？` : `你好，最近怎么样？`,
      type: 'text',
      timestamp: now - (i * 10000),
      read: unread === 0
    });
    
    // 如果有更多未读消息
    if (unread > 1) {
       for(let j=1; j<unread; j++) {
          msgs.push({
            id: `m_${f.id}_${j}`,
            senderId: f.id,
            receiverId: 'me',
            content: `这是第${j}条未读消息内容...`,
            type: 'text',
            timestamp: now - (i * 10000) + j,
            read: false
          });
       }
    }
  });

  return msgs.sort((a, b) => b.timestamp - a.timestamp);
};

export const MOCK_MESSAGES: Message[] = generateMessages();

export const MOCK_POSTS_INITIAL: Post[] = [
  { id: 'p_charlie', authorId: 'charlie_su', content: '今日在手术室完成了一场艺术品。', images: ['https://loremflickr.com/400/300/medical?lock=1'], likes: ['me', 'sariel_qi'], comments: [], timestamp: Date.now() - 3600000 },
  { id: 'p_mom', authorId: '2', content: '今天的天气不错。', images: ['https://picsum.photos/400/300?random=2'], likes: ['me', '58'], comments: [], timestamp: Date.now() - 15000000 }
];
