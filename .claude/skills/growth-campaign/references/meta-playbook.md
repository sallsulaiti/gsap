# Meta Playbook — التفاصيل التقنية للمراحل الثلاث

اقرأ هذا الملف قبل أي استدعاء إنشاء. كل الأدوات من كونكتر `facebook_ads`.
`client_conversation_id`: ولّد ٢٠ حرف عشوائي في أول استدعاء وأعد استخدامه في كل الاستدعاءات بنفس المحادثة.

## ٠. جمع المعرّفات (لا تتخطاها)

| الحاجة | الأداة | ملاحظة |
|---|---|---|
| الحساب الإعلاني | `ads_get_ad_accounts` | خذ `min_daily_budget_cents` و `currency` |
| صفحة فيسبوك | `ads_get_ad_account_pages` | مطلوبة للـ promoted_object |
| حساب انستقرام | `ads_get_ig_accounts` | خذ `ig_user_id` |
| منشورات انستقرام | `ads_get_ig_media` | اعرض للمستخدم بوصف + تاريخ ليختار |
| الجماهير الموجودة | `ads_get_ad_account_custom_audiences` | تحقق قبل إنشاء نسخة مكررة |

تحويل الميزانية: دولار × ١٠٠ = سنت. إذا عملة الحساب مو دولار (مثل KWD) استخدم أصغر وحدة للعملة نفسها ووضّح للمستخدم.

## ١. المرحلة الأولى — تفاعل (اليوم)

### الحملة
`ads_create_campaign`
- `objective`: `OUTCOME_ENGAGEMENT`
- `buying_type`: `AUCTION`
- `campaign_daily_budget`: الميزانية بالسنت (CBO — لا تحط ميزانية على المجموعة)
- `campaign_name`: `[حملة] تفاعل — <اسم الحساب> — <الشهر>`
- `special_ad_categories`: `[]`

### المجموعة الإعلانية
`ads_create_ad_set`
- `optimization_goal`: `POST_ENGAGEMENT`
- `billing_event`: `IMPRESSIONS`
- `destination_type`: `ON_POST`
- `promoted_object`: `{"page_id":"<PAGE_ID>"}`
- `start_time` / `end_time`: اليوم → +٣٠ يوم (ISO 8601)
- `targeting` (JSON string):
```json
{"geo_locations":{"countries":["KW"]},
 "age_min":18,"age_max":55,
 "publisher_platforms":["instagram"],
 "instagram_positions":["stream","reels"],
 "targeting_automation":{"advantage_audience":0}}
```
  - `stream` = Instagram Feed، `reels` = Instagram Reels.
  - `advantage_audience: 0` عشان الأعمار والدول تصير قيود حقيقية مو اقتراحات.
- لا ترسل `daily_budget` هنا لأن الحملة CBO.

### الإعلان (ترويج ريل/منشور انستقرام موجود)
`ads_boost_ig_post` — اسم الإعلان `[حملة] ترويج — <وصف المنشور>`. مرّر `ad_set_id` و معرّف الـ IG media من `ads_get_ig_media` والحساب الإعلاني.
إذا الأداة غير متاحة: `ads_create_creative` مع `object_story_id` لمنشور صفحة فيسبوك + `instagram_user_id`، ثم `ads_create_ad` بـ `{"creative_id":"..."}`.

### التفعيل
فقط بعد موافقة صريحة: `ads_activate_entity` على الحملة ثم المجموعة ثم الإعلان.

## ٢. المرحلة الثانية — الجماهير (بعد ٣٠ يوم)

### الجمهور المخصص (كل من تفاعل مع انستقرام، ٣٦٥ يوم)
`ads_create_custom_audience`
- `subtype`: `ENGAGEMENT`
- `name`: `IG Engagers 365d — <اسم الحساب>`
- `rule` (JSON-encoded string):
```json
{"inclusions":{"operator":"or","rules":[{"event_sources":[{"type":"ig_business","id":"<IG_USER_ID>"}],"retention_seconds":31536000,"filter":{"operator":"and","filters":[{"field":"event","operator":"eq","value":"ig_business_profile_all"}]}}]}}
```
احفظ `audience_id` الراجع.

### الجمهور الشبيه ١٪
`ads_create_custom_audience`
- `subtype`: `LOOKALIKE`
- `origin_audience_id`: `<audience_id السابق>`
- `lookalike_ratio`: `0.01`
- `name`: `LAL 1% — IG Engagers — <اسم الحساب>`
- لا تسأل عن دولة؛ الجغرافيا تُضبط في استهداف المرحلة الثالثة.

تحقق بعدها بـ `ads_get_custom_audience`: `delivery_status` لازم يصير ACTIVE قبل المرحلة الثالثة (قد يأخذ ساعات).

## ٣. المرحلة الثالثة — النمو

### مسار «متابعين»
`ads_create_campaign`: `objective` = `OUTCOME_TRAFFIC`، ميزانية يومية CBO، اسم `[حملة] متابعين — <الحساب>`.

`ads_create_ad_set`:
- `optimization_goal`: `VISIT_INSTAGRAM_PROFILE` (بديل: `PROFILE_VISIT`)
- `destination_type`: `INSTAGRAM_PROFILE`
- `billing_event`: `IMPRESSIONS`
- `promoted_object`: `{"page_id":"<PAGE_ID>"}`
- `targeting`:
```json
{"geo_locations":{"countries":["KW"]},
 "age_min":18,"age_max":55,
 "custom_audiences":[{"id":"<CUSTOM_AUDIENCE_ID>"},{"id":"<LOOKALIKE_ID>"}],
 "publisher_platforms":["instagram"],
 "instagram_positions":["stream","reels"],
 "targeting_automation":{"advantage_audience":0}}
```
الإعلان: نفس أسلوب المرحلة الأولى (ترويج منشور قوي — يفضّل منشور جديد).

### مسار «مبيعات»
اسأل وين يشتري:
- **رابط موقع**: `OUTCOME_TRAFFIC` + `optimization_goal: LINK_CLICKS` + `destination_type: WEBSITE`. الإعلان عبر `ads_create_creative` (page_id, link_url, message, headline, image/video, `call_to_action_type: LEARN_MORE` أو `SIGN_UP`) ثم `ads_create_ad`. إذا عنده Meta Pixel على الصفحة → `OUTCOME_SALES` + `OFFSITE_CONVERSIONS` + `promoted_object: {"pixel_id":..., "custom_event_type":"PURCHASE"}`.
- **رسالة واتساب/انستقرام**: `OUTCOME_ENGAGEMENT` + `optimization_goal: CONVERSATIONS` + `destination_type: WHATSAPP` أو `INSTAGRAM_DIRECT` + `promoted_object: {"page_id":...}`.

الاستهداف: الجمهور الشبيه + دول الخليج `["KW","SA","AE","QA","BH","OM"]`.

## جدول توافق سريع (هدف الحملة ← أهداف الأداء المسموحة)

- `OUTCOME_ENGAGEMENT` → POST_ENGAGEMENT, THRUPLAY, VIDEO_VIEWS, REACH, CONVERSATIONS, PAGE_LIKES
- `OUTCOME_TRAFFIC` → LINK_CLICKS, LANDING_PAGE_VIEWS, VISIT_INSTAGRAM_PROFILE, PROFILE_VISIT, POST_ENGAGEMENT, REACH
- `OUTCOME_SALES` → OFFSITE_CONVERSIONS (يحتاج pixel), VALUE, LINK_CLICKS

## قراءة الأداء

- `ads_get_ad_entities` مع `date_preset` لجدول سريع.
- `ads_insights_performance_trend` للاتجاه العام (اترك واجهة الأداة تظهر ولا تكرر أرقامها).
- Windsor.ai (اختياري، مجاني لحساب واحد): `get_connectors` → `get_fields` → `get_data` connector `facebook`، حقول: campaign, date, spend, impressions, reach, clicks, cpc, cpm, actions. مفيد للمقارنة بين فترات أو تصدير جدول.
