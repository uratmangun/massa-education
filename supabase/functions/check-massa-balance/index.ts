import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}



serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { message } = await req.json();

    // Validate input
    if (!message) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Message field is required. Please provide a Massa address in the 'message' field."
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call Massa RPC to get balance
    const rpcResponse = await fetch('https://mainnet.massa.net/api/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'get_addresses',
        params: [[message], true],
        id: 1
      })
    });

    if (!rpcResponse.ok) {
      throw new Error(`RPC request failed: ${rpcResponse.status}`);
    }

    const rpcData = await rpcResponse.json();

    // Check if there's an error in the RPC response
    if (rpcData.error) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Invalid Massa address or RPC error: " + rpcData.error.message
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract balance from response
    const addressData = rpcData.result?.[0];
    if (!addressData) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Address not found or invalid"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const balanceNanoMas = BigInt(addressData.candidate_balance || '0');
    const balanceMas = Number(balanceNanoMas) / 1e9; // Convert nano MAS to MAS

    return new Response(
      JSON.stringify({
        status: "success",
        data: {
          address: message,
          balance: {
            raw: balanceNanoMas.toString(),
            formatted: balanceMas.toString() + " MAS"
          }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message || "An error occurred while checking balance"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
