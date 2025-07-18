const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

// Buildnet endpoint
const BUILDNET_ENDPOINT = 'https://buildnet.massa.net/api/v2';

interface RequestBody {
  message: string; // Contract address
  dataKey?: string;
}

// Helper function to convert bytes array to string
function bytesToStr(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Helper function to convert string to bytes array for key comparison
function strToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
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
    const { message, dataKey }: RequestBody = await req.json();

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
    const GREETING_KEY = "name_key";

    console.log(`Reading smart contract data from buildnet:`, {
      contractAddress: sc_addr,
      dataKey: GREETING_KEY
    });

    // Call Massa RPC to get contract address data including datastore
    const rpcResponse = await fetch(BUILDNET_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'get_addresses',
        params: [[sc_addr], true],
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
          error: "Invalid contract address or RPC error: " + rpcData.error.message
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract address data from response
    const addressData = rpcData.result?.[0];
    if (!addressData) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "Contract address not found or invalid"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get datastore from either candidate or final ledger info
    const datastoreSource = addressData.candidate_sce_ledger_info || addressData.final_sce_ledger_info;
    if (!datastoreSource || !datastoreSource.datastore) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "No smart contract datastore found at this address"
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Convert key to bytes for lookup
    const keyBytes = strToBytes(GREETING_KEY);
    const keyBytesStr = keyBytes.join(',');

    // Find the datastore entry
    let dataStoreVal = null;
    let foundKey = null;
    
    // Look through all datastore keys to find a match
    for (const [key, value] of Object.entries(datastoreSource.datastore)) {
      // Try to match the key as string representation of bytes array
      if (key === keyBytesStr) {
        dataStoreVal = value as number[];
        foundKey = key;
        break;
      }
      
      // Also try direct string match in case keys are stored differently
      const keyAsBytes = key.split(',').map(n => parseInt(n, 10));
      if (keyAsBytes.length > 0 && !isNaN(keyAsBytes[0])) {
        const keyAsString = bytesToStr(keyAsBytes);
        if (keyAsString === GREETING_KEY) {
          dataStoreVal = value as number[];
          foundKey = key;
          break;
        }
      }
    }
    
    if (!dataStoreVal) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: `Datastore key '${GREETING_KEY}' doesn't exist in contract '${sc_addr}'`,
          availableKeys: Object.keys(datastoreSource.datastore)
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Decode the value
    const decodedValue = bytesToStr(dataStoreVal);

    console.log('Successfully decoded value:', decodedValue);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Smart contract data retrieved successfully",
        data: {
          contractAddress: sc_addr,
          dataKey: GREETING_KEY,
          foundKey: foundKey,
          rawValue: dataStoreVal,
          decodedValue: decodedValue,
          network: "buildnet"
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
