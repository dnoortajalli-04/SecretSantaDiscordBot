const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const TOKEN = ""; // Add token here
const CLIENT_ID = ""; // add client ID here
const GUILD_ID = ""; // add guild ID here
const DATA_FILE = "./data.json";


/* ================== FILE STORAGE ================== */

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ participants: {}, drawn: false }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ================== BOT ================== */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

client.once("ready", () => {
  console.log(`🎄 Logged in as ${client.user.tag}`);
});

/* ================== PROFILE FIELDS ================== */

const profileFields = [
  { name: "Address", value: "address" },
  { name: "Favorite Pokémon", value: "favoritePokemon" },
  { name: "Favorite Colors", value: "favoriteColors" },
  { name: "Favorite Foods", value: "favoriteFoods" },
  { name: "Favorite Drinks", value: "favoriteDrinks" },
  { name: "Favorite Scents", value: "favoriteScents" },
  { name: "Favorite Candies", value: "favoriteCandies" },
  { name: "Clothing Size", value: "clothingSize" },
  { name: "Hated Items", value: "hatedItems" },
  { name: "Allergies", value: "allergies" },
  { name: "Extra Info", value: "extraInfo" }
];

/* ================== SLASH COMMANDS ================== */

const commands = [
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join Secret Santa"),

  new SlashCommandBuilder()
    .setName("myprofile")
    .setDescription("Update your own Secret Santa profile")
    .addStringOption(opt =>
      opt.setName("field")
        .setDescription("Profile field")
        .setRequired(true)
        .addChoices(...profileFields)
    )
    .addStringOption(opt =>
      opt.setName("value")
        .setDescription("New value")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Admin: update a participant profile")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Participant")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("field")
        .setDescription("Profile field")
        .setRequired(true)
        .addChoices(...profileFields)
    )
    .addStringOption(opt =>
      opt.setName("value")
        .setDescription("New value")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("viewprofile")
    .setDescription("View a Secret Santa profile")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Profile to view (admins only)")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("draw")
    .setDescription("Draw Secret Santa and DM assignments")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log("✅ Slash commands registered");
})();

/* ================== UTIL ================== */

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function profileEmbed(user, profile) {
  return new EmbedBuilder()
    .setTitle(`🎁 Secret Santa Profile`)
    .setDescription(`Profile for **${user.username}**`)
    .setColor(0xE74C3C)
    .addFields(
      { name: "🏠 Address", value: profile.address || "Not specified", inline: true },
      { name: "⚡ Favorite Pokémon", value: profile.favoritePokemon || "Not specified", inline: true },
      { name: "🎨 Favorite Colors", value: profile.favoriteColors || "Not specified", inline: true },
      { name: "🍽️ Favorite Foods", value: profile.favoriteFoods || "Not specified", inline: true },
      { name: "☕ Favorite Drinks", value: profile.favoriteDrinks || "Not specified", inline: true },
      { name: "🌸 Favorite Scents", value: profile.favoriteScents || "Not specified", inline: true },
      { name: "🍬 Favorite Candies", value: profile.favoriteCandies || "Not specified", inline: true },
      { name: "👕 Clothing Size", value: profile.clothingSize || "Not specified", inline: true },
      { name: "🚫 Hated Items", value: profile.hatedItems || "Not specified", inline: true },
      { name: "⚠️ Allergies", value: profile.allergies || "Not specified", inline: true },
      { name: "📝 Extra Info", value: profile.extraInfo || "Not specified", inline: true },
    )
    .setFooter({ text: "Secret Santa Bot 🎄" });
}

/* ================== INTERACTIONS ================== */

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const data = loadData();

  /* ---------- JOIN ---------- */
  if (interaction.commandName === "join") {
    const id = interaction.user.id;

    if (!data.participants[id]) {
      data.participants[id] = {
        address: "Not specified",
        favoritePokemon: "Not specified",
        favoriteColors: "Not specified",
        favoriteFoods: "Not specified",
        favoriteDrinks: "Not specified",
        favoriteScents: "Not specified",
        favoriteCandies: "Not specified",
        clothingSize: "Not specified",
        hatedItems: "Not specified",
        allergies: "Not specified",
        extraInfo: "Not specified"
      };
      saveData(data);
    }

    return interaction.reply({
      content: "🎁 You’ve joined Secret Santa! Use `/myprofile` to update your info.",
      ephemeral: true
    });
  }

  /* ---------- MY PROFILE ---------- */
  if (interaction.commandName === "myprofile") {
    const id = interaction.user.id;
    const field = interaction.options.getString("field");
    const value = interaction.options.getString("value");

    if (!data.participants[id]) {
      return interaction.reply({
        content: "❌ You haven’t joined yet. Use `/join` first.",
        ephemeral: true
      });
    }

    data.participants[id][field] = value;
    saveData(data);

    return interaction.reply({
      content: `✅ Your **${field}** has been updated.`,
      ephemeral: true
    });
  }

  /* ---------- ADMIN PROFILE UPDATE ---------- */
  if (interaction.commandName === "profile") {
    const user = interaction.options.getUser("user");
    const field = interaction.options.getString("field");
    const value = interaction.options.getString("value");

    if (!data.participants[user.id]) {
      return interaction.reply({
        content: "❌ That user has not joined.",
        ephemeral: true
      });
    }

    data.participants[user.id][field] = value;
    saveData(data);

    return interaction.reply({
      content: `✅ Updated **${field}** for **${user.username}**`,
      ephemeral: true
    });
  }

  /* ---------- VIEW PROFILE ---------- */
  if (interaction.commandName === "viewprofile") {
    const targetUser =
      interaction.options.getUser("user") || interaction.user;

    const isAdmin = interaction.member.permissions.has(
      PermissionFlagsBits.Administrator
    );

    if (targetUser.id !== interaction.user.id && !isAdmin) {
      return interaction.reply({
        content: "❌ You can only view your own profile.",
        ephemeral: true
      });
    }

    if (!data.participants[targetUser.id]) {
      return interaction.reply({
        content: "❌ That user has not joined.",
        ephemeral: true
      });
    }

    const embed = profileEmbed(
      targetUser,
      data.participants[targetUser.id]
    );

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }

  /* ---------- DRAW ---------- */
  if (interaction.commandName === "draw") {
    if (data.drawn) {
      return interaction.reply("❌ Secret Santa has already been drawn.");
    }

    const ids = Object.keys(data.participants);
    if (ids.length < 2) {
      return interaction.reply("❌ Not enough participants.");
    }

    let receivers;
    do {
      receivers = [...ids];
      shuffle(receivers);
    } while (receivers.some((id, i) => id === ids[i]));

    for (let i = 0; i < ids.length; i++) {
      const giver = await client.users.fetch(ids[i]);
      const receiver = await client.users.fetch(receivers[i]);
      const p = data.participants[receivers[i]];

      await giver.send(
        `🎅 **Secret Santa Assignment** 🎄\n\n` +
        `You are gifting for **${receiver.username}**!\n\n` +
        `🎁 **Gift Profile**\n` +
        `• 🏠 Address: ${p.address}\n` +
        `• ⚡ Favorite Pokémon: ${p.favoritePokemon}\n` +
        `• 🎨 Favorite Colors: ${p.favoriteColors}\n` +
        `• 🍽️ Favorite Foods: ${p.favoriteFoods}\n` +
        `• ☕ Favorite Drinks: ${p.favoriteDrinks}\n` +
        `• 🌸 Favorite Scents: ${p.favoriteScents}\n` +
        `• 🍬 Favorite Candies: ${p.favoriteCandies}\n` +
        `• 👕 Clothing Size: ${p.clothingSize}\n` +
        `• 🚫 Hated Items: ${p.hatedItems}\n` +
        `• ⚠️ Allergies: ${p.allergies}\n` +
        `• 📝 Extra Info: ${p.extraInfo}`
      );
    }

    data.drawn = true;
    saveData(data);

    return interaction.reply("🎄 Secret Santa assignments sent via DM!");
  }
});

/* ================== LOGIN ================== */

client.login(TOKEN);