# Profile Features - Quick Start Guide

## 🎉 What's New

Your StudyBuddy app now has complete profile management with onboarding!

### New Features:
- ✨ **Profile Onboarding**: New users complete their profile before accessing the app
- 📚 **Course Selection**: Choose from 10,000+ courses during setup
- 📊 **Real Stats**: Profile shows actual matches, sessions, and study hours
- 👤 **Profile Page**: Display real user data with fallback avatars

---

## 🚀 Quick Start

### 1. Database Setup (Required)

Run this SQL in your Supabase SQL Editor:

```sql
-- Add courses column to store user's selected courses
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS courses text[];

-- Optional: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_courses 
ON profiles USING GIN (courses);
```

### 2. Test the Flow

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Sign up a new user:**
   - You'll see the normal signup page
   - After signup, you'll be redirected to the ProfileSetupPage

3. **Complete onboarding:**
   - Write a bio about yourself
   - (Optional) Add what you're currently studying
   - Search and select your courses
   - Click "Complete Setup"

4. **Explore the app:**
   - Navigate to the Profile page
   - See your real stats (matches, sessions, hours)
   - View your selected courses

---

## 📁 New Files Created

```
src/
├── hooks/
│   └── useProfile.ts              # Hook to fetch/manage profile data
├── pages/
│   └── ProfileSetupPage.tsx       # Onboarding form
└── types/
    └── index.ts                   # TypeScript type definitions

public/
└── courses2.csv                   # Course database (moved from src/assets)

Root:
├── DATABASE_SETUP.md              # Database migration guide
├── IMPLEMENTATION_SUMMARY.md      # Detailed implementation notes
└── PROFILE_FEATURES_README.md     # This file
```

## 🔄 Modified Files

```
src/
├── App.tsx                        # Added profile check and onboarding flow
└── components/
    └── ProfilePage.tsx            # Now shows real data from Supabase
```

---

## 🎨 UI/UX Flow

### Authentication States:

```
┌─────────────────┐
│   App Loads     │
└────────┬────────┘
         │
    Loading...
         │
         ├─ No User ──────────────> AuthPage (Login/Signup)
         │                                    │
         │                                    └──> After signup
         │                                              │
         ├─ User + !onboarded ───────> ProfileSetupPage
         │                                    │
         │                                    └──> After complete
         │                                              │
         └─ User + onboarded ────────> Main App ◄──────┘
                                       (Discover, Sessions, etc.)
```

### Onboarding Form Fields:

1. **Bio** (required)
   - Multi-line textarea
   - Tell others about yourself

2. **Current Subject** (optional)
   - Single-line input
   - What you're studying right now
   - Can be comma-separated topics

3. **Courses** (required, multi-select)
   - Search from 10,000+ courses
   - Click to select/deselect
   - Must select at least one
   - Selected courses shown as chips

---

## 🔧 How It Works

### useProfile Hook

```typescript
import { useProfile } from './hooks/useProfile';

function MyComponent() {
  const { profile, loading, setProfile } = useProfile();
  
  // profile.username, profile.bio, profile.courses, etc.
  // loading = true while fetching
  // setProfile() to update locally
}
```

### Profile Stats

The ProfilePage automatically fetches and displays:

- **Matches**: Queries `matches` table for user connections
- **Sessions**: Queries `session_participants` for joined sessions  
- **Study Hours**: Shows `profiles.study_hours` value

All queries run on mount and use Supabase RLS for security.

---

## 🛠️ Customization

### Add More Onboarding Fields

Edit `src/pages/ProfileSetupPage.tsx`:

```typescript
// Add state
const [year, setYear] = useState('');

// Add form field
<select value={year} onChange={(e) => setYear(e.target.value)}>
  <option>Freshman</option>
  <option>Sophomore</option>
  ...
</select>

// Include in update
await supabase.from('profiles').update({
  bio: bio.trim(),
  year: year,  // ← Add here
  ...
})
```

### Customize Course Loading

Edit the CSV loading in `ProfileSetupPage.tsx`:

```typescript
// Load more/fewer courses
.slice(0, 1000) // instead of 500

// Filter specific departments
.filter(course => course.startsWith('CS '))
```

### Style Adjustments

All styling uses existing CSS classes. Key colors:

- Primary gradient: `#757bc8` → `#9fa0ff`
- Secondary: `#e0c3fc`
- Accent: `#8e94f2`, `#bbadff`, `#dab6fc`

---

## 🐛 Troubleshooting

### "No profile found"
- Make sure profile was created during signup
- Check AuthContext creates profile row on signUp

### "Courses not loading"
- Verify `public/courses2.csv` exists
- Check browser console for fetch errors
- Fallback courses will load if CSV fails

### "Stats showing 0"
- Normal for new users with no matches/sessions
- Add test data to `matches` or `session_participants` tables

### "Still seeing onboarding page"
- Check `profiles.has_onboarded` in Supabase
- Should be `true` after completing setup
- Clear browser cache if stuck

---

## 📚 Additional Resources

- **DATABASE_SETUP.md**: Complete SQL migration scripts
- **IMPLEMENTATION_SUMMARY.md**: Technical implementation details
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## ✨ What's Next?

Consider adding:
- Edit profile functionality (update bio, courses, etc.)
- Profile picture upload to Supabase Storage
- Study preferences (time slots, locations, learning style)
- Privacy settings (public/private profile)
- Profile completion percentage
- Badges and achievements

---

**Questions?** Check the implementation files or the Supabase dashboard!

Happy coding! 🚀

