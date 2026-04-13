import { VocabEntry } from "./VocabContext";

const now = new Date().toISOString();

export const SEED_DATA: VocabEntry[] = [
  // === GREETINGS & BASICS (mastered) ===
  { id: "1", chinese: "你好", pinyin: "nǐ hǎo", english: "hello", example: "你好，我叫Brian。", category: "greetings", mastered: true, createdAt: now },
  { id: "2", chinese: "谢谢", pinyin: "xiè xie", english: "thank you", example: "谢谢你的帮助。", category: "greetings", mastered: true, createdAt: now },
  { id: "3", chinese: "不客气", pinyin: "bú kè qi", english: "you're welcome", example: "谢谢！不客气。", category: "greetings", mastered: true, createdAt: now },
  { id: "4", chinese: "没关系", pinyin: "méi guān xi", english: "it doesn't matter / no problem", example: "对不起！没关系。", category: "greetings", mastered: true, createdAt: now },
  { id: "5", chinese: "再见", pinyin: "zài jiàn", english: "goodbye", example: "明天见，再见！", category: "greetings", mastered: true, createdAt: now },

  // === FOOD & DRINK ===
  { id: "6", chinese: "水", pinyin: "shuǐ", english: "water", example: "我想喝水。", category: "food", mastered: true, createdAt: now },
  { id: "7", chinese: "吃饭", pinyin: "chī fàn", english: "to eat (a meal)", example: "我们一起吃饭吧。", category: "food", mastered: false, createdAt: now },
  { id: "8", chinese: "好吃", pinyin: "hǎo chī", english: "delicious", example: "这个菜很好吃！", category: "food", mastered: false, createdAt: now },
  { id: "9", chinese: "点菜", pinyin: "diǎn cài", english: "to order food", example: "我们可以点菜了吗？", category: "food", mastered: false, createdAt: now },
  { id: "10", chinese: "饺子", pinyin: "jiǎo zi", english: "dumplings", example: "我最喜欢吃饺子。", category: "food", mastered: false, createdAt: now },
  { id: "11", chinese: "味道", pinyin: "wèi dào", english: "taste / flavor", example: "这个菜的味道很好。", category: "food", mastered: false, createdAt: now },
  { id: "12", chinese: "营养", pinyin: "yíng yǎng", english: "nutrition", example: "这种食物很有营养。", category: "food", mastered: false, createdAt: now },
  { id: "13", chinese: "食物", pinyin: "shí wù", english: "food", example: "健康的食物很重要。", category: "food", mastered: false, createdAt: now },

  // === SHOPPING ===
  { id: "14", chinese: "多少钱", pinyin: "duō shao qián", english: "how much (money)?", example: "这个多少钱？", category: "shopping", mastered: false, createdAt: now },
  { id: "15", chinese: "太贵了", pinyin: "tài guì le", english: "too expensive", example: "这个太贵了，有便宜的吗？", category: "shopping", mastered: false, createdAt: now },
  { id: "16", chinese: "便宜", pinyin: "pián yi", english: "cheap / inexpensive", example: "这家店的东西很便宜。", category: "shopping", mastered: false, createdAt: now },
  { id: "17", chinese: "打折", pinyin: "dǎ zhé", english: "discount / on sale", example: "这件衣服打折吗？", category: "shopping", mastered: false, createdAt: now },
  { id: "18", chinese: "消费", pinyin: "xiāo fèi", english: "to consume / consumption", example: "年轻人的消费观念在变化。", category: "shopping", mastered: false, createdAt: now },

  // === TRAVEL ===
  { id: "19", chinese: "去", pinyin: "qù", english: "to go", example: "我们去公园吧。", category: "travel", mastered: true, createdAt: now },
  { id: "20", chinese: "地铁站", pinyin: "dì tiě zhàn", english: "subway station", example: "地铁站在哪里？", category: "travel", mastered: false, createdAt: now },
  { id: "21", chinese: "迷路了", pinyin: "mí lù le", english: "to be lost", example: "我迷路了，你能帮我吗？", category: "travel", mastered: false, createdAt: now },
  { id: "22", chinese: "签证", pinyin: "qiān zhèng", english: "visa", example: "我需要办签证。", category: "travel", mastered: false, createdAt: now },
  { id: "23", chinese: "航班", pinyin: "háng bān", english: "flight", example: "我的航班是明天早上的。", category: "travel", mastered: false, createdAt: now },
  { id: "24", chinese: "行李", pinyin: "xíng li", english: "luggage / baggage", example: "请帮我拿一下行李。", category: "travel", mastered: false, createdAt: now },
  { id: "25", chinese: "目的地", pinyin: "mù dì dì", english: "destination", example: "我们快到目的地了。", category: "travel", mastered: false, createdAt: now },

  // === DAILY LIFE ===
  { id: "26", chinese: "上班", pinyin: "shàng bān", english: "to go to work", example: "我每天早上八点上班。", category: "daily", mastered: false, createdAt: now },
  { id: "27", chinese: "休息", pinyin: "xiū xi", english: "to rest / take a break", example: "你累了，休息一下吧。", category: "daily", mastered: false, createdAt: now },
  { id: "28", chinese: "已经", pinyin: "yǐ jīng", english: "already", example: "我已经吃过饭了。", category: "daily", mastered: false, createdAt: now },
  { id: "29", chinese: "应该", pinyin: "yīng gāi", english: "should / ought to", example: "你应该多喝水。", category: "daily", mastered: false, createdAt: now },
  { id: "30", chinese: "听不懂", pinyin: "tīng bù dǒng", english: "can't understand (listening)", example: "他说得太快了，我听不懂。", category: "daily", mastered: false, createdAt: now },
  { id: "31", chinese: "越来越", pinyin: "yuè lái yuè", english: "more and more", example: "我的中文越来越好了。", category: "daily", mastered: false, createdAt: now },
  { id: "32", chinese: "习惯", pinyin: "xí guàn", english: "habit / to be used to", example: "我已经习惯了这里的生活。", category: "daily", mastered: false, createdAt: now },
  { id: "33", chinese: "安排", pinyin: "ān pái", english: "to arrange / arrangement", example: "你能帮我安排一下时间吗？", category: "daily", mastered: false, createdAt: now },

  // === WORK & CAREER (HSK4-5) ===
  { id: "34", chinese: "经验", pinyin: "jīng yàn", english: "experience", example: "他有很多工作经验。", category: "work", mastered: false, createdAt: now },
  { id: "35", chinese: "压力", pinyin: "yā lì", english: "pressure / stress", example: "工作压力太大了。", category: "work", mastered: false, createdAt: now },
  { id: "36", chinese: "竞争", pinyin: "jìng zhēng", english: "competition", example: "这个行业的竞争很激烈。", category: "work", mastered: false, createdAt: now },
  { id: "37", chinese: "效率", pinyin: "xiào lǜ", english: "efficiency", example: "我们需要提高工作效率。", category: "work", mastered: false, createdAt: now },
  { id: "38", chinese: "任务", pinyin: "rèn wù", english: "task / mission", example: "今天的任务很重。", category: "work", mastered: false, createdAt: now },
  { id: "39", chinese: "会议", pinyin: "huì yì", english: "meeting / conference", example: "下午有一个重要的会议。", category: "work", mastered: false, createdAt: now },
  { id: "40", chinese: "辞职", pinyin: "cí zhí", english: "to resign", example: "他决定辞职了。", category: "work", mastered: false, createdAt: now },
  { id: "41", chinese: "加班", pinyin: "jiā bān", english: "to work overtime", example: "今天又要加班了。", category: "work", mastered: false, createdAt: now },
  { id: "42", chinese: "专业", pinyin: "zhuān yè", english: "major / professional", example: "你大学的专业是什么？", category: "work", mastered: false, createdAt: now },

  // === EMOTIONS & PERSONALITY (HSK4-5) ===
  { id: "43", chinese: "紧张", pinyin: "jǐn zhāng", english: "nervous / tense", example: "考试前我很紧张。", category: "daily", mastered: false, createdAt: now },
  { id: "44", chinese: "失望", pinyin: "shī wàng", english: "disappointed", example: "听到这个消息我很失望。", category: "daily", mastered: false, createdAt: now },
  { id: "45", chinese: "自信", pinyin: "zì xìn", english: "self-confident", example: "她是一个很自信的人。", category: "daily", mastered: false, createdAt: now },
  { id: "46", chinese: "后悔", pinyin: "hòu huǐ", english: "to regret", example: "我很后悔没去那个派对。", category: "daily", mastered: false, createdAt: now },
  { id: "47", chinese: "羡慕", pinyin: "xiàn mù", english: "to envy / to admire", example: "我很羡慕他的生活。", category: "daily", mastered: false, createdAt: now },
  { id: "48", chinese: "佩服", pinyin: "pèi fú", english: "to admire / to respect", example: "我很佩服她的勇气。", category: "daily", mastered: false, createdAt: now },
  { id: "49", chinese: "耐心", pinyin: "nài xīn", english: "patience / patient", example: "学语言需要耐心。", category: "daily", mastered: false, createdAt: now },

  // === EDUCATION & LEARNING (HSK4-5) ===
  { id: "50", chinese: "知识", pinyin: "zhī shi", english: "knowledge", example: "知识就是力量。", category: "work", mastered: false, createdAt: now },
  { id: "51", chinese: "翻译", pinyin: "fān yì", english: "to translate / translation", example: "你能帮我翻译这句话吗？", category: "work", mastered: false, createdAt: now },
  { id: "52", chinese: "复习", pinyin: "fù xí", english: "to review / revision", example: "考试前要好好复习。", category: "work", mastered: false, createdAt: now },
  { id: "53", chinese: "发音", pinyin: "fā yīn", english: "pronunciation", example: "你的发音很标准。", category: "work", mastered: false, createdAt: now },
  { id: "54", chinese: "词汇", pinyin: "cí huì", english: "vocabulary", example: "多背词汇很重要。", category: "work", mastered: false, createdAt: now },
  { id: "55", chinese: "理解", pinyin: "lǐ jiě", english: "to understand / comprehend", example: "我不太理解你的意思。", category: "work", mastered: false, createdAt: now },

  // === TECHNOLOGY (HSK5) ===
  { id: "56", chinese: "网络", pinyin: "wǎng luò", english: "internet / network", example: "这里的网络信号不好。", category: "daily", mastered: false, createdAt: now },
  { id: "57", chinese: "软件", pinyin: "ruǎn jiàn", english: "software", example: "这个软件很好用。", category: "daily", mastered: false, createdAt: now },
  { id: "58", chinese: "数据", pinyin: "shù jù", english: "data", example: "我们需要分析这些数据。", category: "work", mastered: false, createdAt: now },
  { id: "59", chinese: "人工智能", pinyin: "rén gōng zhì néng", english: "artificial intelligence", example: "人工智能正在改变世界。", category: "work", mastered: false, createdAt: now },
  { id: "60", chinese: "下载", pinyin: "xià zài", english: "to download", example: "你可以在这里下载那个APP。", category: "daily", mastered: false, createdAt: now },

  // === HEALTH (HSK4-5) ===
  { id: "61", chinese: "锻炼", pinyin: "duàn liàn", english: "to exercise / work out", example: "我每天早上锻炼身体。", category: "daily", mastered: false, createdAt: now },
  { id: "62", chinese: "健康", pinyin: "jiàn kāng", english: "health / healthy", example: "身体健康最重要。", category: "daily", mastered: false, createdAt: now },
  { id: "63", chinese: "感冒", pinyin: "gǎn mào", english: "cold (illness)", example: "我感冒了，不太舒服。", category: "daily", mastered: false, createdAt: now },
  { id: "64", chinese: "治疗", pinyin: "zhì liáo", english: "to treat (medically)", example: "这种病需要及时治疗。", category: "daily", mastered: false, createdAt: now },

  // === ABSTRACT / HSK5 LEVEL ===
  { id: "65", chinese: "观念", pinyin: "guān niàn", english: "concept / idea / notion", example: "每个人的观念不同。", category: "daily", mastered: false, createdAt: now },
  { id: "66", chinese: "现象", pinyin: "xiàn xiàng", english: "phenomenon", example: "这是一个很普遍的现象。", category: "daily", mastered: false, createdAt: now },
  { id: "67", chinese: "趋势", pinyin: "qū shì", english: "trend / tendency", example: "这是未来的发展趋势。", category: "work", mastered: false, createdAt: now },
  { id: "68", chinese: "影响", pinyin: "yǐng xiǎng", english: "to influence / influence", example: "环境对人有很大的影响。", category: "daily", mastered: false, createdAt: now },
  { id: "69", chinese: "本质", pinyin: "běn zhì", english: "essence / nature", example: "我们要看到问题的本质。", category: "daily", mastered: false, createdAt: now },
  { id: "70", chinese: "矛盾", pinyin: "máo dùn", english: "contradiction / conflict", example: "这两个想法有些矛盾。", category: "daily", mastered: false, createdAt: now },
  { id: "71", chinese: "实际", pinyin: "shí jì", english: "actual / practical", example: "你的计划不太实际。", category: "daily", mastered: false, createdAt: now },
  { id: "72", chinese: "角度", pinyin: "jiǎo dù", english: "angle / perspective", example: "从不同的角度看问题。", category: "daily", mastered: false, createdAt: now },
  { id: "73", chinese: "过程", pinyin: "guò chéng", english: "process / course", example: "学习是一个漫长的过程。", category: "daily", mastered: false, createdAt: now },
  { id: "74", chinese: "原则", pinyin: "yuán zé", english: "principle", example: "做人要有原则。", category: "daily", mastered: false, createdAt: now },
  { id: "75", chinese: "发挥", pinyin: "fā huī", english: "to bring into play / perform", example: "他在比赛中发挥得很好。", category: "daily", mastered: false, createdAt: now },

  // === RELATIONSHIPS & SOCIAL (HSK5) ===
  { id: "76", chinese: "沟通", pinyin: "gōu tōng", english: "to communicate", example: "我们需要更多沟通。", category: "daily", mastered: false, createdAt: now },
  { id: "77", chinese: "尊重", pinyin: "zūn zhòng", english: "to respect / respect", example: "我们应该尊重每个人。", category: "daily", mastered: false, createdAt: now },
  { id: "78", chinese: "信任", pinyin: "xìn rèn", english: "to trust / trust", example: "信任是友谊的基础。", category: "daily", mastered: false, createdAt: now },
  { id: "79", chinese: "误会", pinyin: "wù huì", english: "misunderstanding", example: "这是一场误会。", category: "daily", mastered: false, createdAt: now },
  { id: "80", chinese: "道歉", pinyin: "dào qiàn", english: "to apologize", example: "我应该向他道歉。", category: "greetings", mastered: false, createdAt: now },
  { id: "81", chinese: "拒绝", pinyin: "jù jué", english: "to refuse / reject", example: "他拒绝了我的邀请。", category: "daily", mastered: false, createdAt: now },

  // === NATURE & ENVIRONMENT (HSK5) ===
  { id: "82", chinese: "环境", pinyin: "huán jìng", english: "environment", example: "保护环境是每个人的责任。", category: "daily", mastered: false, createdAt: now },
  { id: "83", chinese: "污染", pinyin: "wū rǎn", english: "pollution", example: "空气污染越来越严重了。", category: "daily", mastered: false, createdAt: now },
  { id: "84", chinese: "资源", pinyin: "zī yuán", english: "resources", example: "我们要节约自然资源。", category: "daily", mastered: false, createdAt: now },
  { id: "85", chinese: "气候", pinyin: "qì hòu", english: "climate", example: "全球气候正在变化。", category: "travel", mastered: false, createdAt: now },

  // === ADVANCED PHRASES (HSK5) ===
  { id: "86", chinese: "无论如何", pinyin: "wú lùn rú hé", english: "no matter what / regardless", example: "无论如何，我都会支持你。", category: "daily", mastered: false, createdAt: now },
  { id: "87", chinese: "尽管", pinyin: "jǐn guǎn", english: "despite / even though", example: "尽管很难，我也不会放弃。", category: "daily", mastered: false, createdAt: now },
  { id: "88", chinese: "反而", pinyin: "fǎn ér", english: "on the contrary / instead", example: "吃了药反而更严重了。", category: "daily", mastered: false, createdAt: now },
  { id: "89", chinese: "既然", pinyin: "jì rán", english: "since / now that", example: "既然来了，就好好玩吧。", category: "daily", mastered: false, createdAt: now },
  { id: "90", chinese: "不得不", pinyin: "bù dé bù", english: "have no choice but to", example: "我不得不加班到很晚。", category: "daily", mastered: false, createdAt: now },
  { id: "91", chinese: "难免", pinyin: "nán miǎn", english: "hard to avoid / inevitable", example: "犯错误是难免的。", category: "daily", mastered: false, createdAt: now },
  { id: "92", chinese: "逐渐", pinyin: "zhú jiàn", english: "gradually", example: "天气逐渐变暖了。", category: "daily", mastered: false, createdAt: now },
  { id: "93", chinese: "恰好", pinyin: "qià hǎo", english: "just right / by coincidence", example: "我恰好有两张票。", category: "daily", mastered: false, createdAt: now },
  { id: "94", chinese: "显然", pinyin: "xiǎn rán", english: "obviously / clearly", example: "他显然不同意这个方案。", category: "daily", mastered: false, createdAt: now },
  { id: "95", chinese: "未必", pinyin: "wèi bì", english: "not necessarily", example: "贵的东西未必就好。", category: "daily", mastered: false, createdAt: now },

  // === CULTURE & SOCIETY (HSK5) ===
  { id: "96", chinese: "传统", pinyin: "chuán tǒng", english: "tradition / traditional", example: "中国有很多传统节日。", category: "daily", mastered: false, createdAt: now },
  { id: "97", chinese: "文化", pinyin: "wén huà", english: "culture", example: "我对中国文化很感兴趣。", category: "daily", mastered: false, createdAt: now },
  { id: "98", chinese: "价值", pinyin: "jià zhí", english: "value / worth", example: "这本书很有价值。", category: "daily", mastered: false, createdAt: now },
  { id: "99", chinese: "贡献", pinyin: "gòng xiàn", english: "contribution / to contribute", example: "她为公司做出了很大贡献。", category: "work", mastered: false, createdAt: now },
  { id: "100", chinese: "挑战", pinyin: "tiǎo zhàn", english: "challenge", example: "学中文是一个很大的挑战。", category: "work", mastered: false, createdAt: now },

  // === NUMBERS & MATH ===
  { id: "101", chinese: "百", pinyin: "bǎi", english: "hundred", example: "这本书有三百页。", category: "numbers", mastered: true, createdAt: now },
  { id: "102", chinese: "千", pinyin: "qiān", english: "thousand", example: "这个城市有两千年的历史。", category: "numbers", mastered: true, createdAt: now },
  { id: "103", chinese: "万", pinyin: "wàn", english: "ten thousand", example: "他赚了一万块钱。", category: "numbers", mastered: false, createdAt: now },
  { id: "104", chinese: "亿", pinyin: "yì", english: "hundred million", example: "中国有十四亿人口。", category: "numbers", mastered: false, createdAt: now },
  { id: "105", chinese: "倍", pinyin: "bèi", english: "times (multiplier)", example: "今年的收入是去年的两倍。", category: "numbers", mastered: false, createdAt: now },
  { id: "106", chinese: "比例", pinyin: "bǐ lì", english: "ratio / proportion", example: "男女比例大概是一比一。", category: "numbers", mastered: false, createdAt: now },
  { id: "107", chinese: "数量", pinyin: "shù liàng", english: "quantity / amount", example: "请确认一下数量。", category: "numbers", mastered: false, createdAt: now },
  { id: "108", chinese: "平均", pinyin: "píng jūn", english: "average", example: "平均每天学五个新词。", category: "numbers", mastered: false, createdAt: now },
  { id: "109", chinese: "大约", pinyin: "dà yuē", english: "approximately", example: "大约需要三十分钟。", category: "numbers", mastered: false, createdAt: now },
  { id: "110", chinese: "至少", pinyin: "zhì shǎo", english: "at least", example: "你至少要学一百个词。", category: "numbers", mastered: false, createdAt: now },

  // === OTHER / MISCELLANEOUS ===
  { id: "111", chinese: "幽默", pinyin: "yōu mò", english: "humor / humorous", example: "他是一个很幽默的人。", category: "other", mastered: false, createdAt: now },
  { id: "112", chinese: "缘分", pinyin: "yuán fèn", english: "fate / destiny (in relationships)", example: "能认识你是一种缘分。", category: "other", mastered: false, createdAt: now },
  { id: "113", chinese: "面子", pinyin: "miàn zi", english: "face (reputation / dignity)", example: "中国人很注重面子。", category: "other", mastered: false, createdAt: now },
  { id: "114", chinese: "吉利", pinyin: "jí lì", english: "auspicious / lucky", example: "八是一个吉利的数字。", category: "other", mastered: false, createdAt: now },
  { id: "115", chinese: "干杯", pinyin: "gān bēi", english: "cheers (toast)", example: "为我们的友谊干杯！", category: "other", mastered: false, createdAt: now },
  { id: "116", chinese: "成语", pinyin: "chéng yǔ", english: "idiom (four-character)", example: "中文里有很多有趣的成语。", category: "other", mastered: false, createdAt: now },
  { id: "117", chinese: "功夫", pinyin: "gōng fu", english: "kung fu / skill / effort", example: "学好中文需要下功夫。", category: "other", mastered: false, createdAt: now },
  { id: "118", chinese: "加油", pinyin: "jiā yóu", english: "keep it up! / go for it!", example: "明天考试，加油！", category: "other", mastered: false, createdAt: now },
  { id: "119", chinese: "马马虎虎", pinyin: "mǎ mǎ hū hū", english: "so-so / careless", example: "你最近怎么样？马马虎虎。", category: "other", mastered: false, createdAt: now },
  { id: "120", chinese: "入乡随俗", pinyin: "rù xiāng suí sú", english: "when in Rome, do as the Romans do", example: "到了中国就要入乡随俗。", category: "other", mastered: false, createdAt: now },
];
