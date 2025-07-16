// @ts-ignore - Deno import works in Supabase Edge Runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
                'Access-Control-Max-Age': '86400',
            }
        })
    }

    try {
        // Only accept POST requests
        if (req.method !== 'POST') {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Method not allowed. Use POST request."
                }),
                {
                    status: 405,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            )
        }

        // Parse request body
        const body = await req.json()

        // Validate required field
        if (!body.message) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Missing required field: message"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            )
        }

        // Process the course title
        const courseTitle = body.message

        // Simple validation - check if course title is not empty
        if (!courseTitle.trim()) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Course title cannot be empty"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            )
        }

        // Success response
        return new Response(
            JSON.stringify({
                status: "success",
                message: `Course "${courseTitle}" processed successfully`
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        )

    } catch (error) {
        console.error('Error processing request:', error)

        return new Response(
            JSON.stringify({
                status: "error",
                message: "Internal server error"
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }
        )
    }
})