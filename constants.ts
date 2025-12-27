
import { User, Post, Message, Group } from './types';

export const TRANSLATIONS = {
  en: {
    wechat: 'WeChat', chats: 'Chats', contacts: 'Contacts', discover: 'Discover', me: 'Me', search: 'Search', moments: 'Moments', scan: 'Scan', shake: 'Shake', top_stories: 'Top Stories', games: 'Games', mini_programs: 'Mini Programs', services: 'Services', favorites: 'Favorites', sticker_gallery: 'Sticker Gallery', settings: 'Settings', log_out: 'Log Out', privacy: 'Privacy', general: 'General', new_friends: 'New Friends', group_chats: 'Group Chats', tags: 'Tags', official_accounts: 'Official Accounts'
  },
  zh: {
    wechat: '微信', chats: '微信', contacts: '通讯录', discover: '发现', me: '我', search: '搜索', moments: '朋友圈', scan: '扫一扫', shake: '摇一摇', top_stories: '看一看', games: '游戏', mini_programs: '小程序', services: '服务', favorites: '收藏', sticker_gallery: '表情', settings: '设置', log_out: '退出登录', privacy: '隐私', general: '通用', new_friends: '新的朋友', group_chats: '群聊', tags: '标签', official_accounts: '公众号'
  }
};

export const CURRENT_USER: User = {
  id: 'me', name: '未婚妻', avatar: 'https://loremflickr.com/200/200/girl,cute?lock=100', phone: '13800138000', wxid: 'lucky_one', signature: '正在被五个人同时宠爱着。'
};

export const INITIAL_FRIENDS: User[] = [
  // --- 光与夜之恋 (置顶) ---
  { id: 'charlie_su', name: '查理苏', avatar: 'https://loremflickr.com/200/200/man,elegant,doctor?lock=777', phone: '18888888888', wxid: 'Charlie_Masterpiece', signature: '只有查理苏，才能超越查理苏。' },
  { id: 'sariel_qi', name: '齐司礼', avatar: 'https://loremflickr.com/200/200/man,whitehair,elegant?lock=111', phone: '18888888811', wxid: 'Sariel_Qi', signature: '不要在无谓的事情上浪费我的时间。' },
  { id: 'osborn_xiao', name: '萧逸', avatar: 'https://loremflickr.com/200/200/man,cool,racer?lock=222', phone: '18888888822', wxid: 'Osborn_Xiao', signature: '我的赛车后座，永远只为你留。' },
  { id: 'evan_lu', name: '陆沉', avatar: 'https://loremflickr.com/200/200/man,suit,ceo?lock=333', phone: '18888888833', wxid: 'Evan_Lu', signature: '有些深渊，是值得跳下去的。' },
  { id: 'jesse_xia', name: '夏鸣星', avatar: 'https://loremflickr.com/200/200/man,idol,singer?lock=444', phone: '18888888844', wxid: 'Jesse_Xia', signature: '大小姐，还记得我们的那个夏天吗？' },
  
  // --- 社会群像 (30+) ---
  { id: 'npc_mom', name: '妈', avatar: 'https://picsum.photos/seed/mom/200/200', phone: '13900000002', wxid: 'mom_love', signature: '平安是福。🍎' },
  { id: 'npc_dad', name: '老爸', avatar: 'https://loremflickr.com/200/200/man,old?lock=1', phone: '13900000001', wxid: 'dad_silent', signature: '知足常乐。' },
  { id: 'npc_aunt', name: '二姑', avatar: 'https://loremflickr.com/200/200/woman,middleaged?lock=99', phone: '13900000099', wxid: 'aunt_matchmaker', signature: '相亲找我，包你满意。' },
  { id: 'npc_boss', name: 'Boss张', avatar: 'https://picsum.photos/seed/boss/200/200', phone: '13900000003', wxid: 'boss_zhang', signature: '细节决定成败。' },
  { id: 'npc_hr', name: 'HR-Linda', avatar: 'https://loremflickr.com/200/200/woman,office?lock=3', phone: '13900000005', wxid: 'hr_linda', signature: '招人招人，简历砸过来。' },
  { id: 'npc_wang', name: '同事小王', avatar: 'https://loremflickr.com/200/200/man,office?lock=4', phone: '13900000006', wxid: 'wang_work', signature: '周五快点到。' },
  { id: 'npc_li', name: '甲方李总', avatar: 'https://loremflickr.com/200/200/man,rich?lock=5', phone: '13900000007', wxid: 'li_client', signature: '方案再改改。' },
  { id: 'npc_delivery', name: '顺丰小陈', avatar: 'https://loremflickr.com/200/200/man,worker?lock=12', phone: '13900000012', wxid: 'express_chen', signature: '快递送货上门。' },
  { id: 'npc_landlord', name: '房东李姐', avatar: 'https://loremflickr.com/200/200/woman,rich?lock=88', phone: '13900000088', wxid: 'landlord_li', signature: '交房租了。' },
  { id: 'npc_tony', name: 'Tony老师', avatar: 'https://loremflickr.com/200/200/man,hair?lock=6', phone: '13900000015', wxid: 'tony_cut', signature: '懂你的发型师。' },
  { id: 'npc_property', name: '物业张师傅', avatar: 'https://loremflickr.com/200/200/man,uniform?lock=7', phone: '13900000016', wxid: 'zhang_repair', signature: '专业疏通修水管。' },
  { id: 'npc_dazhuang', name: '大壮(老同学)', avatar: 'https://loremflickr.com/200/200/man,fat?lock=34', phone: '13900000034', wxid: 'strong_brother', signature: '是兄弟就来砍我！' },
  { id: 'npc_qiqi', name: '闺蜜-琪琪', avatar: 'https://loremflickr.com/200/200/girl,cute?lock=8', phone: '13900000018', wxid: 'qiqi_sweet', signature: '火锅走起！' },
  { id: 'npc_ex', name: '前任(勿扰)', avatar: 'https://loremflickr.com/200/200/man,sad?lock=9', phone: '13900000019', wxid: 'sad_memories', signature: '回不去了。' },
  { id: 'npc_meimei', name: '代购-小美', avatar: 'https://loremflickr.com/200/200/girl,fashion?lock=10', phone: '13900000020', wxid: 'meimei_buy', signature: '正品直邮，童叟无欺。' },
  { id: 'npc_mike', name: '健身教练-Mike', avatar: 'https://loremflickr.com/200/200/man,muscle?lock=11', phone: '13900000021', wxid: 'mike_gym', signature: '自律给我自由。' },
  { id: 'npc_chen', name: '保险经理-陈哥', avatar: 'https://loremflickr.com/200/200/man,suit?lock=13', phone: '13900000022', wxid: 'chen_insurance', signature: '保障全家人的幸福。' },
  { id: 'npc_neighbor_wang', name: '隔壁老王', avatar: 'https://loremflickr.com/200/200/man,old?lock=14', phone: '13900000023', wxid: 'wang_neighbor', signature: '热心肠。' },
  { id: 'npc_teacher', name: '小学班主任', avatar: 'https://loremflickr.com/200/200/woman,teacher?lock=15', phone: '13900000024', wxid: 'teacher_wang', signature: '教书育人。' },
  { id: 'npc_pdd', name: '拼多多砍价群友', avatar: 'https://loremflickr.com/200/200/man,normal?lock=16', phone: '13900000025', wxid: 'pdd_friend', signature: '差0.01，帮帮。' },
  { id: 'npc_zhao', name: '饿了么小赵', avatar: 'https://loremflickr.com/200/200/man,rider?lock=17', phone: '13900000026', wxid: 'eleme_zhao', signature: '您的订单正在路上。' },
  { id: 'npc_scam', name: '北京固定电话', avatar: 'https://loremflickr.com/200/200/telephone?lock=18', phone: '010-88888888', wxid: 'scam_call', signature: '未知地区。' },
  { id: 'npc_agent', name: '房产中介小刘', avatar: 'https://loremflickr.com/200/200/man,suit?lock=30', phone: '13911112222', wxid: 'house_liiu', signature: '深耕本社区，买房找小刘。' },
  { id: 'npc_bank', name: '招商银行小王', avatar: 'https://loremflickr.com/200/200/woman,suit?lock=31', phone: '95555', wxid: 'cmb_wang', signature: '您的贴心金融管家。' },
  { id: 'npc_dentist', name: '牙医张博士', avatar: 'https://loremflickr.com/200/200/doctor?lock=32', phone: '13822223333', wxid: 'dentist_zhang', signature: '微笑从牙齿开始。' },
  { id: 'npc_yoga', name: '瑜伽老师Nana', avatar: 'https://loremflickr.com/200/200/woman,yoga?lock=33', phone: '13844445555', wxid: 'yoga_nana', signature: '呼吸，觉知。' },
  { id: 'npc_startup', name: '创业合伙人老赵', avatar: 'https://loremflickr.com/200/200/man,tech?lock=35', phone: '13866667777', wxid: 'startup_zhao', signature: 'All in AI。' },
  { id: 'npc_community', name: '居委会大妈', avatar: 'https://loremflickr.com/200/200/woman,old?lock=36', phone: '13888889999', wxid: 'community_helper', signature: '文明社区，你我共建。' },
  { id: 'npc_tutor', name: '考公搭子', avatar: 'https://loremflickr.com/200/200/man,student?lock=37', phone: '13100001111', wxid: 'study_mate', signature: '不上岸，不罢休。' },
  { id: 'npc_barber', name: '美发总监阿强', avatar: 'https://loremflickr.com/200/200/man,cool?lock=38', phone: '13122223333', wxid: 'hair_qiang', signature: '懂发型，更懂你。' }
];

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: '相亲相爱一家人', avatar: 'https://picsum.photos/seed/lotus/200/200', members: ['me', 'npc_mom', 'npc_aunt', 'npc_dad'], notice: '过年记得回家吃饭！' },
];

// --- 模拟高度真实且具有性格特征的“正在使用中”对话 ---
const NPC_FIRST_MESSAGES: Record<string, string[]> = {
  charlie_su: ["未婚妻，今晚的月色很美，但不及你万分之一。", "我为你准备了一份旷世奇作般的惊喜，期待吗？", "怎么不回消息？是在思考如何称赞我的完美吗？"],
  sariel_qi: ["这版设计简直是垃圾，重做。", "笨鸟，记得吃午饭。", "还没忙完？", "如果你这种错误再犯，我就要怀疑你的智商了。"],
  osborn_xiao: ["小朋友，赛车场见？", "刚才那圈很快，你应该看看。", "别总熬夜，对身体不好。", "下次带你去吹吹晚风。"],
  evan_lu: ["我的女孩，深渊在凝视你，而我在想你。", "红酒已醒好，等你。", "在这个充满选择的世界里，你是我唯一的必然。"],
  jesse_xia: ["大小姐，舞台剧首演一定要来哦！", "今天排练好累，想要个抱抱。", "你猜我刚才在剧场后台捡到了什么？"],
  npc_mom: ["记得多穿点衣服，天气预报说降温了。", "给你寄了点家里的腊肉，顺丰明天到。", "那个张阿姨家的儿子，你要不要加个微信聊聊？", "别总吃外卖，没营养。"],
  npc_dad: ["转账 500.00", "钱够花吗？", "你妈又在念叨你了，有空打个电话。"],
  npc_boss: ["PPT改好了吗？", "明天早上九点半开会，别迟到。", "方案那个细节再磨一下。", "收到请回复。"],
  npc_delivery: ["【顺丰速运】您的包裹已送达丰巢，取件码：8829。", "快递放你家门口了。", "有个到付的件，你在家吗？"],
  npc_landlord: ["房租该交了，这月水电一共342块。", "502又漏水了，你进屋看看是不是你家水管裂了。", "楼道里别堆杂物，物业在查。"],
  npc_pdd: ["是兄弟就帮我砍一刀！还差0.01！", "跪求砍一刀，帮我拿个戴森吹风机！", "最后一个名额了，帮帮忙，以后请你喝奶茶！"],
  npc_qiqi: ["姐妹，下班去吃那家网红火锅吗？", "我新看上一个包，帮我参考下！", "笑发财了，快看我分享给你的那个视频。", "尊嘟假嘟？我觉得他在骗你。"],
  npc_scam: ["您好，我是反诈中心王警官...", "您的个人征信存在异常，请配合处理。", "由于您在网上购买的商品存在质量问题，我们将为您双倍理赔。"],
  npc_bank: ["【招商银行】您的信用卡本月账单已出，请及时还款。", "您的账户余额变动提醒...", "尊敬的客户，为您推荐专属分期优惠。"],
  npc_agent: ["姐，最近看房吗？这套精装修性价比超高！", "有套急售的，单价直接降了3000！", "现在是入手的最好时机，错过拍大腿。"],
  npc_dazhuang: ["老同学，我要结婚了，记得来喝喜酒啊！", "在吗？帮我女儿投个票，12号，谢谢！", "最近在忙什么大项目呢？"],
  npc_barber: ["亲，最近头发长了吧？该来店里修剪了。", "我们新到了澳洲进口的护发套装，给你预留一套？"],
  npc_tutor: ["那道公基真题你做对了吗？", "我感觉这次申论题目有点偏。", "救命，我真的背不进去了..."],
  npc_colleague_wang: ["老板刚才脸色不太好，你小心点。", "中午拼个饭？想吃那家湘菜。"],
  npc_hr: ["入职材料带齐了吗？", "由于公司战略调整，我们需要谈谈。"],
  npc_yoga: ["记得准时来上普拉提，别总请假。", "呼吸...感受能量的流动。"],
  npc_startup: ["兄弟，我有个绝佳的创业点子，缺个合伙人。", "All in AI 是大趋势，错过了就是错过一个时代。"]
};

export const GENERATE_INITIAL_MESSAGES = (): Message[] => {
  const msgs: Message[] = [];
  INITIAL_FRIENDS.forEach(f => {
    const templates = NPC_FIRST_MESSAGES[f.id] || [`你好，我是${f.name}`, "在吗？"];
    
    // 强制多样化未读数 (0-6之间随机)
    const unreadCount = Math.floor(Math.random() * 7); 
    
    templates.forEach((content, i) => {
      // 倒数第 unreadCount 条及之后的设为未读
      const isUnread = (templates.length - i) <= unreadCount;
      
      msgs.push({
        id: `init_${f.id}_${i}`,
        senderId: f.id,
        receiverId: 'me',
        content,
        type: 'text',
        timestamp: Date.now() - (templates.length - i) * (Math.random() * 3600000 + 1800000), // 随机时间间隔
        read: !isUnread
      });
    });
  });
  return msgs;
};

export const MOCK_POSTS_INITIAL: Post[] = [
  { 
    id: 'p_charlie', authorId: 'charlie_su', 
    content: '在这个平凡的世界里，只有我的完美能为这间手术室增添一抹旷世奇作的色彩。未婚妻，你是否也在此时感受到了这种跨越空间的华丽？', 
    images: [], likes: ['me', 'evan_lu'], comments: [], timestamp: Date.now() - 7200000 
  },
  { 
    id: 'p_mom', authorId: 'npc_mom', 
    content: '《这几种食物千万不能空腹吃，为了健康转发给家人》[链接] 大家看看，很有道理。🍎🙏', 
    images: ['https://loremflickr.com/400/300/food,healthy?lock=1'], likes: ['npc_dad'], comments: [], timestamp: Date.now() - 14400000 
  },
  {
    id: 'p_tony', authorId: 'npc_tony',
    content: '今日剪裁：法式复古卷，气质拉满。喜欢的姐妹私信预约。💈✂️',
    images: ['https://loremflickr.com/400/300/hair?lock=55'], likes: [], comments: [], timestamp: Date.now() - 3600000
  }
];
