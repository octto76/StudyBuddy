# Study Match App

A simple to use application for college students to find study partners with. Connect with a large network of other students to find one who matches your study style and interests!

## Feature List

- Core Concept

  - Tinder-style interface for matching with study partners
  - Swipe LEFT to pass, RIGHT to show interest
  - Match occurs when both users swipe RIGHT on each other

- User Profiles

  - Basic info (name, school/program, year)
  - Currently studying for (...)
  - Courses currently taking / interested in
  - Study preferences (silent vs. collaborative, morning/night, etc.)
  - Option to show/hide certain details from public view

- Matching & Discovery

  - Swipe deck of nearby/compatible students
  - Matching algorithm based on:
    - Shared courses
    - Similar availability
    - Preferred study locations
  - Ability to skip, like, or super-like (optional stretch)

- Post-Match Actions

  - Start 1:1 chat with matched user
  - Propose a study session:
    - Pick a study spot (e.g., campus library, café, study room)
    - Choose a time and date
    - Select which course you want to study together
  - Confirm study session details between both users

- Study Sessions

  - Create a “Study Session” event after both users agree
  - Option to:
    - Lock the session to only 2 people
    - Make the session public so others can discover and request to join
  - Session details:
    - Title (e.g., “MATH 240 Midterm Prep”)
    - Location
    - Time & duration
    - Max number of participants (if not locked to 2)

- Group Join / Public Sessions

  - Public sessions visible in a “Discover Sessions” tab
  - Other students can:
    - View session details
    - Request to join
  - Host can accept/decline join requests
  - Session chat for all participants

- Chat & Communication

  - Private DMs between matched users
  - Session-based group chats for each study event
  - Open question:
    - In-app chat vs. integration with external platform (e.g., Discord)
    - Option 1: Native in-app messaging for DMs and group chats
    - Option 2: Auto-create/join Discord servers/channels for classes or sessions

- Class / Course Spaces (Optional Stretch)

  - “Class servers” or channels for each course
  - Students enrolled in the same course can:
    - Post quick questions
    - Advertise upcoming study sessions
    - Find last-minute partners

- Session Management

  - List of upcoming sessions the user is attending or hosting
  - Past sessions history (optional stretch)
  - Ability to edit or cancel a session
  - Push notifications / reminders (e.g., 1 hour before session)

- Scope & Presentation Focus
  - Small, well-defined feature set for hackathon:
    - Swipe-based matching
    - Match chat
    - Simple session creation (time, place, course)
    - Possibly add map for location
    - Option to lock or open session to others
  - Emphasis on:
    - Clean UI (Tinder-style swipe + simple session cards)
    - Smooth flow from matching → chatting → scheduling
    - Strong demo narrative: “From match to study session in under a minute”

### Current Project Structure

```
src/
├─ components/
│ ├─ Navbar.tsx
│ ├─ SwipeCard.tsx
│ └─ Button.tsx
├─ pages/
│ ├─ AuthPage.tsx
│ ├─ SwipePage.tsx
│ └─ SessionsPage.tsx
├─ hooks/
│ └─ useAuth.ts
├─ lib/
│ └─ supabaseClient.ts # or firebaseClient.ts later
├─ types/
│ └─ index.ts # User, Session, Match types
├─ App.tsx
└─ main.tsx
```
