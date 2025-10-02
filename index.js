// 📌 استدعاء المكتبات
const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const express = require("express");

// 📌 إنشاء الكلاينت (حساب شخصي للتعلم فقط)
const client = new Client();

// ⚠️ التوكن والمعرفات (من القفل Environment Variables في Render)
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_ID = process.env.VOICE_ID;

// ⚙️ إعدادات الصوت (من القفل تقدر تتحكم فيها)
const SELF_MUTE = process.env.SELF_MUTE === "true"; // true أو false
const SELF_DEAF = process.env.SELF_DEAF === "true"; // true أو false

async function connectToVoice() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    // 📌 دخول الروم الصوتي
    joinVoiceChannel({
      channelId: VOICE_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: SELF_DEAF,
      selfMute: SELF_MUTE
    });

    console.log("🎧 الحساب دخل الروم الصوتي!");
  } catch (err) {
    console.error("❌ خطأ:", err);
  }
}

client.on("ready", async () => {
  console.log(`${client.user.username} ✅ الحساب شغال`);
  await connectToVoice();

  // 📌 فحص إذا طلع من الروم، يرجع بعد 50 ثانية
  setInterval(() => {
    const connection = getVoiceConnection(GUILD_ID);
    if (!connection) {
      console.log("⚠️ الحساب مو في الروم.. يحاول يرجع بعد 50 ثانية");
      connectToVoice();
    }
  }, 50 * 1000); // 50 ثانية
});

// 📌 تسجيل الدخول
client.login(TOKEN);

// 📌 ويب سيرفر صغير عشان Render ما يوقف البوت
const app = express();
app.get("/", (req, res) => res.send("✅ Bot is running 24/7 on Render"));
app.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Web server is running");
});
