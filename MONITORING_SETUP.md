# 📊 Monitoring & Observability Setup

**Date:** January 10, 2026  
**Purpose:** Complete monitoring setup for production deployment

---

## 🎯 Monitoring Strategy

### **1. Application Performance Monitoring (APM)**

#### **Sentry Integration** ✅
**Status:** Already configured

**Setup:**
```javascript
// Already in codebase
import { initSentry } from '../utils/sentry';
initSentry();
```

**Features:**
- Error tracking
- Performance monitoring
- Release tracking
- User context

**Configuration:**
- Set `VITE_SENTRY_DSN` in Manus secrets
- Errors automatically tracked
- Performance metrics collected

---

### **2. Health Monitoring**

#### **Health Check Endpoints** ✅
**Status:** Implemented

**Endpoints:**
- `GET /health` - Basic health
- `GET /health/detailed` - Detailed with dependencies
- `GET /health/ready` - Readiness (Kubernetes)
- `GET /health/live` - Liveness (Kubernetes)

**Usage:**
```bash
# Basic check
curl https://api.sofluent.ai/health

# Detailed check
curl https://api.sofluent.ai/health/detailed
```

**Manus Integration:**
- Configure health checks in Manus dashboard
- Set up alerts for failures
- Monitor response times

---

### **3. Logging**

#### **Structured Logging**
**Current:** Console.log (development)

**Production Setup:**
```javascript
// Use structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// In production, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

**Manus Integration:**
- Logs automatically collected
- View in Manus dashboard
- Set up log-based alerts

---

### **4. Metrics & Analytics**

#### **Performance Metrics**
**Track:**
- API response times
- Database query times
- File upload times
- Error rates
- Request counts

**Implementation:**
```javascript
// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log metric
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration
    });
  });
  
  next();
});
```

---

### **5. Uptime Monitoring**

#### **External Monitoring** (Recommended)
**Services:**
- UptimeRobot (free tier)
- Pingdom
- StatusCake
- Manus built-in monitoring

**Setup:**
1. Create account
2. Add monitor for:
   - `https://sofluent.ai` (Frontend)
   - `https://api.sofluent.ai/health` (Backend)
3. Set alert thresholds:
   - Response time > 2s
   - Uptime < 99.9%
   - Status code != 200

---

### **6. Error Alerting**

#### **Sentry Alerts** ✅
**Status:** Configured

**Alert Rules:**
- Error rate spike (> 10 errors/min)
- New error types
- Performance degradation
- Release issues

**Setup in Sentry:**
1. Go to Settings → Alerts
2. Create alert rules
3. Configure notifications (email, Slack, etc.)

---

### **7. Database Monitoring**

#### **Query Performance**
**Track:**
- Slow queries (> 100ms)
- Query frequency
- Connection pool usage
- Index usage

**Implementation:**
```javascript
// Add query logging
dbAdapter.on('query', (query) => {
  if (query.duration > 100) {
    logger.warn('slow-query', {
      query: query.text,
      duration: query.duration
    });
  }
});
```

---

### **8. Storage Monitoring**

#### **S3 Metrics**
**Track:**
- Upload success rate
- Upload duration
- Storage usage
- Bandwidth usage

**AWS CloudWatch:**
- Automatic metrics
- Set up alerts
- Monitor costs

---

## 📊 Monitoring Dashboard

### **Key Metrics to Track:**

1. **Availability**
   - Uptime: > 99.9%
   - Health check success rate: > 99%

2. **Performance**
   - API response time: < 500ms (p95)
   - Page load time: < 2s
   - Database query time: < 100ms

3. **Errors**
   - Error rate: < 0.1%
   - 5xx errors: < 0.01%

4. **Business Metrics**
   - Active users
   - API requests/day
   - Payment success rate
   - Course enrollments

---

## 🚨 Alert Configuration

### **Critical Alerts** (Immediate Action)
- Server down (503 on `/health`)
- Database connection failed
- Payment processing failed
- High error rate (> 1%)

### **Warning Alerts** (Monitor)
- Slow response times (> 1s)
- High memory usage (> 80%)
- Storage quota (> 80%)
- Unusual traffic patterns

---

## 🔧 Manus Monitoring Setup

### **Step 1: Enable Monitoring**
1. Go to Manus Dashboard → Project → Monitoring
2. Enable application monitoring
3. Configure alert channels

### **Step 2: Set Up Alerts**
1. Create alert for health check failures
2. Create alert for high error rate
3. Create alert for slow performance
4. Configure notification channels

### **Step 3: Configure Dashboards**
1. Create custom dashboard
2. Add key metrics
3. Set refresh interval
4. Share with team

---

## 📈 Performance Benchmarks

### **Target Metrics:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time (p95) | < 500ms | > 1s |
| Page Load Time | < 2s | > 3s |
| Database Query Time | < 100ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| Uptime | > 99.9% | < 99% |

---

## ✅ Monitoring Checklist

### **Pre-Deployment:**
- [ ] Sentry DSN configured
- [ ] Health endpoints tested
- [ ] Logging configured
- [ ] Error tracking enabled

### **Post-Deployment:**
- [ ] Uptime monitoring active
- [ ] Alerts configured
- [ ] Dashboards created
- [ ] Team notified of alerts

---

**Last Updated:** January 10, 2026  
**Status:** ✅ Ready for Setup
