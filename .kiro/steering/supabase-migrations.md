# Supabase Migration Rules

## Database Migration Execution

When working with Supabase migrations in this project, always apply migrations directly to the PostgreSQL database using Docker.

### Migration Command Pattern

Use this command pattern to apply migration files:

```fish
cat supabase/migrations/[migration-file].sql | docker exec -i 5a3dbc167122f06683dacec2bafb3000054d67635acf193c97aaac2fbbce716b psql -U postgres -d postgres
```

### Automatic Migration Application

- **Always apply migrations immediately** when creating or modifying migration files
- **Never use** `supabase db push` or other Supabase CLI commands
- **Use the docker exec -i pattern** to pipe SQL content directly to the PostgreSQL container
- **Apply all pending migrations** in chronological order by filename

### Container Details

- **Container ID**: `5a3dbc167122f06683dacec2bafb3000054d67635acf193c97aaac2fbbce716b`
- **Database**: `postgres`
- **User**: `postgres`

### Example Usage

When a new migration file is created:
1. Immediately run: `cat supabase/migrations/new_migration.sql | docker exec -i 5a3dbc167122f06683dacec2bafb3000054d67635acf193c97aaac2fbbce716b psql -U postgres -d postgres`
2. Verify the migration was applied successfully
3. Continue with development

This ensures the database schema is always up-to-date with the latest migrations without requiring separate manual steps.