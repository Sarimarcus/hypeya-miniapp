# 🚀 HYPEYA Miniapp - Deployment Guide

## Prerequisites

- GitHub repository: `Sarimarcus/hypeya-miniapp`
- Vercel account connected to GitHub
- WordPress admin access for API credentials

## 🔧 Vercel Deployment Steps

### 1. **Connect Repository**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import `Sarimarcus/hypeya-miniapp` from GitHub
4. Select "hypeya-miniapp" repository

### 2. **Configure Build Settings**
```bash
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 20.x
```

**Note**: Current configuration optimized for Vercel Free Plan:
- Single region deployment (automatic region selection)
- 10s function timeout (increased to 30s on Pro plan)
- Serverless functions supported

### 3. **Environment Variables**
Add these in Vercel Project Settings > Environment Variables:

**Required:**
- `WP_API_USERNAME`: Your WordPress username
- `WP_API_KEY`: WordPress Application Password

**Optional:**
- `NEXT_PUBLIC_API_DEBUG`: `false` (for production)
- `NEXT_PUBLIC_OFFLINE_MODE`: `false`

### 4. **Custom Domain (Optional)**
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable SSL (automatic)

## 🔑 WordPress API Setup

### Get API Credentials:
1. Login to WordPress admin: `https://hypeya.xyz/wp-admin`
2. Go to: **Users** > **Profile**
3. Scroll to: **Application Passwords**
4. Create new password: "HYPEYA Miniapp Production"
5. Copy the username and generated password
6. Add to Vercel environment variables

## 📊 Performance Optimization

### Vercel Configuration (vercel.json)
✅ Security headers configured  
✅ Caching optimization  
✅ Image optimization  
✅ Service Worker support  

### PWA Features
✅ Progressive Web App enabled  
✅ Offline functionality  
✅ App icons and manifest  
✅ Service Worker caching  

## 🔍 Post-Deployment Checklist

### Essential Tests:
- [ ] Homepage loads correctly
- [ ] Articles display with images
- [ ] Search functionality works
- [ ] Filters operate properly
- [ ] Mobile responsiveness
- [ ] PWA installation prompt
- [ ] Offline functionality
- [ ] Fast loading (< 3s)

### SEO Verification:
- [ ] Meta tags present
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Manifest.json accessible
- [ ] Robots.txt exists
- [ ] Sitemap accessible

### Performance Check:
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals green
- [ ] Image optimization working
- [ ] Caching headers set
- [ ] Service Worker active

## 🚨 Troubleshooting

### Common Issues:

**Build Fails:**
- Check environment variables are set
- Verify WordPress API connectivity
- Review build logs in Vercel dashboard

**Images Not Loading:**
- Verify image paths in `/public/images/`
- Check WordPress media permissions
- Ensure CORS headers allow domain

**API Errors:**
- Test WordPress API directly: `https://hypeya.xyz/wp-json/wp/v2/posts`
- Verify API credentials
- Check network connectivity

**Performance Issues:**
- Review bundle analyzer output
- Optimize images and assets
- Check caching configuration

## 📱 Mobile Testing

Test on multiple devices:
- iOS Safari
- Android Chrome
- Desktop browsers
- PWA installation
- Offline functionality

## 🔄 Deployment Updates

### Automatic Deployment:
- Push to `main` branch triggers deployment
- Preview deployments for PRs
- Instant rollback available

### Manual Deployment:
```bash
# Local testing
npm run build:production
npm run test:build

# Deploy via Vercel CLI
vercel --prod
```

## 🔐 Security

✅ Security headers configured  
✅ HTTPS enforced  
✅ API credentials secured  
✅ No sensitive data in client  
✅ Content Security Policy  

## 📈 Monitoring

After deployment, monitor:
- Vercel Analytics
- Core Web Vitals
- Error tracking
- User engagement
- API performance

---

## 🎯 Production URLs

- **Production**: `https://hypeya-miniapp-eum1029vz-sarimarcus-projects.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/sarimarcus-projects/hypeya-miniapp`
- **WordPress API**: `https://hypeya.xyz/wp-json/wp/v2/`

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **WordPress API**: https://developer.wordpress.org/rest-api/

Ready for deployment! 🚀
