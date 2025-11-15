# Database Setup for Profile Features

## Required Schema Updates

To support the profile onboarding and course selection features, ensure your Supabase `profiles` table includes the following columns:

### Profiles Table Columns

```sql
-- Core columns (should already exist)
id uuid primary key default auth.uid()
username text unique not null
full_name text
program text
year text
bio text
avatar_url text
current_subject text
study_hours numeric default 0
has_onboarded boolean default false
created_at timestamptz default now()

-- NEW: Add this column for course selection
courses text[]  -- Array of course codes selected by user
```

### Migration SQL

If the `courses` column doesn't exist yet, run this in your Supabase SQL editor:

```sql
-- Add courses column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS courses text[];

-- Optional: Add an index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_courses 
ON profiles USING GIN (courses);
```

### Alternative: Using JSONB

If you prefer JSONB over text[], you can use:

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS courses jsonb default '[]'::jsonb;
```

## Tables Required for Stats

The profile page queries these tables to display user statistics:

1. **matches** table:
   - Used to count: "Number of matches"
   - Query: `matches where user1_id = user.id OR user2_id = user.id`

2. **session_participants** table:
   - Used to count: "Number of sessions joined"
   - Query: `session_participants where user_id = user.id`

3. **profiles.study_hours**:
   - Displayed as: "Study hours"
   - Currently uses the `study_hours` numeric field
   - Future enhancement: Calculate from study_sessions durations

## Testing the Setup

After running the migration:

1. Sign up a new user
2. Complete the profile setup flow (bio, subjects, courses)
3. Check your `profiles` table in Supabase - you should see:
   - `has_onboarded = true`
   - `bio` populated
   - `current_subject` populated
   - `courses` array with selected courses

## Storage Setup (Required for Profile Pictures)

To enable profile picture uploads, create a storage bucket in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `avatars`
5. Set it to **Public** (so profile pictures are publicly accessible)
6. Click **Create bucket**

### Storage Policy (Optional - for better security)

You can add RLS policies to the storage bucket:

```sql
-- Allow users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public to view all avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## Notes

- The CSV file with ~10,000 courses is loaded from `/public/courses2.csv`
- All courses are now loaded (no limit) for comprehensive selection
- Search is client-side with filtering up to 100 results at a time
- Profile pictures are uploaded to Supabase Storage `avatars` bucket
- If storage upload fails, the app will show an alert (make sure bucket exists)

