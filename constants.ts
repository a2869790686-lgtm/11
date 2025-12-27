
import { User, Post, Message, Group } from './types';

export const TRANSLATIONS = {
  en: { wechat: 'WeChat', chats: 'Chats', contacts: 'Contacts', discover: 'Discover', me: 'Me', search: 'Search', moments: 'Moments', scan: 'Scan', shake: 'Shake', top_stories: 'Top Stories', games: 'Games', mini_programs: 'Mini Programs', services: 'Services', favorites: 'Favorites', sticker_gallery: 'Sticker Gallery', settings: 'Settings', log_out: 'Log Out', privacy: 'Privacy', general: 'General', new_friends: 'New Friends', group_chats: 'Group Chats', tags: 'Tags', official_accounts: 'Official Accounts', wechat_id: 'WeChat ID', my_qr_code: 'My QR Code', financial_services: 'Financial Services', card_repay: 'Card Repayment', wealth: 'Wealth', insurance: 'Insurance', stocks: 'Stocks', daily_services: 'Daily Services', mobile_top_up: 'Mobile Top-up', utilities: 'Utilities', health: 'Health', public_services: 'Public Services', tencent_charity: 'Tencent Charity', travel_transport: 'Travel & Transport', ride_hailing: 'Ride-hailing', rail_flights: 'Rail & Flights', hotels: 'Hotels', bike_share: 'Bike Share', shopping_entertainment: 'Shopping & Entertainment', specials: 'Specials', movie_tickets: 'Movie Tickets', delivery: 'Delivery', flash_sales: 'Flash Sales', wallet: 'Wallet', name: 'Name', set_remark: 'Set Remark', more: 'More', delete: 'Delete', cancel: 'Cancel', done: 'Done', remark: 'Remark', save: 'Save', set_name: 'Set Name', enter_name: 'Enter Name', set_wxid: 'Set WeChat ID', enter_wxid: 'Enter ID', wxid_hint: 'The WeChat ID is the unique identifier for your account.', channels: 'Channels', music: 'Music', play: 'Play', recommended: 'Recommended', friends_playing: 'Friends Playing', popular: 'Popular', warm_home: 'Warm Home', account_security: 'Account & Security', message_notifications: 'Message Notifications', friends_permissions: 'Friends Permissions', personal_info_collection: 'Personal Information Collection', third_party_lists: 'Third-party Lists', help_feedback: 'Help & Feedback', about: 'About', switch_account: 'Switch Account', appearance: 'Appearance', system_default: 'System Default', dark_mode: 'Dark Mode', off: 'Off', language: 'Language', font_size: 'Font Size', manage_storage: 'Manage Storage', tools: 'Tools', wechat_pay: 'WeChat Pay', profile_photo: 'Profile Photo', incoming_call_ringtone: 'Incoming Call Ringtone' },
  zh: { wechat: '微信', chats: '微信', contacts: '通讯录', discover: '发现', me: '我', search: '搜索', moments: '朋友圈', scan: '扫一扫', shake: '摇一摇', top_stories: '看一看', games: '游戏', mini_programs: '小程序', services: '服务', favorites: '收藏', sticker_gallery: '表情', settings: '设置', log_out: '退出登录', privacy: '隐私', general: '通用', new_friends: '新的朋友', group_chats: '群聊', tags: '标签', official_accounts: '公众号', wechat_id: '微信号', my_qr_code: '我的二维码', financial_services: '金融理财', card_repay: '信用卡还款', wealth: '理财通', insurance: '保险服务', stocks: '股票', daily_services: '生活服务', mobile_top_up: '手机充值', utilities: '生活缴费', health: '医疗健康', public_services: '城市服务', tencent_charity: '腾讯公益', travel_transport: '交通出行', ride_hailing: '出行', rail_flights: '火车票机票', hotels: '酒店', bike_share: '共享单车', shopping_entertainment: '购物消费', specials: '京东购物', movie_tickets: '电影演出赛事', delivery: '美团外卖', flash_sales: '美团团购', wallet: '钱包', name: '名字', set_remark: '设置备注', more: '更多', delete: '删除', cancel: '取消', done: '完成', remark: '备注名', save: '保存', set_name: '设置名字', enter_name: '输入名字', set_wxid: '设置微信号', enter_wxid: '输入微信号', wxid_hint: '微信号是账号的唯一凭证。', channels: '视频号', music: '音乐', play: '开玩', recommended: '向你推荐', friends_playing: '好友在玩', popular: '热门游戏', warm_home: '暖暖家园', account_security: '账号与安全', message_notifications: '新消息通知', friends_permissions: '朋友权限', personal_info_collection: '个人信息收集清单', third_party_lists: '第三方信息共享清单', help_feedback: '帮助与反馈', about: '关于微信', switch_account: '切换账号', appearance: '多语言', system_default: '跟随系统', dark_mode: '深色模式', off: '普通模式', language: '语言', font_size: '字体大小', manage_storage: '存储空间', tools: '工具', wechat_pay: '微信支付', profile_photo: '头像', incoming_call_ringtone: '来电铃声' }
};

export const CURRENT_USER: User = {
  id: 'me', name: '未婚妻', avatar: 'https://loremflickr.com/200/200/girl,cute?lock=100', phone: '13800138000', wxid: 'lucky_one', signature: '正在被五个人同时宠爱着。'
};

export const INITIAL_FRIENDS: User[] = [
  { id: 'charlie_su', name: '查理苏', avatar: 'https://loremflickr.com/200/200/man,elegant,doctor?lock=777', phone: '18888888888', wxid: 'Charlie_Masterpiece', signature: '只有查理苏，才能超越查理苏。' },
  { id: 'sariel_qi', name: '齐司礼', avatar: 'https://loremflickr.com/200/200/man,whitehair,elegant?lock=111', phone: '18888888811', wxid: 'Sariel_Qi', signature: '不要在无谓的事情上浪费我的时间。' },
  { id: 'osborn_xiao', name: '萧逸', avatar: 'https://loremflickr.com/200/200/man,cool,racer?lock=222', phone: '18888888822', wxid: 'Osborn_Xiao', signature: '我的赛车后座，永远只为你留。' },
  { id: 'evan_lu', name: '陆沉', avatar: 'https://loremflickr.com/200/200/man,suit,ceo?lock=333', phone: '18888888833', wxid: 'Evan_Lu', signature: '有些深渊，是值得跳下去的。' },
  { id: 'jesse_xia', name: '夏鸣星', avatar: 'https://loremflickr.com/200/200/man,idol,singer?lock=444', phone: '18888888844', wxid: 'Jesse_Xia', signature: '大小姐，还记得我们的那个夏天吗？' },
  { id: 'npc_mom', name: '妈', avatar: 'https://picsum.photos/seed/mom/200/200', phone: '13900000002', wxid: 'mom_love', signature: '平安是福。🍎' },
  { id: 'npc_dad', name: '老爸', avatar: 'https://loremflickr.com/200/200/man,old?lock=1', phone: '13900000001', wxid: 'dad_silent', signature: '知足常乐。' },
  { id: 'npc_aunt', name: '二姑', avatar: 'https://loremflickr.com/200/200/woman,middleaged?lock=99', phone: '13900000099', wxid: 'aunt_matchmaker', signature: '相亲找我，包你满意。' },
  { id: 'npc_boss', name: 'Boss张', avatar: 'https://picsum.photos/seed/boss/200/200', phone: '13900000003', wxid: 'boss_zhang', signature: '细节决定成败。' },
  { id: 'npc_hr', name: 'HR-Linda', avatar: 'https://loremflickr.com/200/200/woman,office?lock=3', phone: '13900000005', wxid: 'hr_linda', signature: '招人招人，简历砸过来。' },
  { id: 'npc_wang', name: '同事小王', avatar: 'https://loremflickr.com/200/200/man,office?lock=4', phone: '13900000006', wxid: 'wang_work', signature: '周五快点到。' },
  { id: 'npc_delivery', name: '顺丰小陈', avatar: 'https://loremflickr.com/200/200/man,worker?lock=12', phone: '13900000012', wxid: 'express_chen', signature: '快递送货上门。' },
  { id: 'npc_landlord', name: '房东李姐', avatar: 'https://loremflickr.com/200/200/woman,rich?lock=88', phone: '13900000088', wxid: 'landlord_li', signature: '交房租了。' },
  { id: 'npc_tony', name: 'Tony老师', avatar: 'https://loremflickr.com/200/200/man,hair?lock=6', phone: '13900000015', wxid: 'tony_cut', signature: '懂你的发型师。' },
  { id: 'npc_property', name: '物业张师傅', avatar: 'https://loremflickr.com/200/200/man,uniform?lock=7', phone: '13900000016', wxid: 'zhang_repair', signature: '专业疏通修水管。' },
  { id: 'npc_dazhuang', name: '大壮(老同学)', avatar: 'https://loremflickr.com/200/200/man,fat?lock=34', phone: '13900000034', wxid: 'strong_brother', signature: '是兄弟就来砍我！' },
  { id: 'npc_qiqi', name: '闺蜜-琪琪', avatar: 'https://loremflickr.com/200/200/girl,cute?lock=8', phone: '13900000018', wxid: 'qiqi_sweet', signature: '火锅走起！' },
  { id: 'npc_ex', name: '前任(勿扰)', avatar: 'https://loremflickr.com/200/200/man,sad?lock=9', phone: '13900000019', wxid: 'sad_memories', signature: '回不去了。' },
  { id: 'npc_meimei', name: '代购-小美', avatar: 'https://loremflickr.com/200/200/girl,fashion?lock=10', phone: '13900000020', wxid: 'meimei_buy', signature: '正品直邮，童叟无欺。' },
  { id: 'npc_mike', name: '健身教练-Mike', avatar: 'https://loremflickr.com/200/200/man,muscle?lock=11', phone: '13900000021', wxid: 'mike_gym', signature: '自律给我自由。' },
  { id: 'npc_neighbor_wang', name: '隔壁老王', avatar: 'https://loremflickr.com/200/200/man,old?lock=14', phone: '13900000023', wxid: 'wang_neighbor', signature: '热心肠。' },
  { id: 'npc_teacher', name: '小学班主任', avatar: 'https://loremflickr.com/200/200/woman,teacher?lock=15', phone: '13900000024', wxid: 'teacher_wang', signature: '教书育人。' },
  { id: 'npc_pdd', name: '拼多多砍价群友', avatar: 'https://loremflickr.com/200/200/man,normal?lock=16', phone: '13900000025', wxid: 'pdd_friend', signature: '差0.01，帮帮。' },
  { id: 'npc_zhao', name: '饿了么小赵', avatar: 'https://loremflickr.com/200/200/man,rider?lock=17', phone: '13900000026', wxid: 'eleme_zhao', signature: '您的订单正在路上。' },
  { id: 'npc_scam', name: '北京固定电话', avatar: 'https://loremflickr.com/200/200/telephone?lock=18', phone: '010-88888888', wxid: 'scam_call', signature: '未知地区。' },
  { id: 'npc_bank', name: '招商银行小王', avatar: 'https://loremflickr.com/200/200/woman,suit?lock=31', phone: '95555', wxid: 'cmb_wang', signature: '您的贴心金融管家。' },
  { id: 'npc_dentist', name: '牙医张博士', avatar: 'https://loremflickr.com/200/200/doctor?lock=32', phone: '13822223333', wxid: 'dentist_zhang', signature: '微笑从牙齿开始。' },
  { id: 'npc_startup', name: '创业合伙人老赵', avatar: 'https://loremflickr.com/200/200/man,tech?lock=35', phone: '13866667777', wxid: 'startup_zhao', signature: 'All in AI。' },
  { id: 'npc_tutor', name: '考公搭子', avatar: 'https://loremflickr.com/200/200/man,student?lock=37', phone: '13100001111', wxid: 'study_mate', signature: '不上岸，不罢休。' },
  { id: 'npc_barber', name: '美发总监阿强', avatar: 'https://loremflickr.com/200/200/man,cool?lock=38', phone: '13122223333', wxid: 'hair_qiang', signature: '懂发型，更懂你。' }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g_family',
    name: '相亲相爱一家人',
    avatar: 'https://picsum.photos/seed/family_group/200/200',
    members: ['me', 'npc_mom', 'npc_dad', 'npc_aunt'],
    notice: '记得回家吃饭。🍎'
  },
  {
    id: 'g_work',
    name: '搞钱要紧',
    avatar: 'https://picsum.photos/seed/work_group/200/200',
    members: ['me', 'npc_boss', 'npc_hr', 'npc_wang'],
    notice: '下周一交周报。'
  }
];

const NPC_MESSAGE_HISTORY: Record<string, string[]> = {
  charlie_su: ["未婚妻，今晚的月色很美，但不及你万分之一。", "睡了吗？我想带你去一个旷世奇作般的地方。", "刚才那款首饰，你肯定喜欢。", "看到回复我。"],
  sariel_qi: ["这版设计简直是垃圾，重做。", "笨鸟，记得吃午饭。", "你在哪？", "怎么不接电话？", "算了。"],
  osborn_xiao: ["小朋友，赛车场见？", "别总熬夜，对身体不好。", "带你去个好地方吹吹风？", "刚才那把操作如何？", "回个话。"],
  evan_lu: ["我的女孩，深渊在凝视你，而我在想你。", "红酒已醒好，等你。", "有些宿命，从一开始就注定了。", "明天有个晚宴，陪我参加。"],
  jesse_xia: ["大小姐，今天排练好累，想要个抱抱。", "你猜我刚才在剧场后台捡到了什么？", "晚上的演出一定要来哦！", "到家了吗？"],
  npc_mom: ["给你寄了点家里的腊肉，顺丰明天到。", "那个张阿姨家的儿子，你要不要加个微信聊聊？", "记得穿秋裤。", "钱够花吗？", "看到回个话，你爸想你了。"],
  npc_dad: ["转账 500.00", "钱够花吗？", "你妈又在念叨你了。", "最近工作顺心吗？"],
  npc_boss: ["PPT改好了吗？", "明天早上九点半开会，别迟到。", "方案那个细节再磨一下。", "收到请回复。", "尽快。"],
  npc_delivery: ["快递放你家门口了。", "有个到付的件，你在家吗？", "取件码 8829。", "怎么没人接？"],
  npc_landlord: ["502又漏水了，你进屋看看是不是你家水管裂了。", "楼道里别堆杂物，物业在查。", "这月水电费算一下。", "房租该交了。"],
  npc_pdd: ["是兄弟就帮我砍一刀！还差0.01！", "最后一个名额了，帮帮忙！", "跪求砍一刀！", "真的只差最后一下了！"],
  npc_qiqi: ["姐妹，下班去吃那家网红火锅吗？", "尊嘟假嘟？我觉得他在骗你。", "笑发财了快看这个链接。", "宝！求个拼拼链接！", "你看这裙子好看吗？"],
  npc_scam: ["您的个人征信存在异常，请配合处理。", "这里是XX反诈中心，请注意防范。", "您的包裹丢失，请点击链接理赔。", "最后通牒，请尽快处理。"],
  npc_agent: ["地段绝对无敌，错过拍大腿。", "有套急售的，单价直接降了3000！", "姐，最近看房吗？", "这套真的很抢手。"],
  npc_tutor: ["这道申论题怎么破？", "行测又写不完了呜呜呜。", "救命，我真的不想看书了。", "上岸了吗？"],
  npc_hr: ["简历收到了，下周二面试可以吗？", "方便接电话吗？", "入职材料准备一下。"],
  npc_wang: ["下午那个表帮我填一下。", "周五了！终于！", "奶茶拼单吗？", "老板刚才找你没找到。"],
  npc_tony: ["姐，上次那个发色该补了。", "明天有空过来做个护理吗？", "新到了个发型师技术超好。"],
  npc_property: ["物业费该交了。", "明天停水，记得蓄水。", "楼下投诉你家噪音大。"],
  npc_dazhuang: ["最近忙啥呢？", "聚聚不？", "借我点钱周转下，下周还。"],
  npc_ex: ["在吗？", "我梦见你了。", "对不起。", "哪怕做朋友也行。"],
  npc_meimei: ["Lamer打折，需要的扣1。", "这次去日本带什么？", "现货不多了。"],
  npc_mike: ["今天还来练背吗？", "饮食要打卡啊。", "三组卧推，搞起。"],
  npc_neighbor_wang: ["你家Wi-Fi密码换了？", "上次借我的锤子还在吗？", "晚上动静小点。"],
  npc_teacher: ["最近学习状态不对。", "记得准时交作业。", "明天来办公室一趟。"],
  npc_zhao: ["您的外卖到了，在门口。", "帮点个五星好评吧。", "差评我也很难办。"],
  npc_bank: ["有笔大额支出是您本人吗？", "有个理财产品收益很稳。", "办卡不？"],
  npc_dentist: ["牙套该调了。", "记得早晚刷牙。", "有牙洞要早补. "],
  npc_startup: ["方案我想通了。", "这周见个投资人。", "All in AI！"],
  npc_barber: ["总监有空，现在过来？", "发型不满意随时找我。"]
};

export const GENERATE_INITIAL_MESSAGES = (): Message[] => {
  const msgs: Message[] = [];
  INITIAL_FRIENDS.forEach(f => {
    const history = NPC_MESSAGE_HISTORY[f.id] || [`那个文件发我下。`, "在忙吗？", "好的。"];
    
    // 随机未读数：有的1条，有的更多，模拟“已使用”状态
    // 为确保多样性，使用权重分布
    const rand = Math.random();
    let unreadCount = 0;
    if (rand > 0.8) unreadCount = Math.floor(Math.random() * 8) + 3; // 20% 几率有 3-10 条未读
    else if (rand > 0.3) unreadCount = Math.floor(Math.random() * 2) + 1; // 50% 几率有 1-2 条未读
    else unreadCount = 0; // 30% 几率已读

    const now = Date.now();
    
    history.forEach((content, i) => {
      const isUnread = (history.length - i) <= unreadCount;
      // 模拟消息发送时间：从远到近
      const timestamp = now - (history.length - i) * (Math.random() * 1000000 + 500000);
      
      msgs.push({
        id: `init_${f.id}_${i}`, 
        senderId: f.id, 
        receiverId: 'me', 
        content, 
        type: 'text',
        timestamp, 
        read: !isUnread
      });
    });
  });
  return msgs;
};

export const MOCK_POSTS_INITIAL: Post[] = [
  { id: 'p_charlie', authorId: 'charlie_su', content: '在这个平凡的世界里，只有我的完美能为这间手术室增添一抹色彩。未婚妻，你是否也在此时感受到了这种跨越空间的华丽？', images: [], likes: ['me', 'evan_lu'], comments: [], timestamp: Date.now() - 7200000 },
  { id: 'p_mom', authorId: 'npc_mom', content: '大家看看，很有道理。🍎🙏', images: ['https://loremflickr.com/400/300/food,healthy?lock=1'], likes: ['npc_dad'], comments: [], timestamp: Date.now() - 14400000 },
  { id: 'p_tony', authorId: 'npc_tony', content: '今日剪裁：法式复古卷，气质拉满。💈✂️', images: ['https://loremflickr.com/400/300/hair?lock=55'], likes: [], comments: [], timestamp: Date.now() - 3600000 }
];
