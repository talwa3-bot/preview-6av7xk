"""Publish factual information about the actual preview implementation."""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / 'studio'

PRIVACY = [
    ('המידע בטופס הפנייה', 'Enquiry information',
     'הטופס כולל שם, שם חברה (רשות), טלפון, מייל, סניף, נושא, בחירת שותף ותוכן הפנייה. המידע מיועד לטיפול בפנייה וליצירת קשר בעניין השירות המבוקש.',
     'The enquiry form includes your name, optional company name, phone, email, office, subject, partner preference and message. This information is intended to help the firm respond to your enquiry.'),
    ('כיצד נשלחת הפנייה', 'How enquiries are sent',
     'הטופס מכין הודעה בדפדפן. הוא אינו שולח את הפרטים אוטומטית למשרד ואינו שומר אותם בשרת של האתר. לאחר ההכנה מוצג קישור לוואטסאפ או לתוכנת המייל. פתיחת הקישור מעבירה את פרטי ההודעה לשירות שבחרתם לצורך הכנתה. שליחת ההודעה למשרד מתבצעת על ידכם באותו שירות.',
     'The form prepares a message in your browser. It does not automatically send your details to the firm or store them on the website server. A link then opens WhatsApp or your email app with the message details. You review and send the message in the selected service.'),
    ('שאלוני פרופילים', 'Profile questionnaires',
     'השאלונים האישיים המקוונים שומרים את התשובות במערכת נפרדת לצורך עדכון פרופילי הצוות. התשובות המקצועיות שנשלחות מוצגות בפרופיל באתר; קישורי קבצים והערות לטל נשמרים לבדיקה ואינם מוצגים בפרופיל הציבורי. השאלון המקומי הישן, המוריד קובץ, נשאר ככלי גיבוי.',
     'Personal online questionnaires store answers in a separate system for staff profile updates. Submitted professional answers appear in the website profile; document links and notes to Tal are retained for review and excluded from the public profile. The older download-only questionnaire remains a backup.'),
    ('מפות הסניפים', 'Office maps',
     'מפות הסניפים משובצות באמצעות Google Maps ונטענות משירות חיצוני. בעת טעינת מפה מועברים לשירות נתוני החיבור של הדפדפן. אפשר לפתוח את קישור הניווט לצד כל כתובת.',
     'Office maps are embedded using Google Maps and load from an external service. Loading a map shares browser connection data with that service. A separate directions link is also provided beside each address.'),
    ('העדפות בדפדפן', 'Browser preferences',
     'העדפת הפחתת התנועה נשמרת מקומית בדפדפן כדי להחיל את בחירתכם בביקורים נוספים. האתר אינו שומר שם את תוכן הפניות. הגדרות מילוי אוטומטי ושמירת נתונים של הדפדפן מנוהלות על ידכם בהגדרות הדפדפן.',
     'Your reduced-motion preference is stored locally in the browser for future visits. The site does not store enquiry content there. Browser autofill and its own data-storage preferences are managed in your browser settings.'),
    ('שירותים חיצוניים', 'External services',
     'האתר מאוחסן ב־GitHub Pages. קישורי ניווט מפנים למפות גוגל; קישורי הודעות מפנים לוואטסאפ או לתוכנת המייל שלכם. השימוש בשירותים אלה כפוף למדיניות של הספק הרלוונטי. באתר הראשי אין כלי מעקב או מדידה שהוטמעו על ידנו.',
     'The site is hosted on GitHub Pages. Directions links open Google Maps; message links open WhatsApp or your email app. These providers have their own policies. No tracking or analytics tools have been added to the main website by us.'),
    ('פנייה למשרד', 'Contact the firm',
     'לשאלות בעניין פרטים שמסרתם אפשר לפנות למשרד בדואר אלקטרוני או בטלפון המופיעים להלן.',
     'For questions about information you have provided, contact the firm using the email address or phone number below.'),
]

ACCESSIBILITY = [
    ('ההתאמות באתר', 'Accessibility features',
     'האתר כולל ניווט במקלדת, סימון מיקוד, קישור לדילוג לתוכן, תוויות לשדות, טקסט חלופי לתמונות בעלות משמעות וכותרות במבנה מדורג. השירותים והפרופילים נפתחים באמצעות רכיבים שניתנים להפעלה במקלדת. החיפוש והסינון מעדכנים את מספר התוצאות.',
     'The site includes keyboard navigation, visible focus, a skip link, field labels, meaningful image alternatives and structured headings. Service details and profiles can be opened by keyboard. Search and filters update the result count.'),
    ('תנועה והתאמה למסך', 'Motion and responsive layout',
     'האתר מכבד העדפה להפחתת תנועה במערכת ההפעלה וכולל מתג להפחתת תנועה בתחתית דף הבית. הפריסה מותאמת למסכי מחשב וטלפון. הטקסט בשתי השפות משתמש באותה משפחת גופן, ונתוני ההמחשה הפיננסית מוצגים גם בטבלה.',
     'The site respects the operating system’s reduced-motion setting and provides a reduced-motion control in the home-page footer. The layout adapts to desktop and phone screens. Both languages use one type family, and the financial illustration also has a data table.'),
    ('הבדיקות שבוצעו ומגבלותיהן', 'Checks and their limits',
     'נבדקו פריסה, תפריט טלפון, שירותים נפתחים, סינון וחיפוש, פרופילים והכנת פניות בדפדפן. האתר לא עבר מבדק התאמה מלא על ידי מורשה נגישות ולא נבדקה עם משתמשים עם מוגבלות או עם קורא מסך. אין בעמוד זה אישור לעמידה בתקן.',
     'Browser checks covered layout, mobile navigation, expandable services, search and filters, profiles and enquiry preparation. The site has not undergone a complete certified accessibility assessment or testing with disabled users or a screen reader. This page is not a certification of standards compliance.'),
    ('פנייה בנושא נגישות', 'Accessibility enquiries',
     'אם נתקלתם בקושי בשימוש באתר, אפשר לפנות לרכז הנגישות של המשרד, חן ולנשטין, בטלפון 054-5616662 או במייל chen@hwcpa.co.il. ציינו את העמוד, תיאור הקושי והדפדפן או המכשיר שבהם השתמשתם, ככל שניתן.',
     'If you encounter difficulty using the site, contact the firm’s accessibility coordinator, Chen Wallenstein, at +972-54-561-6662 or chen@hwcpa.co.il. Where possible, include the page, a description of the difficulty and your browser or device.'),
    ('נגישות הסניפים', 'Office accessibility',
     'לבירור הסדרי הנגישות במשרדים בפתח תקווה ובקריית מלאכי ניתן לפנות למשרד לפני ההגעה.',
     'For information about accessibility arrangements in Petah Tikva and Kiryat Malakhi, contact the firm before your visit.'),
]


def build(kind, language):
    he = language == 0
    t = lambda a, b: a if he else b
    title = t('מדיניות פרטיות', 'Privacy information') if kind == 'privacy' else t('מידע על נגישות האתר', 'Website accessibility information')
    content = PRIVACY if kind == 'privacy' else ACCESSIBILITY
    sections = ''.join(f'<section><h2>{t(a,b)}</h2><p>{t(c,d)}</p></section>' for a,b,c,d in content)
    filename = f'{kind}{"" if he else "-en"}.html'
    alternate = f'{kind}{"-en" if he else ""}.html'
    home = 'index.html' if he else 'en.html'
    privacy = 'privacy.html' if he else 'privacy-en.html'
    accessibility = 'accessibility.html' if he else 'accessibility-en.html'
    html = f'''<!doctype html><html lang="{t('he','en')}" dir="{t('rtl','ltr')}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} | {t('חגי ולנשטין ושות׳','Haggai Wallenstein & Co.')}</title><link rel="stylesheet" href="studio.css?v=7"><link rel="icon" href="../assets/cropped-favicon-1-32x32.png"></head><body>
<a class="skip" href="#main">{t('דילוג לתוכן','Skip to content')}</a><header class="info-header"><a class="info-brand" href="{home}"><img src="../assets/logo-full.png" alt="{t('חגי ולנשטין ושות׳ רואי חשבון','Haggai Wallenstein & Co. CPAs')}" width="1125" height="825"></a><a class="info-language" href="{alternate}" lang="{t('en','he')}">{t('English','עברית')}</a><a href="{home}#contact">{t('יצירת קשר','Contact')}</a></header>
<main id="main" tabindex="-1" class="info-page"><h1>{title}</h1>{sections}<p><a href="mailto:office@hwcpa.co.il">office@hwcpa.co.il</a><br><a href="tel:+972732741700" dir="ltr">073-274-1700</a></p><p class="updated">{t('עודכן:','Updated:')} 17.11.2026</p></main>
<footer class="info-footer"><a href="{home}">{t('חזרה לאתר המשרד','Back to the firm website')}</a><a href="{privacy}">{t('פרטיות','Privacy')}</a><a href="{accessibility}">{t('נגישות','Accessibility')}</a></footer></body></html>'''
    (OUT / filename).write_text(html)


def build_all():
    for kind in ('privacy', 'accessibility'):
        for language in (0, 1):
            build(kind, language)
    print('Built four bilingual information pages matching the actual implementation.')


if __name__ == '__main__':
    build_all()
