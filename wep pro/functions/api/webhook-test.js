export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const webhookURL = context.env.DISCORD_WEBHOOK_URL;
        
        if (!webhookURL) {
            return new Response(JSON.stringify({
                success: false,
                message: 'DISCORD_WEBHOOK_URL غير مضبوط في المتغيرات البيئية'
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // إرسال رسالة اختبار
        const testMessage = {
            content: '🔔 **اتصال ناجح!** الموقع يعمل ويرسل إشعارات إلى ديسكورد 🎉'
        };

        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testMessage)
        });

        if (!response.ok) {
            throw new Error(`Discord API responded with ${response.status}`);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'تم إرسال رسالة اختبار إلى ديسكورد بنجاح'
        }), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: `خطأ: ${error.message}`
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}