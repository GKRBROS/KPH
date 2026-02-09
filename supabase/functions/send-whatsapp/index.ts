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

        const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
        const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
        const TWILIO_WHATSAPP_NUMBER_FROM = Deno.env.get('TWILIO_WHATSAPP_NUMBER_FROM')
        const ADMIN_1_WHATSAPP = Deno.env.get('TWILIO_ADMIN_1_WHATSAPP')
        const ADMIN_2_WHATSAPP = Deno.env.get('TWILIO_ADMIN_2_WHATSAPP')
        const CUSTOMER_TEMPLATE_SID = Deno.env.get('WHATSAPP_CUSTOMER_TEMPLATE_SID')
        const ADMIN_TEMPLATE_SID = Deno.env.get('WHATSAPP_ADMIN_TEMPLATE_SID')

        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER_FROM) {
            throw new Error("Twilio configuration missing in secrets.")
        }

        // Professional Plain Text Message (No Emojis)
        const adminMessage = `NEW PAINT ENQUIRY RECEIVED

Customer: ${name}
Phone: ${phone}
Service: ${service}

The complete enquiry summary with photos is attached as a PDF file.`

        const customerMessage = `Dear ${name},

Thank you for your enquiry with Kalangara Paint House. 

We have received your request for ${service}. Please find your enquiry summary attached as a PDF document. Our team will review the details and contact you shortly.`

        const sendWhatsApp = async (to: string, message: string, label: string, templateSid?: string, variables?: string[]) => {
            let formattedTo = to.trim()
            // Only add + prefix, don't auto-add country code if customer didn't provide it
            if (!formattedTo.startsWith('+')) {
                formattedTo = `+${formattedTo}`
            }

            const bodyParams = new URLSearchParams({
                'From': `whatsapp:${TWILIO_WHATSAPP_NUMBER_FROM.replace(/^\+?/, '+')}`,
                'To': `whatsapp:${formattedTo}`,
            })

            // Use template if SID is provided, otherwise use text message
            if (templateSid && variables) {
                bodyParams.append('ContentSid', templateSid)
                bodyParams.append('ContentVariables', JSON.stringify(variables))
                console.log(`Sending template to ${label}: ${templateSid} with variables:`, variables)
            } else {
                bodyParams.append('Body', message)
            }

            if (pdfUrl) {
                // Ensure Twilio sees the .pdf extension clearly
                const mediaUrl = pdfUrl.includes('?') ? `${pdfUrl}&f=.pdf` : `${pdfUrl}?f=.pdf`;
                bodyParams.append('MediaUrl', mediaUrl)
            }

            console.log(`Sending to ${label}: ${formattedTo}`)

            const res = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: bodyParams,
                }
            )

            const json = await res.json()
            console.log(`Response from Twilio for ${label}:`, json)

            if (!res.ok) {
                console.error(`Twilio error for ${label}:`, json)
                throw new Error(json.message || `Twilio failed for ${label}`)
            }
            return json
        }

        const results = []

        // Send to admins with template
        if (ADMIN_1_WHATSAPP) {
            console.log("Attempting to send to Admin 1...")
            if (ADMIN_TEMPLATE_SID) {
                results.push(await sendWhatsApp(ADMIN_1_WHATSAPP, adminMessage, "Admin 1", ADMIN_TEMPLATE_SID, [name, phone, service]))
            } else {
                results.push(await sendWhatsApp(ADMIN_1_WHATSAPP, adminMessage, "Admin 1"))
            }
        }
        if (ADMIN_2_WHATSAPP) {
            console.log("Attempting to send to Admin 2...")
            if (ADMIN_TEMPLATE_SID) {
                results.push(await sendWhatsApp(ADMIN_2_WHATSAPP, adminMessage, "Admin 2", ADMIN_TEMPLATE_SID, [name, phone, service]))
            } else {
                results.push(await sendWhatsApp(ADMIN_2_WHATSAPP, adminMessage, "Admin 2"))
            }
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
