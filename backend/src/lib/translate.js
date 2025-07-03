import translate from 'google-translate-api-x';

export async function translateText(text, targetLang = 'en') {
  try {
    const res = await translate(text, { to: targetLang });
    console.log("✅ Google Translate result:", res.text);
    return res.text;
  } catch (error) {
    console.error("❌ Translation error:", error.message);
    return null;
  }
}
