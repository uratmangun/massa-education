# Supabase Function Deployment Rules

## Local Function Deployment Process

When working with Supabase Edge Functions in this project, always deploy functions directly to the running Edge Functions container.

### Deployment Command Pattern

Use this command pattern to deploy function changes:

```fish
# Copy function to Edge Functions container
docker cp supabase/functions/[function-name] 8e4471404ffe:/functions/

# Restart the Edge Functions container to pick up changes
docker restart 8e4471404ffe
```

### Container Details

- **Project ID**: `blog-zora-coin` (always use this for local Supabase operations)
- **Edge Functions Container ID**: `8e4471404ffe80e74511908b546ac8ef02e766a16bc84763ec22e314eb9245d2`
- **Functions Path**: `/functions/`
- **Access URL**: `http://127.0.0.1:54321/functions/v1/[function-name]`

### Project Configuration

- **Always use project ID**: `blog-zora-coin` for all local Supabase operations
- **Config file**: `supabase/config.toml` should have `project_id = "blog-zora-coin"`
- **Container naming**: All containers use the suffix `_blog-zora-coin`

### Automatic Deployment Workflow

- **Always deploy immediately** when creating or modifying Edge Functions
- **Never use** `supabase functions deploy` for local development
- **Use the docker cp + restart pattern** to deploy functions to the local container
- **Verify deployment** by checking container logs or testing the endpoint

### Authorization Requirements

All function calls require the Supabase anon key:
- **Header**: `Authorization: Bearer [VITE_SUPABASE_ANON_KEY]`
- **Key Location**: `.env.local` file
- **Current Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`

### Example Usage

When a new function is created or modified:
1. **Copy**: `docker cp supabase/functions/my-function 8e4471404ffe:/functions/`
2. **Restart**: `docker restart 8e4471404ffe`
3. **Test**: `curl -X POST http://127.0.0.1:54321/functions/v1/my-function -H "Authorization: Bearer [anon-key]" -H "Content-Type: application/json" -d '{"test": "data"}'`
4. **Verify**: Check function response and container logs

### Benefits

- **Immediate Deployment**: Functions are available instantly after restart
- **No CLI Dependencies**: Works without Supabase CLI deployment commands
- **Local Integration**: Functions integrate properly with local Supabase stack
- **Consistent Environment**: Matches production Edge Functions behavior

This ensures Edge Functions are properly deployed and accessible through the local Supabase API gateway without requiring remote deployment or additional CLI setup.