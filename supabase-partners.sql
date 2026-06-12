-- Execute uma vez no Supabase > SQL Editor.
-- Cria os acessos no banco e identifica os cadastros vindos da Melanie.

create extension if not exists pgcrypto;

alter table public.registrations
add column if not exists referral_source text;

create index if not exists registrations_referral_source_created_at_idx
on public.registrations (referral_source, created_at desc);

create table if not exists public.access_accounts (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  role text not null check (role in ('admin', 'partner')),
  referral_source text,
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists access_accounts_referral_source_unique_idx
on public.access_accounts (referral_source)
where referral_source is not null;

alter table public.access_accounts enable row level security;
revoke all on public.access_accounts from anon, authenticated;

insert into public.access_accounts (
  display_name,
  role,
  referral_source,
  password_hash
)
select
  'VESTRIS',
  'admin',
  null,
  crypt('vestris2026', gen_salt('bf'))
where not exists (
  select 1 from public.access_accounts where role = 'admin'
);

insert into public.access_accounts (
  display_name,
  role,
  referral_source,
  password_hash
)
select
  'Dra. Melanie Leite',
  'partner',
  'melanie',
  crypt('melanie2026', gen_salt('bf'))
where not exists (
  select 1 from public.access_accounts where referral_source = 'melanie'
);

create or replace function public.get_access_dashboard(p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.access_accounts%rowtype;
  v_registrations jsonb;
  v_partners jsonb;
begin
  select *
  into v_account
  from public.access_accounts
  where active = true
    and password_hash = crypt(p_password, password_hash)
  limit 1;

  if v_account.id is null then
    return jsonb_build_object('authorized', false);
  end if;

  select coalesce(
    jsonb_agg(to_jsonb(r) order by r.created_at desc),
    '[]'::jsonb
  )
  into v_registrations
  from public.registrations r
  where v_account.role = 'admin'
     or r.referral_source = v_account.referral_source;

  if v_account.role = 'admin' then
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'display_name', a.display_name,
          'referral_source', a.referral_source,
          'active', a.active,
          'registrations_count', (
            select count(*)
            from public.registrations r
            where r.referral_source = a.referral_source
          )
        )
        order by a.display_name
      ),
      '[]'::jsonb
    )
    into v_partners
    from public.access_accounts a
    where a.role = 'partner';
  else
    v_partners := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'authorized', true,
    'account', jsonb_build_object(
      'display_name', v_account.display_name,
      'role', v_account.role,
      'referral_source', v_account.referral_source
    ),
    'registrations', v_registrations,
    'partners', v_partners
  );
end;
$$;

grant execute on function public.get_access_dashboard(text) to anon, authenticated;

create or replace function public.admin_save_partner(
  p_admin_password text,
  p_display_name text,
  p_referral_source text,
  p_partner_password text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_source text;
begin
  select id into v_admin_id
  from public.access_accounts
  where role = 'admin'
    and active = true
    and password_hash = crypt(p_admin_password, password_hash)
  limit 1;

  if v_admin_id is null
     or length(trim(p_display_name)) < 2
     or length(p_partner_password) < 6 then
    return false;
  end if;

  v_source := lower(trim(p_referral_source));
  if v_source !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    return false;
  end if;

  insert into public.access_accounts (
    display_name,
    role,
    referral_source,
    password_hash,
    active
  ) values (
    trim(p_display_name),
    'partner',
    v_source,
    crypt(p_partner_password, gen_salt('bf')),
    true
  )
  on conflict (referral_source) where referral_source is not null
  do update set
    display_name = excluded.display_name,
    password_hash = excluded.password_hash,
    active = true;

  return true;
end;
$$;

create or replace function public.admin_toggle_partner(
  p_admin_password text,
  p_referral_source text,
  p_active boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
begin
  select id into v_admin_id
  from public.access_accounts
  where role = 'admin'
    and active = true
    and password_hash = crypt(p_admin_password, password_hash)
  limit 1;

  if v_admin_id is null then
    return false;
  end if;

  update public.access_accounts
  set active = p_active
  where role = 'partner'
    and referral_source = lower(trim(p_referral_source));

  return found;
end;
$$;

create or replace function public.register_early_access(
  p_name text,
  p_whatsapp text,
  p_email text,
  p_professional_type text,
  p_clinic_name text default null,
  p_city text default null,
  p_interest text default null,
  p_referral_source text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_source text;
begin
  v_source := nullif(lower(trim(p_referral_source)), '');

  if length(trim(p_name)) < 2
     or length(trim(p_whatsapp)) < 8
     or position('@' in trim(p_email)) < 2
     or length(trim(p_professional_type)) < 2 then
    return false;
  end if;

  if v_source is not null and not exists (
    select 1
    from public.access_accounts
    where role = 'partner'
      and active = true
      and referral_source = v_source
  ) then
    return false;
  end if;

  insert into public.registrations (
    name,
    whatsapp,
    email,
    professional_type,
    clinic_name,
    city,
    interest,
    referral_source
  ) values (
    trim(p_name),
    trim(p_whatsapp),
    lower(trim(p_email)),
    trim(p_professional_type),
    nullif(trim(p_clinic_name), ''),
    nullif(trim(p_city), ''),
    nullif(trim(p_interest), ''),
    v_source
  );

  return true;
end;
$$;

grant execute on function public.admin_save_partner(text, text, text, text) to anon, authenticated;
grant execute on function public.admin_toggle_partner(text, text, boolean) to anon, authenticated;
grant execute on function public.register_early_access(text, text, text, text, text, text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';

select display_name, role, referral_source, active
from public.access_accounts
order by role, display_name;

-- Para trocar uma senha futuramente:
-- update public.access_accounts
-- set password_hash = crypt('nova-senha', gen_salt('bf'))
-- where referral_source = 'melanie';
