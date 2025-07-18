import { bytesToStr, JsonRPCClient } from "npm:@massalabs/massa-web3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface RequestBody {
  message: string; // Contract address
  dataKey?: string;
  network?: string; // mainnet or buildnet
}

Deno.serve(async (req) => {
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
          error: "Method not allowed. Please use POST request."
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { message, dataKey, network }: RequestBody = await req.json();

    // Validate input
    if (!message) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "Message field is required. Please provide a contract address in the 'message' field."
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use message as contract address and set default key
    const sc_addr = message;
    const GREETING_KEY = dataKey || "name_key";
    const selectedNetwork = network || "buildnet";

    // Validate network
    if (selectedNetwork !== 'mainnet' && selectedNetwork !== 'buildnet') {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "Invalid network. Please use 'mainnet' or 'buildnet'."
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Reading smart contract data from ${selectedNetwork}:`, {
      contractAddress: sc_addr,
      dataKey: GREETING_KEY
    });

    // Create JsonRPCClient based on network
    const client = selectedNetwork === 'mainnet' 
      ? JsonRPCClient.mainnet() 
      : JsonRPCClient.buildnet();

    // Get datastore entry using massa-web3 library
    const dataStoreVal = await client.getDatastoreEntry(GREETING_KEY, sc_addr, false);
    
    if (!dataStoreVal) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: `Datastore key '${GREETING_KEY}' doesn't exist in contract '${sc_addr}'`
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Decode the value using massa-web3 utility
    const decodedValue = bytesToStr(dataStoreVal);

    console.log('Successfully decoded value:', decodedValue);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Smart contract data retrieved successfully",
        data: {
          contractAddress: sc_addr,
          dataKey: GREETING_KEY,
          rawValue: Array.from(dataStoreVal), // Convert Uint8Array to regular array for JSON
          decodedValue: decodedValue,
          network: selectedNetwork
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error reading smart contract:', error);
    
    return new Response(
      JSON.stringify({
        status: "error",
        error: error.message || 'Failed to read smart contract data'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
