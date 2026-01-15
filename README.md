# 📝 **Blog CMS - Content Management System**

A modern, full-stack CMS blog platform with drag & drop page builder functionality. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## 🚀 **Live Demo**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## ✨ **Features**

### 🎨 **Drag & Drop Page Builder**
- Visual page creation like WordPress
- Add text, images, videos, and layout components
- Real-time preview
- Responsive design

### 📝 **Blog Management**
- Rich text editor (React Quill)
- Categories and tags
- Featured images
- Draft/publish system

### 👤 **User System**
- JWT authentication
- User roles (admin, author, editor)
- Profile management
- Secure password hashing

### 🗄️ **Database**
- MongoDB with Mongoose ODM
- Collections: Users, Pages, Posts
- Full CRUD operations

## 🛠️ **Tech Stack**

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router
- React Quill (Rich text editor)
- React DnD (Drag & drop)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (File uploads)
- Bcrypt (Password hashing)

## 📦 **Installation**

### 1. **Clone Repository**
```bash
git clone <your-repo-url>
cd blog-cms
```

### 2. **Backend Setup**
```bash
cd backend
npm install
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog_cms
JWT_SECRET=your_secret_key" > .env
mkdir uploads
npm run dev
```

### 3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### 4. **MongoDB Setup**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create `blog_cms` database
4. Create collections: `users`, `pages`, `posts`

## 🔧 **Environment Variables**

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog_cms
JWT_SECRET=your_super_secret_key
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 **Project Structure**
```
blog-cms/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite app
└── README.md
```

## 🚀 **Running the Project**

### **Development Mode:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### **Access the App:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: Available at `/api` endpoints

## 🔌 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### **Pages**
- `POST /api/pages` - Create page
- `GET /api/pages/:slug` - Get page by slug
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### **Posts**
- `POST /api/posts` - Create blog post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:slug` - Get post by slug
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## 🎯 **Key Features in Action**

1. **Register/Login** → Create account
2. **Dashboard** → Manage content
3. **Page Builder** → Drag & drop pages
4. **Post Editor** → Write blog posts
5. **Public View** → See published content

## 🐛 **Troubleshooting**

**Common Issues:**
1. **MongoDB Connection Failed** - Ensure MongoDB is running
2. **Port Already in Use** - Kill process on port 3000/5000
3. **Tailwind Not Working** - Check `tailwind.config.js` content paths

**Solutions:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"
```

## 📄 **License**
MIT License - Feel free to use and modify!

## 🤝 **Contributing**
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📞 **Support**
For issues, feature requests, or questions:
- Create GitHub issue
- Check existing documentation

---

**Happy Coding!** 🚀 Built with ❤️ for developers who want to create amazing content.