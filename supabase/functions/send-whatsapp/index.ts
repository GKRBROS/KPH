import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, phone, service, pdfUrl } = await req.json()

        console.log("=== WhatsApp Function Called ===")
        console.log("Customer Name:", name)
        console.log("Customer Phone:", phone)
        console.log("Service:", service)
        console.log("PDF URL:", pdfUrl)

        const WATTI_BEARER_TOKEN = Deno.env.get('WATTI_BEARER_TOKEN')
        const WATTI_SENDER_NUMBER = Deno.env.get('WATTI_SENDER_NUMBER')
        const WATTI_API_ENDPOINT = Deno.env.get('WATTI_API_ENDPOINT') || 'https://api.watti.io/api/v1/sendTemplateMessages'
        const ADMIN_1_WHATSAPP = Deno.env.get('WATTI_ADMIN_1_WHATSAPP')
        const ADMIN_2_WHATSAPP = Deno.env.get('WATTI_ADMIN_2_WHATSAPP')
        const TEMPLATE_NAME = 'admin_new_enquiry'

        if (!WATTI_BEARER_TOKEN || !WATTI_SENDER_NUMBER) {
            throw new Error("Watti configuration missing in secrets.")
        }

        const sendWattiMessage = async (to: string, label: string) => {
            let formattedTo = to.trim()
            // Ensure phone number has + prefix
            if (!formattedTo.startsWith('+')) {
                formattedTo = `+${formattedTo}`
            }

            console.log(`Sending to ${label}: ${formattedTo}`)

            // Watti API payload structure
            const payload = {
                template_name: TEMPLATE_NAME,
                broadcast_name: `Enquiry_${Date.now()}`,
                receivers: [
                    {
                        whatsapp: formattedTo,
                        customParams: [
                            { name: "name", value: name },
                            { name: "phone", value: phone },
                            { name: "Source", value: service }
                        ]
                    }
                ]
            }

            // Add media if PDF URL is provided
            if (pdfUrl) {
                payload.receivers[0].customParams.push({
                    name: "media",
                    value: pdfUrl
                })
            }

            console.log(`Watti payload for ${label}:`, JSON.stringify(payload, null, 2))

            const res = await fetch(WATTI_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WATTI_BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const json = await res.json()
            console.log(`Response from Watti for ${label}:`, json)

            if (!res.ok) {
                console.error(`Watti error for ${label}:`, json)
                throw new Error(json.message || `Watti API failed for ${label}`)
            }
            return json
        }

        const results = []

        // Send to admins
        if (ADMIN_1_WHATSAPP) {
            console.log("Attempting to send to Admin 1...")
            results.push(await sendWattiMessage(ADMIN_1_WHATSAPP, "Admin 1"))
        }
        if (ADMIN_2_WHATSAPP) {
            console.log("Attempting to send to Admin 2...")
            results.push(await sendWattiMessage(ADMIN_2_WHATSAPP, "Admin 2"))
        }

        // Customer messaging intentionally disabled

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
