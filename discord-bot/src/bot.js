import "dotenv/config";
import OpenAI from "openai";
import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

const requiredEnv = [
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
  "DISCORD_ALLOWED_USER_ID",
  "OPENAI_API_KEY",
];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_ALLOWED_USER_ID = process.env.DISCORD_ALLOWED_USER_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT || "You are a concise and helpful assistant.";
const HISTORY_TURNS = Number.parseInt(process.env.HISTORY_TURNS || "12", 10);
const MAX_HISTORY_MESSAGES = Math.max(2, HISTORY_TURNS * 2);
const DISCORD_MESSAGE_LIMIT = 1900;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const histories = new Map();

const commands = [
  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the assistant a question in DM.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("What you want to ask")
        .setRequired(true)
        .setMaxLength(4000),
    ),
  new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Clear the memory for this DM conversation."),
].map((command) => command.toJSON());

async function registerGlobalCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
    body: commands,
  });
}

function splitForDiscord(text) {
  if (!text || text.length <= DISCORD_MESSAGE_LIMIT) {
    return [text || "No response."];
  }

  const chunks = [];
  let remaining = text;
  while (remaining.length > DISCORD_MESSAGE_LIMIT) {
    let cut = remaining.lastIndexOf("\n", DISCORD_MESSAGE_LIMIT);
    if (cut < 0) {
      cut = remaining.lastIndexOf(" ", DISCORD_MESSAGE_LIMIT);
    }
    if (cut < 0) {
      cut = DISCORD_MESSAGE_LIMIT;
    }
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining.length > 0) {
    chunks.push(remaining);
  }
  return chunks;
}

function clampHistory(channelId) {
  const history = histories.get(channelId);
  if (!history) {
    return;
  }
  while (history.length > MAX_HISTORY_MESSAGES) {
    history.shift();
  }
}

const client = new Client({
  intents: [GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel],
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await registerGlobalCommands();
    console.log("Global slash commands synced.");
  } catch (error) {
    console.error("Failed to sync slash commands:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.user.id !== DISCORD_ALLOWED_USER_ID) {
    await interaction.reply({
      content: "This bot only accepts commands from the configured user.",
      ephemeral: true,
    });
    return;
  }

  if (interaction.channel?.type !== ChannelType.DM) {
    await interaction.reply({
      content: "DM only. Use this command in a direct message with the bot.",
      ephemeral: true,
    });
    return;
  }

  const channelId = interaction.channelId;

  if (interaction.commandName === "reset") {
    histories.delete(channelId);
    await interaction.reply("Memory cleared for this DM conversation.");
    return;
  }

  if (interaction.commandName !== "ask") {
    return;
  }

  const prompt = interaction.options.getString("prompt", true).trim();
  if (!prompt) {
    await interaction.reply("Prompt is empty.");
    return;
  }

  await interaction.deferReply();

  const history = histories.get(channelId) || [];
  history.push({ role: "user", content: prompt });

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim() || "No response.";
    history.push({ role: "assistant", content: answer });
    histories.set(channelId, history);
    clampHistory(channelId);

    const chunks = splitForDiscord(answer);
    await interaction.editReply(chunks[0]);
    for (const chunk of chunks.slice(1)) {
      await interaction.followUp(chunk);
    }
  } catch (error) {
    history.pop();
    histories.set(channelId, history);
    clampHistory(channelId);

    console.error("OpenAI request failed:", error);
    await interaction.editReply("Request failed. Check bot logs for details.");
  }
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

client.login(DISCORD_TOKEN);
