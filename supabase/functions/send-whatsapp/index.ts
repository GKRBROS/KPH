import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

async function buildPdf(enquiry: any, imageDataList: { data: Uint8Array; mime: string }[]) {
    const pdfDoc = await PDFDocument.create();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 50;
    const labelX = margin;
    const valueX = 180;
    const maxValueWidth = pageWidth - valueX - margin;
    const fontSize = 11;
    const titleFontSize = 18;
    const lineHeight = 18;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Title
    page.drawText("ORDER FORM / ENQUIRY DETAILS", {
        x: labelX, y, size: titleFontSize, font: fontBold, color: rgb(0, 0, 0),
    });
    y -= 8;

    // Separator line
    page.drawLine({
        start: { x: labelX, y },
        end: { x: pageWidth - margin, y },
        thickness: 1,
        color: rgb(0.4, 0.4, 0.4),
    });
    y -= lineHeight * 1.5;

    const fields = [
        ["Name", enquiry.name],
        ["Phone", enquiry.phone || enquiry.mobile],
        ["District", enquiry.district || enquiry.place || "N/A"],
        ["Service", enquiry.interested_in || enquiry.service || "N/A"],
        ["Area", enquiry.sqft || enquiry.sq_feet_area ? `${enquiry.sqft || enquiry.sq_feet_area} sq.ft` : "N/A"],
        ["Requirements", enquiry.project_details || enquiry.requirements || "N/A"],
        ["Date", new Date(enquiry.created_at).toLocaleDateString()],
    ];

    for (const [label, value] of fields) {
        if (y < margin + 20) break;

        page.drawText(`${label}:`, {
            x: labelX, y, size: fontSize, font: fontBold, color: rgb(0, 0, 0),
        });

        const wrappedLines = wrapText(String(value), fontRegular, fontSize, maxValueWidth);
        for (const line of wrappedLines) {
            if (y < margin + 20) break;
            page.drawText(line, {
                x: valueX, y, size: fontSize, font: fontRegular, color: rgb(0, 0, 0),
            });
            y -= lineHeight;
        }
    }

    if (enquiry.image_urls && enquiry.image_urls.length > 0) {
        y -= lineHeight * 0.5;
        if (y > margin + 20) {
            page.drawText(`Images: ${enquiry.image_urls.length} attached`, {
                x: labelX, y, size: fontSize, font: fontBold, color: rgb(0.3, 0.3, 0.3),
            });
        }
    }

    // Embed images on separate pages
    for (const imgData of imageDataList) {
        try {
            let image;
            if (imgData.mime.includes("png")) {
                image = await pdfDoc.embedPng(imgData.data);
            } else {
                image = await pdfDoc.embedJpg(imgData.data);
            }

            const imgPage = pdfDoc.addPage([pageWidth, pageHeight]);
            const scale = Math.min(
                (pageWidth - margin * 2) / image.width,
                (pageHeight - margin * 2) / image.height
            );
            const scaledW = image.width * scale;
            const scaledH = image.height * scale;

            imgPage.drawImage(image, {
                x: (pageWidth - scaledW) / 2,
                y: (pageHeight - scaledH) / 2,
                width: scaledW,
                height: scaledH,
            });
        } catch (e) {
            console.error("Failed to embed image:", e);
        }
    }

    return await pdfDoc.save();
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { enquiry_id, name: rawName, phone: rawPhone, service: rawService } = await req.json();

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        let enquiry: any;

        if (enquiry_id) {
            const { data, error: eErr } = await supabase
                .from("enquiries")
                .select("*")
                .eq("id", enquiry_id)
                .single();

            if (eErr || !data) {
                throw new Error("Enquiry not found");
            }
            enquiry = data;
        } else {
            // Fallback to raw data if enquiry_id not provided
            enquiry = {
                name: rawName,
                phone: rawPhone,
                interested_in: rawService,
                created_at: new Date().toISOString()
            };
        }

        console.log("=== Processing Enquiry ===");
        console.log("Enquiry ID:", enquiry_id);
        console.log("Customer:", enquiry.name);

        // 1. Generate PDF
        const imageDataList: { data: Uint8Array; mime: string }[] = [];
        if (enquiry.image_urls && enquiry.image_urls.length > 0) {
            for (const url of enquiry.image_urls) {
                try {
                    const resp = await fetch(url);
                    if (resp.ok) {
                        const buf = new Uint8Array(await resp.arrayBuffer());
                        const mime = resp.headers.get("content-type") || "image/jpeg";
                        imageDataList.push({ data: buf, mime });
                    }
                } catch {
                    console.error("Failed to fetch image:", url);
                }
            }
        }

        const pdfBytes = await buildPdf(enquiry, imageDataList);

        // 2. Upload PDF to Storage
        const sanitizedName = enquiry.name.replace(/[^a-z0-9]/gi, '').toLowerCase();
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
        const year = date.getFullYear();
        const fileName = `${sanitizedName}_enquiry_${day}${month}${year}.pdf`;
        const pdfPath = enquiry_id ? `${enquiry_id}/${fileName}` : `manual/${Date.now()}_${fileName}`;

        const { error: uploadErr } = await supabase.storage
            .from("enquiry-pdfs")
            .upload(pdfPath, pdfBytes, { contentType: "application/pdf", upsert: true });

        if (uploadErr) {
            throw new Error(`PDF upload failed: ${uploadErr.message}`);
        }

        const { data: urlData } = supabase.storage
            .from("enquiry-pdfs")
            .getPublicUrl(pdfPath);

        const pdfUrl = urlData.publicUrl;

        // 3. Update Enquiry Record
        if (enquiry_id) {
            await supabase
                .from("enquiries")
                .update({ pdf_url: pdfUrl })
                .eq("id", enquiry_id);
        }

        // 4. Send WhatsApp via Watti
        const WATTI_API_KEY = Deno.env.get('WATTI_BEARER_TOKEN') || Deno.env.get('WATTI_API_KEY');
        const WATTI_ENDPOINT = Deno.env.get('WATTI_API_ENDPOINT')?.replace(/\/$/, "");
        const ADMIN_1 = Deno.env.get('META_ADMIN_1_WHATSAPP') || Deno.env.get('ADMIN_1_WHATSAPP');
        const ADMIN_2 = Deno.env.get('META_ADMIN_2_WHATSAPP') || Deno.env.get('ADMIN_2_WHATSAPP');
        const TEMPLATE_NAME = Deno.env.get('META_TEMPLATE_NAME') || Deno.env.get('WATTI_TEMPLATE_NAME') || 'enquiry_notification_test';

        if (!WATTI_API_KEY || !WATTI_ENDPOINT) {
            console.log("Watti not configured, skipping WhatsApp");
            return new Response(JSON.stringify({ success: true, pdf_url: pdfUrl, message: "PDF generated, but Watti not configured" }), { headers: corsHeaders });
        }

        const adminNumbers = [ADMIN_1, ADMIN_2].filter(n => !!n);

        if (adminNumbers.length === 0) {
            console.log("No admin numbers configured, skipping WhatsApp");
            return new Response(JSON.stringify({ success: true, pdf_url: pdfUrl, message: "PDF generated, but no admin numbers" }), { headers: corsHeaders });
        }

        const parameters = [
            { name: "1", value: enquiry.name || "N/A" },
            { name: "2", value: enquiry.phone || enquiry.mobile || "N/A" },
            { name: "3", value: pdfUrl },
        ];

        const results = await Promise.allSettled(
            adminNumbers.map(async (phone) => {
                let formattedPhone = phone!.trim().replace(/^\+/, "");
                const url = `${WATTI_ENDPOINT}/api/v1/sendTemplateMessage?whatsappNumber=${encodeURIComponent(formattedPhone)}`;

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: WATTI_API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        template_name: TEMPLATE_NAME,
                        broadcast_name: "enquiry_" + (enquiry_id?.slice(0, 8) || Date.now()),
                        parameters,
                    }),
                });
                const resBody = await res.text();
                console.log(`Watti response for ${formattedPhone}: ${res.status} - ${resBody}`);
                return { phone: formattedPhone, status: res.status, body: resBody };
            })
        );

        return new Response(
            JSON.stringify({ success: true, pdf_url: pdfUrl, whatsapp_results: results }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err: any) {
        console.error("Error:", err);
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500, headers: corsHeaders,
        });
    }
});
