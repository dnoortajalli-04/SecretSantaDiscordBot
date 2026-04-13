# 🎄 Secret Santa Discord Bot

A simple and fun Discord bot for organizing Secret Santa events within your server. This bot allows users to join, create gift preference profiles, and automatically assigns Secret Santa matches with private DM notifications.

---

## ✨ Features

- 🎁 Join a Secret Santa event
- 📝 Create and update personal gift profiles
- 👀 View profiles (with admin controls)
- 🔒 Admin-controlled participant management
- 🎅 Automatic Secret Santa assignment (no self-matching)
- 📩 Private DM delivery of assignments and gift details
- 💾 Persistent storage using a local JSON file

---

## 📦 Setup

### 1. Clone the Repository
```bash
git clone https://github.com/dnoortajalli-04/SecretSantaDiscordBot.git
cd secret-santa-bot
```

### 2. Install Dependencies
```bash
yarn
```

### 3. Configure the Bot

Open `index.js` and fill in the following:

```js
const TOKEN = "YOUR_BOT_TOKEN";
const CLIENT_ID = "YOUR_CLIENT_ID";
const GUILD_ID = "YOUR_SERVER_ID";
```

### 4. Run the Bot
```bash
node index.js
```

---

## 📁 Data Storage

The bot uses a local file:

```
data.json
```

This file stores:
- Participants
- Profile data
- Whether the draw has already occurred

---

## 🧾 User Profile Fields

Each participant can fill out the following:

- Address  
- Favorite Pokémon  
- Favorite Colors  
- Favorite Foods  
- Favorite Drinks  
- Favorite Scents  
- Favorite Candies  
- Clothing Size  
- Hated Items  
- Allergies  
- Extra Info  

---

## 💬 Commands

All commands are **slash commands** (`/`).

---

### 🎁 `/join`

Join the Secret Santa event.

**Usage:**
```
/join
```

**Description:**
- Registers you as a participant
- Initializes your profile with default values

---

### 📝 `/myprofile`

Update your personal Secret Santa profile.

**Usage:**
```
/myprofile field:<field> value:<value>
```

**Example:**
```
/myprofile field:Favorite Colors value:Blue, Green
```

**Notes:**
- You must run `/join` first
- Updates one field at a time

---

### 👤 `/viewprofile`

View a Secret Santa profile.

**Usage:**
```
/viewprofile
/viewprofile user:@username   (Admin only)
```

**Description:**
- Users can view their own profile
- Admins can view any participant’s profile

---

### 🛠️ `/profile` (Admin Only)

Update another user’s profile.

**Usage:**
```
/profile user:@username field:<field> value:<value>
```

**Example:**
```
/profile user:@John field:Clothing Size value:Large
```

**Permissions:**
- Requires Administrator privileges

---

### 🎅 `/draw` (Admin Only)

Run the Secret Santa draw and assign participants.

**Usage:**
```
/draw
```

**What it does:**
- Randomly assigns each participant another participant
- Ensures no one is assigned themselves
- Sends each user a **DM** with:
  - Their assigned person
  - That person’s full gift profile

**Important:**
- Can only be run once
- Requires at least 2 participants

---

## 🔐 Permissions

| Command        | Who Can Use |
|----------------|------------|
| `/join`        | Everyone   |
| `/myprofile`   | Everyone   |
| `/viewprofile` | Everyone (self), Admin (others) |
| `/profile`     | Admin only |
| `/draw`        | Admin only |

---

## ⚠️ Notes & Best Practices

- Make sure users have **DMs enabled**, or they won’t receive their assignment
- Run `/draw` only when all participants have joined and updated profiles
- Consider backing up `data.json` if running long-term events
- Bot must have permissions for:
  - Sending DMs
  - Reading messages
  - Using slash commands

---

## 🎄 Example Flow

1. Users run `/join`
2. Users fill out profiles with `/myprofile`
3. Admin reviews profiles if needed
4. Admin runs `/draw`
5. Participants receive their Secret Santa assignments via DM 🎁

---

## 🚀 Future Improvements (Optional Ideas)

- Ability to reset the draw
- Wishlist links
- Budget limits
- Exclusion rules (e.g., prevent pairing certain users)
- Web dashboard for easier management

---

## 🧑‍💻 Built With

- [discord.js](https://discord.js.org/)
- Node.js
- JSON file storage

---
