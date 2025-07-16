# Supabase Project Configuration Rules

## Local Project ID Requirement

When working with Supabase locally in this project, always use the project ID `blog-zora-coin`.

### Project Configuration Standards

- **Project ID**: Always use `blog-zora-coin` for all local Supabase operations
- **Config File**: `supabase/config.toml` must have `project_id = "blog-zora-coin"`
- **Container Naming**: All Supabase containers use the suffix `_blog-zora-coin`

### Configuration Rules

1. **Never change the project ID** from `blog-zora-coin`
2. **Always verify config consistency** when working with Supabase settings
3. **Use project ID in all Supabase CLI commands** when project reference is needed
4. **Maintain container compatibility** with existing `blog-zora-coin` setup

### Container Environment

All local Supabase containers follow this naming pattern:
- `supabase_db_blog-zora-coin`
- `supabase_kong_blog-zora-coin` 
- `supabase_auth_blog-zora-coin`
- `supabase_edge_runtime_blog-zora-coin`
- `supabase_studio_blog-zora-coin`
- And other Supabase services with `_blog-zora-coin` suffix

### Benefits

- **Consistency**: Ensures all Supabase operations work with existing container setup
- **No Conflicts**: Prevents creation of duplicate or conflicting Supabase instances
- **Seamless Integration**: Maintains compatibility with current development environment
- **Predictable Naming**: Makes container management and debugging easier

This rule ensures all Supabase local development stays consistent with the established `blog-zora-coin` project configuration.