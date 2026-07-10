const API_URL = '/api/user-action';

// إضافة مستمع للأزرار
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', async function() {
        const tool = this.dataset.tool;
        const toolName = this.closest('.tool-card').querySelector('h3').textContent;
        
        // تغيير مظهر الزر أثناء التحميل
        const originalText = this.textContent;
        this.textContent = '⏳ جاري الإرسال...';
        this.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tool: tool,
                    toolName: toolName,
                    action: 'selected'
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.textContent = '✅ تم الإرسال!';
                this.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
                addActivity(`🟢 ${toolName} - تم الإرسال بنجاح إلى Discord`);
            } else {
                this.textContent = '❌ فشل الإرسال';
                this.style.background = 'linear-gradient(135deg, #d50000, #ff1744)';
                addActivity(`🔴 ${toolName} - فشل الإرسال إلى Discord`);
            }
        } catch (error) {
            console.error('خطأ:', error);
            this.textContent = '❌ خطأ في الاتصال';
            addActivity(`🔴 ${toolName} - خطأ في الاتصال بالخادم`);
        }

        // إعادة الزر لوضعه الطبيعي بعد 3 ثواني
        setTimeout(() => {
            this.textContent = 'اختيار هذه الأداة';
            this.disabled = false;
            this.style.background = 'linear-gradient(135deg, #00d4ff, #7b2ffc)';
        }, 3000);
    });
});

// دالة لإضافة نشاط للسجل
function addActivity(message) {
    const log = document.getElementById('activity-log');
    const time = new Date().toLocaleTimeString('ar-SA');
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.textContent = `[${time}] ${message}`;
    log.appendChild(item);
    
    // إبقاء السجل محدوداً
    while (log.children.length > 20) {
        log.removeChild(log.firstChild);
    }
    
    // التمرير إلى الأسفل
    log.scrollTop = log.scrollHeight;
}

// اختبار الاتصال عند تحميل الصفحة
async function testConnection() {
    try {
        const response = await fetch('/api/webhook-test');
        const data = await response.json();
        addActivity(`✅ الخادم يعمل: ${data.message}`);
    } catch (error) {
        addActivity(`🔴 الخادم لا يستجيب: ${error.message}`);
    }
}

// تشغيل الاختبار بعد 1 ثانية
setTimeout(testConnection, 1000);