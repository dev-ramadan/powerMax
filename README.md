# Beit El3arosa / PowerMax — MERN Full-Stack Storefront

Arabic RTL storefront starter for a homeware / bridal-preparation shop.

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas connection string

## Local Setup

### 1) Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- API health check: http://localhost:5000/api/health

---

## Vercel Deployment (دليل الرفع على Vercel)

المشروع الآن مجهز بالكامل للرفع على Vercel بطريقتين:

### الطريقة الأولى: الرفع كمشروع موحد شامل (Fullstack Single Project - الأسهل والأفضل) 🌟
في هذه الطريقة يتم رفع الفرونت إند والباك إند معاً تحت نفس النطاق (Domain واحد) وبدون أي مشاكل في الـ CORS.

1. اربط الـ Repository بحسابك على Vercel واضغط **Import Project**.
2. اترك **Root Directory** كما هو `./` (المجلد الرئيسي للمشروع).
3. أضف متغيرات البيئة (**Environment Variables**) في لوحة تحكم Vercel:
   - `MONGODB_URI`: رابط اتصال قاعدة البيانات MongoDB Atlas.
   - `JWT_SECRET`: مفتاح التشفير (مفتاح سري عشوائي).
   - `NODE_ENV`: `production`
4. اضغط **Deploy**.
5. سيقوم Vercel تلقائياً ببناء الفرونت إند وتوجيه مسارات الـ `/api/*` إلى الـ Serverless Functions للباك إند!

---

### الطريقة الثانية: الرفع كمشروعين منفصلين (Two Separate Projects)
إذا أردت رفع الفرونت إند والباك إند في مشروعين منفصلين على Vercel:

#### 1) الباك إند (Backend Project):
1. في Vercel اضغط **Add New Project** وحدد نفس الـ Repo.
2. غيّر **Root Directory** إلى `server`.
3. أضف متغيرات البيئة:
   - `MONGODB_URI`: رابط MongoDB Atlas
   - `JWT_SECRET`: مفتاح الـ JWT
   - `CLIENT_URL`: رابط الفرونت إند على Vercel (مثال: `https://your-frontend.vercel.app`)
4. اضغط **Deploy** وانسخ الرابط النهائي (مثال: `https://your-backend.vercel.app`).

#### 2) الفرونت إند (Frontend Project):
1. اضغط **Add New Project** وحدد الـ Repo مرة ثانية.
2. غيّر **Root Directory** إلى `client`.
3. في إعدادات البناء (**Framework Preset**): اختر **Vite**.
4. أضف متغير البيئة:
   - `VITE_API_URL`: رابط الباك إند متبوعاً بـ `/api` (مثال: `https://your-backend.vercel.app/api`).
5. اضغط **Deploy**.
