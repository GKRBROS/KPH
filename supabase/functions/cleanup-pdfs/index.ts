import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing Supabase environment variables.")
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        const bucketName = 'enquiry-pdfs'

        const { data: files, error: listError } = await supabase.storage.from(bucketName).list()
        if (listError) throw listError

        if (!files || files.length === 0) {
            return new Response(JSON.stringify({ message: "No files to check." }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const now = new Date()
        const oneDayInMs = 24 * 60 * 60 * 1000
        const filesToDelete: string[] = []

        files.forEach(file => {
            const createdAt = new Date(file.created_at)
            if (now.getTime() - createdAt.getTime() > oneDayInMs) {
                filesToDelete.push(file.name)
            }
        })

        if (filesToDelete.length > 0) {
            const { error: deleteError } = await supabase.storage.from(bucketName).remove(filesToDelete)
            if (deleteError) throw deleteError
        }

        return new Response(JSON.stringify({
            message: `Checked ${files.length} files. Deleted ${filesToDelete.length} files.`,
            deleted: filesToDelete
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
