---
description: Start Supabase with custom Docker network
---

# Start Supabase with Custom Network

This workflow starts Supabase local development environment connected to the `my-net` Docker network.

## Steps

1. Stop any running Supabase instance
```fish
bunx supabase stop
```

2. Start Supabase with custom network
```fish
bunx supabase start --network-id my-net
```

3. Verify network connection (optional)
```fish
docker network inspect my-net
```

## Network Details

- **Network Name**: `my-net`
- **Network Type**: Bridge
- **Subnet**: `172.21.0.0/16`
- **Gateway**: `172.21.0.1`

## Connected Services

When running, the following Supabase services will be connected to `my-net`:

- `supabase_db_supabase-local` - PostgreSQL Database
- `supabase_auth_supabase-local` - Authentication Service
- `supabase_rest_supabase-local` - REST API
- `supabase_realtime_supabase-local` - Realtime Service
- `supabase_storage_supabase-local` - Storage Service
- `supabase_edge_runtime_supabase-local` - Edge Functions
- `supabase_kong_supabase-local` - API Gateway
- `supabase_studio_supabase-local` - Studio Interface
- `supabase_inbucket_supabase-local` - Email Testing
- `supabase_analytics_supabase-local` - Analytics
- `supabase_vector_supabase-local` - Vector/Embeddings
- `supabase_pg_meta_supabase-local` - Database Metadata

## Access URLs

- **API URL**: http://127.0.0.1:54321
- **Studio URL**: http://127.0.0.1:54323
- **Database URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Inbucket URL**: http://127.0.0.1:54324
