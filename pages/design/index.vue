<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo-section">
        <div class="logo">
          <i class="fas fa-calculator"></i>
        </div>
        <h1 class="system-title">增达报价系统</h1>
        <p class="system-subtitle">专业的报价管理与分析平台</p>
      </div>
      
      <div class="welcome-message">
        <h2>欢迎使用增达报价系统</h2>
        <p>我们为您提供全面的报价管理解决方案，帮助您高效处理客户报价需求。</p>
      </div>
      
      <div class="features">
        <div class="feature-item">
          <i class="fas fa-chart-line"></i>
          <span>智能报价分析</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-file-invoice"></i>
          <span>报价单生成</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-history"></i>
          <span>历史记录追踪</span>
        </div>
      </div>
      
      <div class="navigation-guide">
        <div class="guide-icon">
          <i class="fas fa-arrow-left"></i>
        </div>
        <div class="guide-text">
          <h3>开始使用</h3>
          <p>请点击左侧导航栏选择您需要的功能模块</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.welcome-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 800px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.logo-section {
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.logo i {
  font-size: 36px;
  color: white;
}

.system-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.system-subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin-bottom: 0;
}

.welcome-message {
  margin-bottom: 40px;
}

.welcome-message h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 15px;
}

.welcome-message p {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-item i {
  font-size: 1.5rem;
  color: #667eea;
}

.feature-item span {
  font-weight: 500;
  color: #2d3748;
}

.navigation-guide {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  border-radius: 15px;
  border: 2px dashed #cbd5e0;
  animation: pulse 2s infinite;
}

.guide-icon {
  width: 60px;
  height: 60px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}

.guide-icon i {
  font-size: 24px;
  color: white;
}

.guide-text h3 {
  font-size: 1.3rem;
  color: #2d3748;
  margin-bottom: 5px;
}

.guide-text p {
  color: #4a5568;
  margin: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .welcome-content {
    padding: 40px 20px;
  }
  
  .system-title {
    font-size: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .navigation-guide {
    flex-direction: column;
    text-align: center;
  }
}
</style>

