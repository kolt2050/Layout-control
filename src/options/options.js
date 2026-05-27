"use strict";

const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  mode: "both",
  minLength: 4,
  cooldownMs: 2000,
  volume: 50,
  excludedSites: [],
  enabledLanguages: globalThis.LayoutGuard.KeyboardMap.DEFAULT_ENABLED_LANGUAGE_IDS
});

const TRANSLATIONS = Object.freeze({
  en: {
    pageTitle: "Layout Guard Settings",
    subtitle: "Wrong keyboard layout warning settings. Detection runs locally in your browser.",
    summaryAria: "How Layout Guard works",
    summaryTitle: "Typed in the wrong layout?",
    summaryDetect: "If your text looks like a real word in another layout, Layout Guard gives you a quick sound reminder.",
    summaryWhere: "It listens only in fields on web pages, not in the browser address bar, New Tab search, or Ctrl+F.",
    summaryNoise: "To avoid bothering you, it skips short, random, or already valid words.",
    general: "General",
    enable: "Enable extension",
    mode: "Detection mode",
    live: "Live",
    complete: "Word-complete",
    both: "Both",
    minLength: "Minimum character threshold",
    cooldown: "Cooldown (milliseconds)",
    volume: "Audio volume",
    languages: "Languages",
    languagesHint: "English (US QWERTY) is the base layout. Choose the additional layouts to check against it.",
    languagesAria: "Enabled languages",
    exclusions: "Site exclusions",
    disabledDomains: "Disabled domains, one per line",
    detectionTest: "Detection test",
    typePrefix: "Type",
    typeSuffix: "or another wrong-layout word here",
    testPlaceholder: "Type a wrong-layout word",
    testIdle: "The warning should sound as soon as a wrong-layout word is recognized.",
    save: "Save settings",
    testSound: "Test sound",
    saved: "Saved",
    played: "Sound played",
    blocked: "Browser blocked audio",
    loading: "Loading dictionaries...",
    noMatch: "No wrong-layout word recognized yet.",
    languageNames: {
      ru: "Russian", uk: "Ukrainian", de: "German", fr: "French", el: "Greek",
      he: "Hebrew", ar: "Arabic", fa: "Persian", es: "Spanish"
    }
  },
  ru: {
    pageTitle: "Настройки Layout Guard",
    subtitle: "Настройки предупреждения о неверной раскладке. Проверка выполняется локально в браузере.",
    summaryAria: "Как работает Layout Guard",
    summaryTitle: "Набрали в неправильной раскладке?",
    summaryDetect: "Если текст похож на настоящее слово в другой раскладке, Layout Guard коротко напомнит об этом звуком.",
    summaryWhere: "Он слушает только поля на веб-страницах, но не адресную строку, поиск новой вкладки или Ctrl+F.",
    summaryNoise: "Чтобы не мешать, короткие, случайные и уже правильные слова пропускаются.",
    general: "Основные",
    enable: "Включить расширение",
    mode: "Режим проверки",
    live: "Во время ввода",
    complete: "После слова",
    both: "Оба",
    minLength: "Минимальная длина слова",
    cooldown: "Пауза между сигналами (мс)",
    volume: "Громкость сигнала",
    languages: "Языки",
    languagesHint: "English (US QWERTY) используется как базовая раскладка. Выберите раскладки для проверки.",
    languagesAria: "Включённые языки",
    exclusions: "Исключения сайтов",
    disabledDomains: "Отключённые домены, по одному в строке",
    detectionTest: "Проверка распознавания",
    typePrefix: "Введите",
    typeSuffix: "или другое слово в неверной раскладке",
    testPlaceholder: "Введите слово в неверной раскладке",
    testIdle: "Сигнал прозвучит, когда будет распознано слово в неверной раскладке.",
    save: "Сохранить",
    testSound: "Проверить звук",
    saved: "Сохранено",
    played: "Звук воспроизведён",
    blocked: "Браузер заблокировал звук",
    loading: "Загрузка словарей...",
    noMatch: "Слово в неверной раскладке не распознано.",
    languageNames: {
      ru: "Русский", uk: "Украинский", de: "Немецкий", fr: "Французский", el: "Греческий",
      he: "Иврит", ar: "Арабский", fa: "Персидский", es: "Испанский"
    }
  },
  uk: {
    pageTitle: "Налаштування Layout Guard",
    subtitle: "Налаштування попередження про неправильну розкладку. Перевірка виконується локально у браузері.",
    summaryAria: "Як працює Layout Guard",
    summaryTitle: "Набрали в неправильній розкладці?",
    summaryDetect: "Якщо текст схожий на справжнє слово в іншій розкладці, Layout Guard коротко нагадає про це звуком.",
    summaryWhere: "Він слухає лише поля на веб-сторінках, але не адресний рядок, пошук нової вкладки чи Ctrl+F.",
    summaryNoise: "Щоб не заважати, короткі, випадкові та вже правильні слова пропускаються.",
    general: "Загальні",
    enable: "Увімкнути розширення",
    mode: "Режим перевірки",
    live: "Під час введення",
    complete: "Після слова",
    both: "Обидва",
    minLength: "Мінімальна довжина слова",
    cooldown: "Пауза між сигналами (мс)",
    volume: "Гучність сигналу",
    languages: "Мови",
    languagesHint: "English (US QWERTY) використовується як базова розкладка. Виберіть розкладки для перевірки.",
    languagesAria: "Увімкнені мови",
    exclusions: "Виключення сайтів",
    disabledDomains: "Вимкнені домени, по одному в рядку",
    detectionTest: "Перевірка розпізнавання",
    typePrefix: "Введіть",
    typeSuffix: "або інше слово у неправильній розкладці",
    testPlaceholder: "Введіть слово у неправильній розкладці",
    testIdle: "Сигнал пролунає, щойно буде розпізнано слово у неправильній розкладці.",
    save: "Зберегти",
    testSound: "Перевірити звук",
    saved: "Збережено",
    played: "Звук відтворено",
    blocked: "Браузер заблокував звук",
    loading: "Завантаження словників...",
    noMatch: "Слово у неправильній розкладці не розпізнано.",
    languageNames: {
      ru: "Російська", uk: "Українська", de: "Німецька", fr: "Французька", el: "Грецька",
      he: "Іврит", ar: "Арабська", fa: "Перська", es: "Іспанська"
    }
  },
  de: {
    pageTitle: "Layout Guard Einstellungen",
    subtitle: "Warnungen bei falschem Tastaturlayout. Die Erkennung erfolgt lokal im Browser.",
    summaryAria: "Funktionsweise von Layout Guard",
    summaryTitle: "Im falschen Layout getippt?",
    summaryDetect: "Wenn Ihr Text in einem anderen Layout wie ein echtes Wort aussieht, erinnert Layout Guard Sie kurz per Ton.",
    summaryWhere: "Es hört nur in Feldern auf Webseiten mit, nicht in der Adressleiste, der Suche der neuen Registerkarte oder Strg+F.",
    summaryNoise: "Damit es nicht stört, werden kurze, zufällige oder bereits richtige Wörter übersprungen.",
    general: "Allgemein",
    enable: "Erweiterung aktivieren",
    mode: "Erkennungsmodus",
    live: "Während der Eingabe",
    complete: "Nach Wortabschluss",
    both: "Beides",
    minLength: "Mindestwortlänge",
    cooldown: "Pause zwischen Signalen (ms)",
    volume: "Lautstärke",
    languages: "Sprachen",
    languagesHint: "English (US QWERTY) ist das Basislayout. Wählen Sie zusätzliche Layouts zur Prüfung.",
    languagesAria: "Aktivierte Sprachen",
    exclusions: "Website-Ausschlüsse",
    disabledDomains: "Deaktivierte Domains, eine pro Zeile",
    detectionTest: "Erkennung testen",
    typePrefix: "Geben Sie",
    typeSuffix: "oder ein anderes Wort im falschen Layout ein",
    testPlaceholder: "Wort im falschen Layout eingeben",
    testIdle: "Der Warnton ertönt, sobald ein Wort im falschen Layout erkannt wird.",
    save: "Einstellungen speichern",
    testSound: "Ton testen",
    saved: "Gespeichert",
    played: "Ton abgespielt",
    blocked: "Der Browser hat Audio blockiert",
    loading: "Wörterbücher werden geladen...",
    noMatch: "Kein Wort im falschen Layout erkannt.",
    languageNames: {
      ru: "Russisch", uk: "Ukrainisch", de: "Deutsch", fr: "Französisch", el: "Griechisch",
      he: "Hebräisch", ar: "Arabisch", fa: "Persisch", es: "Spanisch"
    }
  },
  fr: {
    pageTitle: "Paramètres de Layout Guard",
    subtitle: "Paramètres d'alerte de mauvaise disposition clavier. La détection reste locale dans le navigateur.",
    summaryAria: "Fonctionnement de Layout Guard",
    summaryTitle: "Saisi avec la mauvaise disposition ?",
    summaryDetect: "Si votre texte ressemble à un vrai mot dans une autre disposition, Layout Guard vous le rappelle par un bref son.",
    summaryWhere: "Il écoute seulement les champs des pages web, pas la barre d'adresse, la recherche du nouvel onglet ou Ctrl+F.",
    summaryNoise: "Pour ne pas vous déranger, il ignore les mots courts, aléatoires ou déjà corrects.",
    general: "Général",
    enable: "Activer l'extension",
    mode: "Mode de détection",
    live: "Pendant la saisie",
    complete: "Mot terminé",
    both: "Les deux",
    minLength: "Longueur minimale du mot",
    cooldown: "Délai entre alertes (ms)",
    volume: "Volume audio",
    languages: "Langues",
    languagesHint: "English (US QWERTY) est la disposition de base. Choisissez les dispositions supplémentaires à vérifier.",
    languagesAria: "Langues activées",
    exclusions: "Sites exclus",
    disabledDomains: "Domaines désactivés, un par ligne",
    detectionTest: "Test de détection",
    typePrefix: "Saisissez",
    typeSuffix: "ou un autre mot dans la mauvaise disposition",
    testPlaceholder: "Saisissez un mot dans la mauvaise disposition",
    testIdle: "L'alerte retentit dès qu'un mot dans la mauvaise disposition est reconnu.",
    save: "Enregistrer",
    testSound: "Tester le son",
    saved: "Enregistré",
    played: "Son joué",
    blocked: "Le navigateur a bloqué le son",
    loading: "Chargement des dictionnaires...",
    noMatch: "Aucun mot dans la mauvaise disposition reconnu.",
    languageNames: {
      ru: "Russe", uk: "Ukrainien", de: "Allemand", fr: "Français", el: "Grec",
      he: "Hébreu", ar: "Arabe", fa: "Persan", es: "Espagnol"
    }
  },
  el: {
    pageTitle: "Ρυθμίσεις Layout Guard",
    subtitle: "Ρυθμίσεις ειδοποίησης για λάθος διάταξη πληκτρολογίου. Η ανίχνευση γίνεται τοπικά στον browser.",
    summaryAria: "Πώς λειτουργεί το Layout Guard",
    summaryTitle: "Πληκτρολογήσατε με λάθος διάταξη;",
    summaryDetect: "Αν το κείμενό σας μοιάζει με πραγματική λέξη σε άλλη διάταξη, το Layout Guard σας το θυμίζει με έναν σύντομο ήχο.",
    summaryWhere: "Ακούει μόνο πεδία σε ιστοσελίδες, όχι τη γραμμή διεύθυνσης, την αναζήτηση νέας καρτέλας ή το Ctrl+F.",
    summaryNoise: "Για να μην ενοχλεί, παραλείπει σύντομες, τυχαίες ή ήδη σωστές λέξεις.",
    general: "Γενικά",
    enable: "Ενεργοποίηση επέκτασης",
    mode: "Λειτουργία ανίχνευσης",
    live: "Κατά την πληκτρολόγηση",
    complete: "Με την ολοκλήρωση λέξης",
    both: "Και τα δύο",
    minLength: "Ελάχιστο μήκος λέξης",
    cooldown: "Παύση μεταξύ ήχων (ms)",
    volume: "Ένταση ήχου",
    languages: "Γλώσσες",
    languagesHint: "Το English (US QWERTY) είναι η βασική διάταξη. Επιλέξτε πρόσθετες διατάξεις για έλεγχο.",
    languagesAria: "Ενεργές γλώσσες",
    exclusions: "Εξαιρέσεις ιστοτόπων",
    disabledDomains: "Απενεργοποιημένοι τομείς, ένας ανά γραμμή",
    detectionTest: "Δοκιμή ανίχνευσης",
    typePrefix: "Πληκτρολογήστε",
    typeSuffix: "ή άλλη λέξη με λάθος διάταξη",
    testPlaceholder: "Λέξη με λάθος διάταξη",
    testIdle: "Η ειδοποίηση ακούγεται μόλις αναγνωριστεί λέξη με λάθος διάταξη.",
    save: "Αποθήκευση",
    testSound: "Δοκιμή ήχου",
    saved: "Αποθηκεύτηκε",
    played: "Ο ήχος αναπαράχθηκε",
    blocked: "Ο browser απέκλεισε τον ήχο",
    loading: "Φόρτωση λεξικών...",
    noMatch: "Δεν αναγνωρίστηκε λέξη με λάθος διάταξη.",
    languageNames: {
      ru: "Ρωσικά", uk: "Ουκρανικά", de: "Γερμανικά", fr: "Γαλλικά", el: "Ελληνικά",
      he: "Εβραϊκά", ar: "Αραβικά", fa: "Περσικά", es: "Ισπανικά"
    }
  },
  he: {
    pageTitle: "הגדרות Layout Guard",
    subtitle: "הגדרות התראה על פריסת מקלדת שגויה. הזיהוי מתבצע מקומית בדפדפן.",
    summaryAria: "כיצד Layout Guard פועל",
    summaryTitle: "הקלדתם בפריסה הלא נכונה?",
    summaryDetect: "אם הטקסט נראה כמו מילה אמיתית בפריסה אחרת, Layout Guard מזכיר לכם בצליל קצר.",
    summaryWhere: "הוא מאזין רק לשדות בדפי אינטרנט, לא לשורת הכתובת, לחיפוש בכרטיסייה חדשה או ל-Ctrl+F.",
    summaryNoise: "כדי לא להפריע, הוא מדלג על מילים קצרות, אקראיות או נכונות כבר.",
    general: "כללי",
    enable: "הפעלת התוסף",
    mode: "מצב זיהוי",
    live: "בזמן הקלדה",
    complete: "בסיום מילה",
    both: "שניהם",
    minLength: "אורך מילה מינימלי",
    cooldown: "השהיה בין התראות (ms)",
    volume: "עוצמת קול",
    languages: "שפות",
    languagesHint: "English (US QWERTY) היא פריסת הבסיס. בחרו פריסות נוספות לבדיקה.",
    languagesAria: "שפות פעילות",
    exclusions: "חריגות אתרים",
    disabledDomains: "דומיינים מושבתים, אחד בכל שורה",
    detectionTest: "בדיקת זיהוי",
    typePrefix: "הקלידו",
    typeSuffix: "או מילה אחרת בפריסה שגויה",
    testPlaceholder: "הקלידו מילה בפריסה שגויה",
    testIdle: "ההתראה תישמע ברגע שתזוהה מילה בפריסה שגויה.",
    save: "שמירת הגדרות",
    testSound: "בדיקת צליל",
    saved: "נשמר",
    played: "הצליל הושמע",
    blocked: "הדפדפן חסם שמע",
    loading: "טוען מילונים...",
    noMatch: "לא זוהתה מילה בפריסה שגויה.",
    languageNames: {
      ru: "רוסית", uk: "אוקראינית", de: "גרמנית", fr: "צרפתית", el: "יוונית",
      he: "עברית", ar: "ערבית", fa: "פרסית", es: "ספרדית"
    }
  },
  ar: {
    pageTitle: "إعدادات Layout Guard",
    subtitle: "إعدادات التنبيه للكتابة بتخطيط لوحة مفاتيح خاطئ. يتم الكشف محلياً في المتصفح.",
    summaryAria: "كيفية عمل Layout Guard",
    summaryTitle: "كتبت باستخدام التخطيط الخطأ؟",
    summaryDetect: "إذا بدا النص كلمة حقيقية في تخطيط آخر، يذكّرك Layout Guard بصوت قصير.",
    summaryWhere: "يستمع فقط إلى الحقول داخل صفحات الويب، وليس إلى شريط العنوان أو بحث علامة التبويب الجديدة أو Ctrl+F.",
    summaryNoise: "حتى لا يزعجك، يتجاوز الكلمات القصيرة أو العشوائية أو الصحيحة بالفعل.",
    general: "عام",
    enable: "تفعيل الإضافة",
    mode: "وضع الكشف",
    live: "أثناء الكتابة",
    complete: "عند اكتمال الكلمة",
    both: "كلاهما",
    minLength: "الحد الأدنى لطول الكلمة",
    cooldown: "الفاصل بين التنبيهات (مللي ثانية)",
    volume: "مستوى الصوت",
    languages: "اللغات",
    languagesHint: "تخطيط English (US QWERTY) هو الأساس. اختر التخطيطات الإضافية لفحصها.",
    languagesAria: "اللغات المفعّلة",
    exclusions: "استثناءات المواقع",
    disabledDomains: "النطاقات المعطلة، نطاق واحد في كل سطر",
    detectionTest: "اختبار الكشف",
    typePrefix: "اكتب",
    typeSuffix: "أو كلمة أخرى بتخطيط خاطئ",
    testPlaceholder: "اكتب كلمة بتخطيط خاطئ",
    testIdle: "سيصدر التنبيه بمجرد التعرف على كلمة بتخطيط خاطئ.",
    save: "حفظ الإعدادات",
    testSound: "اختبار الصوت",
    saved: "تم الحفظ",
    played: "تم تشغيل الصوت",
    blocked: "حظر المتصفح الصوت",
    loading: "جارٍ تحميل القواميس...",
    noMatch: "لم يتم التعرف على كلمة بتخطيط خاطئ.",
    languageNames: {
      ru: "الروسية", uk: "الأوكرانية", de: "الألمانية", fr: "الفرنسية", el: "اليونانية",
      he: "العبرية", ar: "العربية", fa: "الفارسية", es: "الإسبانية"
    }
  },
  fa: {
    pageTitle: "تنظیمات Layout Guard",
    subtitle: "تنظیمات هشدار برای چیدمان نادرست صفحه‌کلید. تشخیص به‌صورت محلی در مرورگر انجام می‌شود.",
    summaryAria: "نحوه کار Layout Guard",
    summaryTitle: "با چیدمان اشتباه تایپ کردید؟",
    summaryDetect: "اگر متن شما در چیدمانی دیگر شبیه یک واژه واقعی باشد، Layout Guard با صدایی کوتاه یادآوری می‌کند.",
    summaryWhere: "فقط به فیلدهای صفحات وب گوش می‌دهد، نه نوار آدرس، جستجوی زبانه جدید یا Ctrl+F.",
    summaryNoise: "برای مزاحم نشدن، واژه‌های کوتاه، تصادفی یا از قبل درست را رد می‌کند.",
    general: "عمومی",
    enable: "فعال کردن افزونه",
    mode: "حالت تشخیص",
    live: "هنگام تایپ",
    complete: "پس از تکمیل واژه",
    both: "هر دو",
    minLength: "حداقل طول واژه",
    cooldown: "فاصله بین هشدارها (میلی‌ثانیه)",
    volume: "بلندی صدا",
    languages: "زبان‌ها",
    languagesHint: "English (US QWERTY) چیدمان پایه است. چیدمان‌های اضافی برای بررسی را انتخاب کنید.",
    languagesAria: "زبان‌های فعال",
    exclusions: "استثناهای سایت",
    disabledDomains: "دامنه‌های غیرفعال، هر کدام در یک خط",
    detectionTest: "آزمون تشخیص",
    typePrefix: "تایپ کنید",
    typeSuffix: "یا واژه دیگری با چیدمان نادرست",
    testPlaceholder: "واژه‌ای با چیدمان نادرست تایپ کنید",
    testIdle: "به محض شناسایی واژه با چیدمان نادرست، هشدار پخش می‌شود.",
    save: "ذخیره تنظیمات",
    testSound: "آزمون صدا",
    saved: "ذخیره شد",
    played: "صدا پخش شد",
    blocked: "مرورگر صدا را مسدود کرد",
    loading: "در حال بارگذاری فرهنگ‌ها...",
    noMatch: "واژه‌ای با چیدمان نادرست شناسایی نشد.",
    languageNames: {
      ru: "روسی", uk: "اوکراینی", de: "آلمانی", fr: "فرانسوی", el: "یونانی",
      he: "عبری", ar: "عربی", fa: "فارسی", es: "اسپانیایی"
    }
  },
  es: {
    pageTitle: "Configuración de Layout Guard",
    subtitle: "Configuración de avisos por distribución de teclado incorrecta. La detección se realiza localmente en el navegador.",
    summaryAria: "Cómo funciona Layout Guard",
    summaryTitle: "¿Escribió con la distribución equivocada?",
    summaryDetect: "Si el texto parece una palabra real en otra distribución, Layout Guard se lo recuerda con un sonido breve.",
    summaryWhere: "Solo escucha campos de páginas web, no la barra de direcciones, la búsqueda de Nueva pestaña ni Ctrl+F.",
    summaryNoise: "Para no molestar, omite palabras cortas, aleatorias o que ya son correctas.",
    general: "General",
    enable: "Activar extensión",
    mode: "Modo de detección",
    live: "Mientras escribe",
    complete: "Palabra completa",
    both: "Ambos",
    minLength: "Longitud mínima de palabra",
    cooldown: "Pausa entre avisos (ms)",
    volume: "Volumen de audio",
    languages: "Idiomas",
    languagesHint: "English (US QWERTY) es la distribución base. Elija las distribuciones adicionales que desea comprobar.",
    languagesAria: "Idiomas activados",
    exclusions: "Exclusiones de sitios",
    disabledDomains: "Dominios desactivados, uno por línea",
    detectionTest: "Prueba de detección",
    typePrefix: "Escriba",
    typeSuffix: "u otra palabra con distribución incorrecta",
    testPlaceholder: "Escriba una palabra con distribución incorrecta",
    testIdle: "El aviso sonará en cuanto se reconozca una palabra con distribución incorrecta.",
    save: "Guardar configuración",
    testSound: "Probar sonido",
    saved: "Guardado",
    played: "Sonido reproducido",
    blocked: "El navegador bloqueó el audio",
    loading: "Cargando diccionarios...",
    noMatch: "No se reconoció ninguna palabra con distribución incorrecta.",
    languageNames: {
      ru: "Ruso", uk: "Ucraniano", de: "Alemán", fr: "Francés", el: "Griego",
      he: "Hebreo", ar: "Árabe", fa: "Persa", es: "Español"
    }
  }
});

const form = document.querySelector("#settings");
const status = document.querySelector("#status");
const testSound = document.querySelector("#testSound");
const warningAudio = new globalThis.LayoutGuard.WarningAudio();
const detectionTest = document.querySelector("#detectionTest");
const detectionStatus = document.querySelector("#detectionStatus");
const localeControl = document.querySelector("#uiLocale");
let detector = null;
let currentLocale = "en";
const controls = {
  enabled: document.querySelector("#enabled"),
  mode: document.querySelector("#mode"),
  minLength: document.querySelector("#minLength"),
  cooldownMs: document.querySelector("#cooldownMs"),
  volume: document.querySelector("#volume"),
  volumeValue: document.querySelector("#volumeValue"),
  excludedSites: document.querySelector("#excludedSites"),
  languages: document.querySelector("#languages")
};

function renderLanguages(enabledLanguageIds) {
  controls.languages.replaceChildren();
  const strings = translation();
  const collator = new Intl.Collator(currentLocale, { sensitivity: "base" });
  const profiles = [...globalThis.LayoutGuard.KeyboardMap.profiles].sort((left, right) => (
    collator.compare(strings.languageNames[left.id], strings.languageNames[right.id])
  ));
  for (const profile of profiles) {
    const label = document.createElement("label");
    label.className = "language";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "enabledLanguage";
    input.value = profile.id;
    input.checked = enabledLanguageIds.includes(profile.id);
    const caption = document.createElement("span");
    caption.textContent = `${strings.languageNames[profile.id]} (${profile.id.toUpperCase()})`;
    label.append(input, caption);
    controls.languages.append(label);
  }
}

async function restoreSettings() {
  const settings = await chrome.storage.sync.get({
    ...DEFAULT_SETTINGS,
    uiLocale: null,
    uiLocaleCustomized: false
  });
  const enabledLanguages = Array.isArray(settings.enabledLanguages)
    ? settings.enabledLanguages
    : DEFAULT_SETTINGS.enabledLanguages;
  currentLocale = settings.uiLocaleCustomized && TRANSLATIONS[settings.uiLocale]
    ? settings.uiLocale
    : browserLocale();
  applyLocale();
  controls.enabled.checked = settings.enabled !== false;
  controls.mode.value = ["live", "complete", "both"].includes(settings.mode) ? settings.mode : "both";
  controls.minLength.value = clamp(settings.minLength, 2, 10, 4);
  controls.cooldownMs.value = clamp(settings.cooldownMs, 0, 30000, 2000);
  controls.volume.value = clamp(settings.volume, 0, 100, 50);
  controls.excludedSites.value = Array.isArray(settings.excludedSites) ? settings.excludedSites.join("\n") : "";
  renderLanguages(enabledLanguages);
  showVolume();

  const dictionaries = { en: await fetchDictionary("dictionary/en.json") };
  await Promise.all(globalThis.LayoutGuard.KeyboardMap.profiles.map(async (profile) => {
    dictionaries[profile.id] = await fetchDictionary(profile.dictionaryPath);
  }));
  detector = new globalThis.LayoutGuard.Detector({
    dictionaries,
    keyboardMap: globalThis.LayoutGuard.KeyboardMap
  });
}

function translation() {
  return TRANSLATIONS[currentLocale];
}

function browserLocale() {
  const primaryLanguage = String(chrome.i18n.getUILanguage() || "").toLowerCase().split("-")[0];
  return TRANSLATIONS[primaryLanguage] ? primaryLanguage : "en";
}

function applyLocale() {
  const strings = translation();
  document.documentElement.lang = currentLocale;
  document.documentElement.dir = ["he", "ar", "fa"].includes(currentLocale) ? "rtl" : "ltr";
  document.title = strings.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = strings[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", strings[element.dataset.i18nAria]);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = strings[element.dataset.i18nPlaceholder];
  });
  localeControl.value = currentLocale;
  detectionStatus.textContent = strings.testIdle;
  if (controls.languages.children.length) {
    renderLanguages(selectedLanguages());
  }
}

async function fetchDictionary(path) {
  const response = await fetch(chrome.runtime.getURL(path));
  if (!response.ok) {
    throw new Error(`Failed loading ${path}: ${response.status}`);
  }
  return new Set((await response.json()).map((word) => globalThis.LayoutGuard.KeyboardMap.normalize(word)));
}

function clamp(value, minimum, maximum, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(maximum, Math.max(minimum, numeric)) : fallback;
}

function normalizedDomains() {
  return [...new Set(controls.excludedSites.value.split(/\r?\n|,/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .map((entry) => entry.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^\*\./, "")))];
}

function selectedLanguages() {
  return [...controls.languages.querySelectorAll("input:checked")].map((input) => input.value);
}

function showVolume() {
  controls.volumeValue.textContent = `${controls.volume.value}%`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await chrome.storage.sync.set({
    enabled: controls.enabled.checked,
    mode: controls.mode.value,
    minLength: clamp(controls.minLength.value, 2, 10, 4),
    cooldownMs: clamp(controls.cooldownMs.value, 0, 30000, 2000),
    volume: clamp(controls.volume.value, 0, 100, 50),
    excludedSites: normalizedDomains(),
    enabledLanguages: selectedLanguages(),
    uiLocale: currentLocale,
    uiLocaleCustomized: true
  });
  status.textContent = translation().saved;
  setTimeout(() => {
    status.textContent = "";
  }, 1500);
});

controls.volume.addEventListener("input", showVolume);
localeControl.addEventListener("change", async () => {
  currentLocale = TRANSLATIONS[localeControl.value] ? localeControl.value : "en";
  applyLocale();
  await chrome.storage.sync.set({ uiLocale: currentLocale, uiLocaleCustomized: true });
});
testSound.addEventListener("click", async () => {
  const played = await warningAudio.beep(clamp(controls.volume.value, 0, 100, 50), 0);
  status.textContent = played ? translation().played : translation().blocked;
  setTimeout(() => {
    status.textContent = "";
  }, 1500);
});
detectionTest.addEventListener("keydown", () => warningAudio.unlock());
detectionTest.addEventListener("input", async () => {
  if (!detector) {
    detectionStatus.textContent = translation().loading;
    return;
  }
  const matches = detector.detect(detectionTest.value, clamp(controls.minLength.value, 2, 10, 4), selectedLanguages());
  if (!matches.length) {
    detectionStatus.textContent = translation().noMatch;
    return;
  }
  const played = await warningAudio.beep(clamp(controls.volume.value, 0, 100, 50), 0);
  const lines = matches.map((match) => `${translation().languageNames[match.languageId]}: ${match.typed} -> ${match.converted}`);
  detectionStatus.textContent = `${lines.join("\n")}\n${played ? `${translation().played}.` : `${translation().blocked}.`}`;
});
restoreSettings().catch((error) => {
  status.textContent = currentLocale === "en" ? "Settings could not be loaded." : translation().loading;
  console.error(error);
});
