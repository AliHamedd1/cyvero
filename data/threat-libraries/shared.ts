import { categories } from "@/data/categories";
import { Threat, ThreatFaq } from "@/types/cyber";

export type ThreatSeed = Omit<
  Threat,
  "category" | "fullDescription" | "faq" | "icon" | "howItReachesTarget" | "selfProtection"
> & {
  overview: string;
  context: string;
  faq?: ThreatFaq[];
  icon?: string;
  howItReachesTarget?: string;
  selfProtection?: string[];
};

const categoryNameMap = Object.fromEntries(
  categories.map((category) => [category.slug, category.name]),
) as Record<Threat["categorySlug"], string>;

function defaultFaq(name: string): ThreatFaq[] {
  return [
    {
      question: `هل ظهور مؤشرات مرتبطة بـ ${name} يعني أن الضرر وقع بالكامل؟`,
      answer:
        "ليس بالضرورة. ظهور مؤشرات أولية يعني أن هناك احتمالًا يحتاج تحققًا منظمًا، لذلك من المهم جمع الأدلة، عزل النطاق المتأثر، وعدم تجاهل المؤشرات المبكرة.",
    },
    {
      question: "ما أول أولوية دفاعية في مثل هذه الحالة؟",
      answer:
        "الأولوية دائمًا هي تقليل الانتشار وحماية الوصول والبيانات، ثم توثيق ما حدث، ومراجعة السجلات، وطلب دعم مختص عند وجود أثر واضح أو خطر على أنظمة حساسة.",
    },
  ];
}

function inferThreatIcon(seed: ThreatSeed) {
  const hint = seed.slug.toLowerCase();

  if (hint.includes("denial") || hint.includes("ddos") || hint.includes("outage")) {
    return "service-outage";
  }

  if (
    hint.includes("sniff") ||
    hint.includes("intercept") ||
    hint.includes("session") ||
    hint.includes("spoof") ||
    hint.includes("recon")
  ) {
    return "network-signal";
  }

  if (
    hint.includes("ransom") ||
    hint.includes("encrypt") ||
    hint.includes("backup") ||
    hint.includes("extortion") ||
    hint.includes("lock")
  ) {
    return "file-lock";
  }

  if (
    hint.includes("phishing") ||
    hint.includes("social") ||
    hint.includes("login") ||
    hint.includes("sms") ||
    hint.includes("voice") ||
    hint.includes("link")
  ) {
    return "phishing-link";
  }

  if (
    hint.includes("account") ||
    hint.includes("password") ||
    hint.includes("credential") ||
    hint.includes("recovery") ||
    hint.includes("mfa")
  ) {
    return "account-lock";
  }

  if (
    hint.includes("malware") ||
    hint.includes("trojan") ||
    hint.includes("spy") ||
    hint.includes("stealer") ||
    hint.includes("adware")
  ) {
    return "malware-bug";
  }

  if (
    hint.includes("config") ||
    hint.includes("legacy") ||
    hint.includes("patch") ||
    hint.includes("log") ||
    hint.includes("monitor")
  ) {
    return "system-shield";
  }

  if (
    hint.includes("web") ||
    hint.includes("upload") ||
    hint.includes("auth") ||
    hint.includes("access") ||
    hint.includes("session") ||
    hint.includes("cookie")
  ) {
    return "web-globe";
  }

  if (
    hint.includes("data") ||
    hint.includes("cloud") ||
    hint.includes("storage") ||
    hint.includes("leak") ||
    hint.includes("backup")
  ) {
    return "data-vault";
  }

  if (
    hint.includes("email") ||
    hint.includes("mail") ||
    hint.includes("sender") ||
    hint.includes("attachment") ||
    hint.includes("spam")
  ) {
    return "mail-shield";
  }

  if (
    hint.includes("mobile") ||
    hint.includes("device") ||
    hint.includes("app") ||
    hint.includes("sim") ||
    hint.includes("sms") ||
    hint.includes("phone")
  ) {
    return "mobile-safe";
  }

  switch (seed.categorySlug) {
    case "network-attacks":
      return "network-signal";
    case "ransomware":
      return "file-lock";
    case "phishing-social-engineering":
      return "phishing-link";
    case "account-compromise":
      return "account-lock";
    case "malware":
      return "malware-bug";
    case "system-security":
      return "system-shield";
    case "web-threats":
      return "web-globe";
    case "data-exposure":
      return "data-vault";
    case "email-security":
      return "mail-shield";
    case "mobile-personal-security":
      return "mobile-safe";
    default:
      return "shield-alert";
  }
}

function defaultReachNarrative(seed: ThreatSeed) {
  switch (seed.categorySlug) {
    case "network-attacks":
      return `يصل تهديد ${seed.name} عادة عبر بنية اتصال مكشوفة أو خدمات شبكية متاحة أكثر من اللازم أو شبكات لا تطبق ضوابط تحقق ومراقبة كافية، ثم يظهر أثره على المرور أو التوافر أو ثقة الجلسات.`;
    case "ransomware":
      return `يصل ${seed.name} غالبًا من خلال ملف أو رابط أو حساب متأثر، ثم يمتد إلى الأجهزة والخوادم والنسخ المشتركة عندما تكون العزلة ضعيفة أو الصلاحيات واسعة أو النسخ الاحتياطية غير محمية جيدًا.`;
    case "phishing-social-engineering":
      return `يصل هذا التهديد إلى المستخدم عبر رسالة بريد أو نص أو مكالمة أو حساب منتحل يحاول دفعه إلى اتخاذ قرار سريع أو مشاركة بيانات حساسة أو زيارة صفحة تبدو شرعية.`;
    case "account-compromise":
      return `يصل ${seed.name} عادة عبر بيانات دخول مسربة أو جلسات غير محمية أو قنوات استرجاع ضعيفة، ما يسمح لجهة غير مخولة بالسيطرة على الحساب أو توسيع وصولها داخله.`;
    case "malware":
      return `يصل ${seed.name} من خلال ملفات أو تطبيقات أو مرفقات أو روابط خادعة، وقد ينتقل أيضًا عبر أدوات غير موثوقة أو وسائط تخزين أو حسابات سبق تأثرها داخل البيئة.`;
    case "system-security":
      return `يظهر أثر هذا التهديد عندما تصل إعدادات ضعيفة أو خدمات غير لازمة أو أنظمة قديمة إلى بيئة العمل دون مراجعة كافية، فيصبح الوصول إلى الأصول الحساسة أسهل أو تقل قدرة الفريق على الاكتشاف المبكر.`;
    case "web-threats":
      return `يصل تهديد ${seed.name} إلى الجهة عبر واجهات الويب أو المدخلات أو الجلسات أو مكونات الطرفية الخلفية عندما تكون الضوابط البرمجية أو الإعدادية غير كافية لحماية الطلبات والملفات والهوية.`;
    case "data-exposure":
      return `يصل هذا الخطر إلى البيانات عبر مشاركة غير مقصودة أو تخزين غير آمن أو صلاحيات زائدة أو خدمات سحابية لا تطبق تصنيفًا واضحًا، ما يزيد احتمال الاطلاع أو النسخ أو الانتشار خارج الغرض الأصلي.`;
    case "email-security":
      return `يصل ${seed.name} إلى المستخدم أو الجهة من خلال الرسائل الواردة أو المرفقات أو الروابط أو انتحال المرسل، وغالبًا يستفيد من الثقة الاعتيادية في البريد أو من ضعف إعدادات الحماية والتدقيق.`;
    case "mobile-personal-security":
      return `يصل هذا التهديد إلى الجوال أو الجهاز الشخصي عبر تطبيقات أو أذونات أو رسائل أو شبكات أو عمليات مزامنة لا تملك مستوى الثقة المطلوب، ثم ينعكس على خصوصية البيانات أو التحكم بالجهاز.`;
    default:
      return `يصل ${seed.name} إلى الهدف عندما تتقاطع ثغرات في السلوك أو الإعداد أو المراقبة مع فرصة مناسبة للاستغلال، لذلك يكون الفهم المبكر لمسار الوصول عنصرًا دفاعيًا أساسيًا.`;
  }
}

function defaultSelfProtection(seed: ThreatSeed) {
  switch (seed.categorySlug) {
    case "network-attacks":
      return [
        "استخدم شبكات موثوقة فقط عند الوصول إلى الحسابات أو الخدمات الحساسة، وتجنب تنفيذ المهام الحرجة من بيئات اتصال غير معروفة.",
        "فعّل التنبيهات على الحسابات والجلسات وراجع الأجهزة أو المواقع الموثوقة دوريًا لإزالة أي عنصر غير مألوف.",
        "حافظ على تحديث أجهزة الاتصال ونقاط الوصول، واطلب من الفريق التقني مراجعة أي تغير غير مفهوم في الأداء أو المرور.",
      ];
    case "ransomware":
      return [
        "احتفظ بنسخ احتياطية منفصلة ومختبرة بانتظام حتى لا يرتبط التعافي بسلامة البيئة المتأثرة نفسها.",
        "قلّل الصلاحيات اليومية على الأجهزة والحسابات، وافصل بين الاستخدام الاعتيادي والإداري كلما أمكن.",
        "تعامل بحذر مع الملفات والروابط المفاجئة وراقب أي توقفات أو رسائل غير اعتيادية على الأجهزة والخوادم.",
      ];
    case "phishing-social-engineering":
      return [
        "افترض أن الرسائل العاجلة أو الضاغطة تحتاج تحققًا إضافيًا قبل النقر أو الرد أو مشاركة أي بيانات.",
        "تحقق من عنوان الجهة والروابط وصفحات الدخول يدويًا بدل الاعتماد على الرسالة نفسها.",
        "فعّل المصادقة المتعددة والتنبيهات الأمنية حتى لا تعتمد حماية الحساب على كلمة المرور فقط.",
      ];
    case "account-compromise":
      return [
        "استخدم كلمات مرور قوية وفريدة لكل حساب، وغيّرها فور ملاحظة أي نشاط غير معتاد أو تسرب محتمل.",
        "فعّل المصادقة المتعددة وراجع وسائل الاسترجاع والجلسات النشطة والتطبيقات المرتبطة بالحساب.",
        "تجنب مشاركة رموز التحقق أو إعادة استخدام معلومات دخول العمل في خدمات أخرى.",
      ];
    case "malware":
      return [
        "ثبّت التطبيقات من مصادر موثوقة فقط، وراجع الأذونات والمرفقات قبل فتحها أو تشغيلها.",
        "فعّل الحماية المدمجة أو المؤسسية على الجهاز، وحدث النظام والمتصفح والتطبيقات باستمرار.",
        "اعزل الجهاز عند ظهور بطء شديد أو ملفات غريبة أو سلوك غير مألوف حتى يتم التحقق منه بأمان.",
      ];
    case "system-security":
      return [
        "اعتمد خط أساس أمني واضح للإعدادات والتحديثات والخدمات المسموح بها على كل نوع من الأنظمة.",
        "راجع الصلاحيات والحسابات والخدمات غير الضرورية بجدول دوري بدل تركها تتوسع بمرور الوقت.",
        "اربط السجلات والتنبيهات بمؤشرات تشغيلية مفهومة حتى لا تضيع الإشارات المبكرة للحوادث.",
      ];
    case "web-threats":
      return [
        "طبّق مبدأ أقل صلاحية على الحسابات والواجهات والإضافات التي تتعامل مع التطبيق أو لوحة الإدارة.",
        "حدّث المكونات البرمجية والإضافات باستمرار وراجع إعدادات الجلسات ورفع الملفات وكشف الأخطاء.",
        "استخدم بيئات اختبار ومراجعات دورية قبل نشر تغييرات قد تؤثر على التحقق أو الجلسات أو البيانات.",
      ];
    case "data-exposure":
      return [
        "صنّف البيانات وحدد من يحتاج الوصول إليها فعليًا قبل مشاركتها أو تخزينها أو مزامنتها.",
        "استخدم وسائل تخزين ومشاركة معتمدة تحترم الصلاحيات والتشفير والسجلات بدل الحلول العشوائية.",
        "احذف أو قيد النسخ الزائدة وراجع الروابط المشتركة والأجهزة المحمولة والنسخ الاحتياطية باستمرار.",
      ];
    case "email-security":
      return [
        "تحقق من المرسل وسياق الرسالة قبل فتح المرفقات أو الروابط، خاصة عند وجود استعجال أو طلب غير معتاد.",
        "قسّم استخدام البريد بين الرسائل الاعتيادية والعمليات الحساسة، وراجع الصناديق المشتركة والصلاحيات بعناية.",
        "فعّل الحماية البريدية والتنبيهات وطرق الاسترجاع الآمنة حتى لا يتحول البريد إلى بوابة لحوادث أوسع.",
      ];
    case "mobile-personal-security":
      return [
        "حمّل التطبيقات من مصادر موثوقة فقط وراجع الأذونات بشكل دوري ولا تمنح صلاحيات أوسع من الحاجة.",
        "استخدم قفلًا قويًا للجهاز وفعّل التحديثات والنسخ الاحتياطي المشفر وميزة العثور على الجهاز عند الفقد.",
        "تجنب الشبكات والرسائل والروابط غير الموثوقة، وافصل العمل الحساس عن الجهاز الشخصي متى أمكن.",
      ];
    default:
      return [
        "اعتمد على مصادر موثوقة فقط للوصول والتحديث والمشاركة، وفعّل التنبيهات والمصادقة متعددة العوامل حيثما أمكن.",
        "راقب أي تغييرات غير معتادة في الأداء أو الوصول أو الرسائل أو الجلسات، ولا تؤجل التحقق من العلامات المبكرة.",
        "اعزل النطاق المتأثر بسرعة واطلب مساعدة مختص إذا تجاوزت الحالة حدود الفحص الآمن الأولي.",
      ];
  }
}

export function createThreat(seed: ThreatSeed): Threat {
  return {
    ...seed,
    keywords: seed.keywords ?? [],
    category: categoryNameMap[seed.categorySlug],
    icon: seed.icon ?? inferThreatIcon(seed),
    fullDescription: `${seed.definition} ${seed.overview} ${seed.context}`,
    howItReachesTarget: seed.howItReachesTarget ?? defaultReachNarrative(seed),
    selfProtection: seed.selfProtection ?? defaultSelfProtection(seed),
    faq: seed.faq ?? defaultFaq(seed.name),
  };
}
