export async function onRequest(context) {
    const { request } = context;
    
    // التعامل مع طلبات CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const data = await request.json();
        const { tool, toolName, action } = data;

        // الحصول على رابط الويب هوك من متغيرات البيئة
        const webhookURL = context.env.DISCORD_WEBHOOK_URL;
        
        if (!webhookURL) {
            console.error('❌ DISCORD_WEBHOOK_URL غير مضبوط');
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Webhook URL not configured' 
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // بناء رسالة ديسكورد
        const discordMessage = {
            embeds: [{
                title: '🎮 نشاط جديد من الموقع',
                description: `مستخدم اختار أداة: **${toolName}**`,
                color: 0x00d4ff,
                fields: [
                    {
                        name: '🛠️ الأداة',
                        value: tool,
                        inline: true
                    },
                    {
                        name: '🕐 الوقت',
                        value: new Date().toLocaleString('ar-SA'),
                        inline: true
                    },
                    {
                        name: '📍 الإجراء',
                        value: action || 'اختيار أداة',
                        inline: true
                    }
                ],
                footer: {
                    text: 'محسن ويندوز للاعبين',
                    icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
                },
                timestamp: new Date().toISOString()
            }]
        };

        // إرسال إلى ديسكورد
        const discordResponse = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });

        if (!discordResponse.ok) {
            throw new Error(`Discord API returned ${discordResponse.status}`);
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: 'تم إرسال الإشعار إلى ديسكورد' 
        }), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('❌ خطأ:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}