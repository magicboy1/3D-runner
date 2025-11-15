# 🔧 حل مشكلة Build على Vercel

## ❌ المشكلة:
```
Could not resolve entry module "index.html"
Error: Command "npm run build" exited with 1
```

## 🎯 السبب:
Vercel بيستخدم الـ `build` script من `package.json` تلقائياً، واللي بيحاول يبني السيرفر كمان:
```json
"build": "vite build && esbuild server/index.ts ..."
```

## ✅ الحل النهائي:

### الطريقة 1: تعديل Build Command في Vercel (الأسهل والأسرع)

1. روح على Vercel Dashboard
2. اختار المشروع
3. اذهب إلى **Settings** → **General**
4. في قسم **Build & Development Settings**:

```
Framework Preset: Other
Build Command: npx vite build
Output Directory: dist/public
Install Command: npm install
Node.js Version: 18.x
```

5. اضغط **Save**
6. اذهب إلى **Deployments** وأعد النشر

### الطريقة 2: Override من خلال Environment Variable

في Project Settings → Environment Variables، أضف:
```
VERCEL_BUILD_COMMAND = npx vite build
```

### الطريقة 3: استخدام vercel.json (موجود بالفعل)

الملف `vercel.json` موجود وجاهز، لكن Vercel أحياناً بيتجاهله.

لإجباره على استخدامه:
1. احذف الـ Deployment الحالي
2. أعد النشر من جديد
3. Vercel هيقرأ `vercel.json` صح

---

## 🧪 اختبار محلي:

قبل الرفع، جرب:
```bash
npx vite build
```

لو اشتغل بدون مشاكل = جاهز للرفع! ✅

---

## 📝 الأمر الصحيح للـ Build:

**استخدم دائماً**:
```bash
npx vite build
```

**وليس**:
```bash
npm run build  ❌
```

---

## 🎮 بعد الحل:

- Build هيشتغل في ~15-20 ثانية
- الحجم النهائي: ~41 MB
- اللعبة هتشتغل فوراً على الرابط اللي هيديهولك Vercel

---

## 💡 نصيحة:

لو عايز تبني المشروع كامل (مع السيرفر) محلياً، استخدم:
```bash
npm run build  # للتطوير المحلي فقط
```

لكن على Vercel، دايماً:
```bash
npx vite build  # للـ static site
```

---

✅ **المشروع جاهز تماماً للنشر!**
