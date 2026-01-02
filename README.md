# Nuxt Minimal Starter

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Environment Setup
Before running the project, create a `.env` file in the root directory. This file should contain your Supabase credentials and any other sensitive configuration values.

```env
VSU_USERNAME=your-cumulus-username
VSU_PASSWORD=your-cumulus-password
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## Supabase Table: app_session
To enable session management and caching of grades, create the following table in your Supabase database:

```sql
create table public.app_session (
  id integer not null,
  token text null,
  grades_cache jsonb null,
  last_fetch timestamp with time zone null,
  constraint app_session_pkey primary key (id)
) TABLESPACE pg_default;

INSERT INTO app_session (id, token, grades_cache, last_fetch) 
VALUES (1, null, '[]', null);
```

This table stores session tokens, cached grades, and the last fetch timestamp for each session.
