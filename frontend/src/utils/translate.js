export async function translateText(text, targetLang = 'it') {
  if (!text) return text;

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    return data.responseData.translatedText || text;
  } catch (err) {
    console.error('Errore traduzione:', err);
    return text;
  }
}
