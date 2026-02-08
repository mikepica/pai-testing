# Discord DM Bot (OpenAI)

This bot is private by default:
- DM-only commands
- hard user allowlist (`DISCORD_ALLOWED_USER_ID`)
- no secrets in code (env vars only)

## 1) Create Discord app + bot

1. Go to Discord Developer Portal.
2. Create an application.
3. In `Bot`, create/reset token and copy it.
4. In `OAuth2 > URL Generator`:
- Scopes: `bot`, `applications.commands`
- Bot permissions: send messages in DMs (default bot permissions are fine for this flow)
5. Open the generated invite URL and add the bot to your account.

## 2) Get your IDs

- `DISCORD_CLIENT_ID`: Application ID (General Information page).
- `DISCORD_ALLOWED_USER_ID`: Your Discord user ID.
  - In Discord: Settings > Advanced > enable Developer Mode.
  - Right-click your profile/user and copy ID.

## 3) Configure env

```bash
cd /Users/mikepica/Personal_Projects/az-demo/discord-bot
cp .env.example .env
```

Fill in `.env` with your values:
- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `DISCORD_ALLOWED_USER_ID`
- `OPENAI_API_KEY`

Optional:
- `OPENAI_MODEL` (default: `gpt-4.1-mini`)
- `SYSTEM_PROMPT`
- `HISTORY_TURNS` (default: `12`)

## 4) Install + run

```bash
npm install
npm run start
```

On first run, the bot syncs global slash commands (`/ask`, `/reset`).
Global command propagation can take a little time in Discord.

## 5) Use

1. Open a DM with your bot.
2. Run `/ask prompt: ...`
3. Run `/reset` to clear memory for that DM channel.

## Security notes

- The bot ignores all users except `DISCORD_ALLOWED_USER_ID`.
- The bot rejects commands outside DM channels.
- Keep `.env` private and rotate tokens if exposed.
