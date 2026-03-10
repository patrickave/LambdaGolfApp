# Lambda Golf — Claude Code Build Prompt

## Project Overview

Build a mobile-first web application called **Lambda Golf** that helps a private golf group coordinate weekend tee times. The group has ~30 named members. Each weekend, members signal which days they want to play (Saturday, Sunday, or both). An admin then manages which tee times the group has secured, and builds out foursomes by assigning players to tee time slots. There is a lot of manual coordination happening today via a Google Sheet — this app replaces that.

This is a **prototype**. No backend. All state lives in **localStorage**. No authentication system beyond a simple hardcoded admin password. The app should feel polished and mobile-friendly since most users will be on their phones.

---

## Tech Stack

- **React** (functional components, hooks only)
- **Tailwind CSS** for styling (mobile-first, large touch targets minimum 44px)
- **localStorage** for all persistence
- **No backend, no database, no auth library**
- Single page app, component-based architecture
- Use `date-fns` for date math if needed

---

## User Roles

There are two roles: **Player** and **Admin**. The app starts in Player mode. Admin mode is unlocked via a password input (hardcode password as `lambdagolf`). Once unlocked, store the admin session in localStorage so they don't have to re-enter it on reload.

---

## Player Experience

### Name Setup
- On first visit, show a full-screen prompt asking the player to enter their name
- Show a **predefined dropdown list** of member names (see member list below) so players pick their name rather than type it freeform — this prevents duplicates and typos
- Store the selected name in a cookie AND localStorage under key `lambdagolf_player_name`
- After name is set, show the main player dashboard
- Allow the player to change their name via a small "Not you?" link

### Player Dashboard
- Display a warm greeting: "Hey [Name], what's your weekend looking like?"
- Show the **upcoming Saturday and Sunday dates** dynamically (always the next upcoming Saturday/Sunday from today's date)
- Two large, full-width toggle cards — one for Saturday, one for Sunday
  - Each card shows the date (e.g., "Saturday, Mar 14")
  - Big tap target, clear visual ON/OFF state (green when selected, muted when not)
  - When toggled ON, also show an optional text input: "Bringing a guest? Enter their name"
  - Guest name is stored with the player's signup
- Below the toggles, show a **"Your Tee Time"** section
  - If the admin has assigned this player to a tee time, show it prominently: "You're teeing off at 8:12am Saturday"
  - If not yet assigned, show: "Tee time TBD — check back soon"
- A small footer note: "Tap to update anytime before Friday at noon"

### Member List (preloaded)
Alec Keller, Alex Genschoreck, Andy Ihle, Andy Swanson, Anthony De Luise, Brad Applegate, Brock Magoon, Drew McGowan, Gavin Myers, Greg McAleer, Holton Chason, Jack Gola, Jamie FitzGerald, Jason Aytes, Jason Godard, Jason Sobota, Jim Percherke, John Oh, Kelly Gaitten, Kyle Blackburn, Lincoln Jackson, Liz Seaborne, Luke Iglehart, Max Schoenfeld, Michael Smallcorn, Mike Lang, Pat Avedian, Ross Stegall, Ryan Houlihan, Stefano Maio, Tim Brogan, Tom DiGreggorio

---

## Admin Experience

Admin mode is a separate tabbed interface accessible from a small "Admin" link in the corner of the app. After entering the password, the admin sees a dashboard with three tabs: **Signups**, **Tee Times**, and **Pairings**.

### Tab 1: Signups
- Shows a full roster of all members
- Each member row shows: Name | Saturday (yes/no) | Sunday (yes/no) | Guest (if any) | Notes
- Count badges at top: "X playing Saturday | Y playing Sunday"
- Ability to manually override any player's signup (admin can toggle on behalf of someone)
- Visual highlight for players who haven't responded at all

### Tab 2: Tee Times
- Two columns: Saturday | Sunday
- Generate tee time slots from **7:30am to 11:00am in 9-minute intervals** — approximately 24 slots per day
- Each slot is a card showing the time (e.g., 7:30, 7:39, 7:48...)
- Admin can click a slot to toggle it between three states:
  - **Default** (grey) — not relevant
  - **Available** (green) — we have this tee time
  - **Pending** (yellow) — submitted lottery request, awaiting confirmation
- Only "Available" tee times show up in the Pairings tab
- Admin can add a note to any tee time slot (e.g., "confirmed via phone", "lottery #4482")

### Tab 3: Pairings
- Shows only the **Available** tee times for each day
- Each tee time has **4 player slots: P1, P2, P3, P4**
- Admin can assign any player who signed up for that day into any slot
- Use a **dropdown or searchable select** populated with players who marked interest for that day
- Show unassigned players at the top as a pool — make it easy to drag or tap-assign them into slots
- Each tee time card shows: Time | P1 | P2 | P3 | P4 | Status (full/open)
- A player already assigned to a slot should be visually removed from the unassigned pool
- Allow admin to remove a player from a slot (tap an X or clear button)
- At the bottom, show any players who signed up but are not yet assigned — "Unassigned: [names]"

---

## Data Model

Store everything in localStorage. Use these keys:

```
lambdagolf_player_name        — current user's name (string)
lambdagolf_signups            — object: { [playerName]: { saturday: bool, sunday: bool, satGuest: string, sunGuest: string } }
lambdagolf_tee_times          — object: { saturday: [ { time: "7:30", status: "available|pending|default", note: "" } ], sunday: [...] }
lambdagolf_pairings           — object: { saturday: { "7:30": ["Name1", "Name2", null, null], ... }, sunday: {...} }
lambdagolf_admin_session      — bool: true if admin is authenticated
lambdagolf_week               — ISO date string of the Saturday being planned (so data resets week over week)
```

---

## UX Details

- Mobile-first. Assume 390px wide iPhone. Everything should work perfectly on mobile.
- Large tap targets everywhere — minimum 48px height for interactive elements
- Use a clean, sporty color scheme — greens and whites with dark text, feels like a golf app not a generic SaaS tool
- Smooth transitions between states (toggling on/off, tab switching)
- No jarring full page reloads — everything updates reactively
- Loading states are not needed since everything is local
- Empty states should be helpful, not blank (e.g., "No tee times marked available yet — go to Tee Times tab to add them")

---

## File Structure

Organize the project cleanly:

```
/src
  /components
    PlayerDashboard.jsx
    NameSetup.jsx
    AdminLogin.jsx
    AdminDashboard.jsx
    SignupsTab.jsx
    TeeTimesTab.jsx
    PairingsTab.jsx
    TeeTimeSlot.jsx
    PlayerCard.jsx
  /hooks
    useLocalStorage.js
    useWeekDates.js
  /data
    members.js       — exported array of member names
    teeTimes.js      — utility to generate 7:30–11:00 slots in 9-min intervals
  App.jsx
  main.jsx
```

---

## Build Order Instructions

1. Scaffold the project with Vite + React + Tailwind
2. Start with the data layer — `members.js`, `teeTimes.js`, and the `useLocalStorage` hook
3. Build `NameSetup` component first so the app is usable immediately
4. Build `PlayerDashboard` next — this is the primary player-facing view
5. Build the Admin flow last: login, then the three tabs in order (Signups, Tee Times, Pairings)
6. Wire everything together in `App.jsx` with simple conditional rendering based on localStorage state
7. Add comments to every component explaining its purpose and props
8. At the end, output a `README.md` with setup instructions and a summary of the data model