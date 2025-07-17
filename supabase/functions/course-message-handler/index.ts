import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Method not allowed. Please use POST request."
        }),
        { 
          status: 405, 
          headers: corsHeaders 
        }
      );
    }

    // Parse request body
    const { message, courseId } = await req.json();

    // Validate input
    if (!message) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Message field is required. Please provide a message."
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    if (!courseId) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Course ID is required. Please provide a courseId."
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch course goals and authorization header
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('goals, authorization_header')
      .eq('id', courseId)
      .single()

    if (courseError) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Failed to fetch course information: " + courseError.message
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    if (!course) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Course not found"
        }),
        { 
          status: 404, 
          headers: corsHeaders 
        }
      );
    }

    if (!course.goals) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Course has no goals endpoint configured"
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    // Prepare headers for the external request
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add authorization header if provided
    if (course.authorization_header) {
      requestHeaders['Authorization'] = `Bearer ${course.authorization_header}`
    }

    // Make POST request to the goals URL
    const goalsResponse = await fetch(course.goals, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ message })
    });

    if (!goalsResponse.ok) {
      let errorMessage = `Goals endpoint returned ${goalsResponse.status}: ${goalsResponse.statusText}`;
      
      try {
        // Try to get the actual error response from the server
        const errorResponse = await goalsResponse.json();
        if (errorResponse && (errorResponse.message || errorResponse.error)) {
          errorMessage = errorResponse.message || errorResponse.error || errorMessage;
        }
      } catch (parseError) {
        // If we can't parse the response, try to get it as text
        try {
          const errorText = await goalsResponse.text();
          if (errorText && errorText.trim()) {
            errorMessage = errorText;
          }
        } catch (textError) {
          // If all else fails, keep the original status message
          console.error('Failed to parse error response:', textError);
        }
      }
      
      return new Response(
        JSON.stringify({
          status: "error",
          message: errorMessage
        }),
        { 
          status: 502, 
          headers: corsHeaders 
        }
      );
    }

    // Parse response from goals endpoint
    const goalsData = await goalsResponse.json();

    // Return the response from the goals endpoint
    return new Response(
      JSON.stringify({
        status: "success",
        data: goalsData
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message || "An error occurred while processing the message"
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
})
