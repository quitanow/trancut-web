export type Locale = "en" | "zh-TW" | "zh-CN";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
};

export const translations = {
  en: {
    nav: {
      login: "Log in",
      getStarted: "Get started free",
      upload: "Upload",
      history: "History",
      signOut: "Sign out",
    },
    hero: {
      badge: "English → Chinese subtitles in minutes",
      title1: "Translate your videos.",
      title2: "Effortlessly.",
      subtitle:
        "Upload a video, get bilingual subtitles. TranCut transcribes your English video and translates it to Traditional Chinese — ready to download in seconds.",
      ctaPrimary: "Start for free",
      ctaSecondary: "Sign in",
      freeNote: "Free: up to 2 min · No credit card required",
    },
    features: {
      title: "",
      items: [
        {
          title: "Accurate transcription",
          description:
            "Powered by Whisper AI — handles accents, fast speech, and background noise.",
        },
        {
          title: "Natural translation",
          description:
            "Translated by GPT-4o for fluent, readable Traditional Chinese subtitles — not robotic word-for-word.",
        },
        {
          title: "Download SRT files",
          description:
            "Get both English-only and bilingual SRT files, ready to use in any video editor.",
        },
      ],
    },
    pricing: {
      title: "Simple pricing",
      subtitle: "Start free, upgrade when you need more.",
      free: {
        tier: "Free",
        price: "$0",
        features: ["Up to 2 min / video", "5 videos / month", "Bilingual SRT"],
      },
      pro: {
        tier: "Pro",
        price: "Coming soon",
        features: ["Up to 20 min / video", "Unlimited videos", "Priority processing"],
      },
    },
    upload: {
      title: "New transcription",
      subtitle: "Upload a video to get English + Traditional Chinese subtitles.",
      dropTitle: "Drop your video here",
      dropSubtitle: "or click to browse · MP4, MOV, M4V",
      dropNote: "Free plan: up to 2 min",
      checking: "Checking",
      uploading: "Uploading…",
      queued: "Job queued — redirecting…",
      errorType: "Only MP4, MOV, or M4V files are supported.",
      errorDuration: (dur: number, max: number) =>
        `Video is ${dur}s — free plan supports up to ${max}s (2 min).`,
    },
    jobs: {
      title: "History",
      newVideo: "New video",
      empty: "No jobs yet",
      emptyLink: "Upload your first video →",
      loading: "Loading…",
      status: {
        pending: "pending",
        processing: "processing",
        completed: "completed",
        failed: "failed",
      },
    },
    jobDetail: {
      allJobs: "All jobs",
      loading: "Loading…",
      ready: "Your subtitle files are ready:",
      bilingual: "Bilingual SRT (EN + Chinese)",
      bilingualDesc: "Best for publishing — both languages stacked",
      englishOnly: "English SRT only",
      englishOnlyDesc: "Original transcription",
      pendingMsg: "Waiting in queue…",
      processingMsg: "Transcribing and translating…",
      pollingNote: "This page updates automatically",
      failedMsg: "Processing failed",
    },
    auth: {
      loginTitle: "Welcome back",
      loginSubtitle: "Sign in to your TranCut account",
      signupTitle: "Create your account",
      signupSubtitle: "Free — 5 videos / month, up to 2 min each",
      email: "Email",
      password: "Password",
      passwordHint: "Minimum 8 characters",
      signingIn: "Signing in…",
      signIn: "Sign in",
      creating: "Creating account…",
      createAccount: "Create account",
      noAccount: "No account?",
      signUpFree: "Sign up free",
      haveAccount: "Already have an account?",
    },
    footer: "TranCut · trancut.com",
  },

  "zh-TW": {
    nav: {
      login: "登入",
      getStarted: "免費開始使用",
      upload: "上傳",
      history: "歷史記錄",
      signOut: "登出",
    },
    hero: {
      badge: "英文 → 中文字幕，幾分鐘搞定",
      title1: "翻譯你的影片，",
      title2: "輕鬆無比。",
      subtitle:
        "上傳影片，立即取得雙語字幕。TranCut 將英文影片轉錄並翻譯成繁體中文，幾秒鐘內即可下載。",
      ctaPrimary: "免費開始",
      ctaSecondary: "登入",
      freeNote: "免費版：最長 2 分鐘 · 無需信用卡",
    },
    features: {
      title: "",
      items: [
        {
          title: "精準轉錄",
          description: "採用 Whisper AI，能處理各種口音、語速與背景噪音。",
        },
        {
          title: "自然流暢的翻譯",
          description: "以 GPT-4o 翻譯，生成道地繁體中文字幕，而非生硬的逐字翻譯。",
        },
        {
          title: "下載 SRT 字幕檔",
          description: "同時提供純英文及雙語 SRT 檔案，可直接用於任何影片剪輯軟體。",
        },
      ],
    },
    pricing: {
      title: "簡單明瞭的定價",
      subtitle: "免費起步，需要更多時再升級。",
      free: {
        tier: "免費版",
        price: "$0",
        features: ["每部影片最長 2 分鐘", "每月 5 部影片", "雙語 SRT 字幕"],
      },
      pro: {
        tier: "專業版",
        price: "即將推出",
        features: ["每部影片最長 20 分鐘", "無限制影片數量", "優先處理"],
      },
    },
    upload: {
      title: "新增轉錄任務",
      subtitle: "上傳影片以取得英文 + 繁體中文字幕。",
      dropTitle: "將影片拖曳至此",
      dropSubtitle: "或點擊瀏覽 · 支援 MP4、MOV、M4V",
      dropNote: "免費版：最長 2 分鐘",
      checking: "檢查中",
      uploading: "上傳中…",
      queued: "任務已排入佇列，正在跳轉…",
      errorType: "僅支援 MP4、MOV 或 M4V 格式。",
      errorDuration: (dur: number, max: number) =>
        `影片長度為 ${dur} 秒，免費版上限為 ${max} 秒（2 分鐘）。`,
    },
    jobs: {
      title: "歷史記錄",
      newVideo: "新影片",
      empty: "尚無任務",
      emptyLink: "上傳你的第一部影片 →",
      loading: "載入中…",
      status: {
        pending: "等待中",
        processing: "處理中",
        completed: "已完成",
        failed: "失敗",
      },
    },
    jobDetail: {
      allJobs: "所有任務",
      loading: "載入中…",
      ready: "字幕檔案已準備就緒：",
      bilingual: "雙語 SRT（英文 + 中文）",
      bilingualDesc: "適合發布使用，雙語交疊顯示",
      englishOnly: "純英文 SRT",
      englishOnlyDesc: "原始轉錄內容",
      pendingMsg: "等待佇列中…",
      processingMsg: "正在轉錄與翻譯…",
      pollingNote: "本頁面會自動更新",
      failedMsg: "處理失敗",
    },
    auth: {
      loginTitle: "歡迎回來",
      loginSubtitle: "登入你的 TranCut 帳號",
      signupTitle: "建立帳號",
      signupSubtitle: "免費版：每月 5 部影片，每部最長 2 分鐘",
      email: "電子郵件",
      password: "密碼",
      passwordHint: "最少 8 個字元",
      signingIn: "登入中…",
      signIn: "登入",
      creating: "建立帳號中…",
      createAccount: "建立帳號",
      noAccount: "還沒有帳號？",
      signUpFree: "免費註冊",
      haveAccount: "已有帳號？",
    },
    footer: "TranCut · trancut.com",
  },

  "zh-CN": {
    nav: {
      login: "登录",
      getStarted: "免费开始使用",
      upload: "上传",
      history: "历史记录",
      signOut: "退出登录",
    },
    hero: {
      badge: "英文 → 中文字幕，几分钟搞定",
      title1: "翻译你的视频，",
      title2: "轻松无比。",
      subtitle:
        "上传视频，立即获得双语字幕。TranCut 将英文视频转录并翻译成中文，几秒钟内即可下载。",
      ctaPrimary: "免费开始",
      ctaSecondary: "登录",
      freeNote: "免费版：最长 2 分钟 · 无需信用卡",
    },
    features: {
      title: "",
      items: [
        {
          title: "精准转录",
          description: "采用 Whisper AI，能处理各种口音、语速与背景噪音。",
        },
        {
          title: "自然流畅的翻译",
          description: "以 GPT-4o 翻译，生成地道中文字幕，而非生硬的逐字翻译。",
        },
        {
          title: "下载 SRT 字幕文件",
          description: "同时提供纯英文及双语 SRT 文件，可直接用于任何视频剪辑软件。",
        },
      ],
    },
    pricing: {
      title: "简单明了的定价",
      subtitle: "免费起步，需要更多时再升级。",
      free: {
        tier: "免费版",
        price: "$0",
        features: ["每个视频最长 2 分钟", "每月 5 个视频", "双语 SRT 字幕"],
      },
      pro: {
        tier: "专业版",
        price: "即将推出",
        features: ["每个视频最长 20 分钟", "无限视频数量", "优先处理"],
      },
    },
    upload: {
      title: "新建转录任务",
      subtitle: "上传视频以获取英文 + 中文字幕。",
      dropTitle: "将视频拖拽至此",
      dropSubtitle: "或点击浏览 · 支持 MP4、MOV、M4V",
      dropNote: "免费版：最长 2 分钟",
      checking: "检查中",
      uploading: "上传中…",
      queued: "任务已加入队列，正在跳转…",
      errorType: "仅支持 MP4、MOV 或 M4V 格式。",
      errorDuration: (dur: number, max: number) =>
        `视频时长为 ${dur} 秒，免费版上限为 ${max} 秒（2 分钟）。`,
    },
    jobs: {
      title: "历史记录",
      newVideo: "新视频",
      empty: "暂无任务",
      emptyLink: "上传你的第一个视频 →",
      loading: "加载中…",
      status: {
        pending: "等待中",
        processing: "处理中",
        completed: "已完成",
        failed: "失败",
      },
    },
    jobDetail: {
      allJobs: "所有任务",
      loading: "加载中…",
      ready: "字幕文件已准备就绪：",
      bilingual: "双语 SRT（英文 + 中文）",
      bilingualDesc: "适合发布使用，双语叠加显示",
      englishOnly: "纯英文 SRT",
      englishOnlyDesc: "原始转录内容",
      pendingMsg: "等待队列中…",
      processingMsg: "正在转录与翻译…",
      pollingNote: "本页面会自动更新",
      failedMsg: "处理失败",
    },
    auth: {
      loginTitle: "欢迎回来",
      loginSubtitle: "登录你的 TranCut 账号",
      signupTitle: "创建账号",
      signupSubtitle: "免费版：每月 5 个视频，每个最长 2 分钟",
      email: "电子邮件",
      password: "密码",
      passwordHint: "最少 8 个字符",
      signingIn: "登录中…",
      signIn: "登录",
      creating: "创建账号中…",
      createAccount: "创建账号",
      noAccount: "还没有账号？",
      signUpFree: "免费注册",
      haveAccount: "已有账号？",
    },
    footer: "TranCut · trancut.com",
  },
} as const;

export type Translations = typeof translations[Locale];
