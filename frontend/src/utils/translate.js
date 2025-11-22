export async function translateText(text) {
  try {
    if (!text) return text;

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|it`
    );

    const data = await response.json();

    const result = data?.responseData?.translatedText || text;

    // ⚠️ Se MyMemory ha finito i crediti → NON TRADURRE
    if (
      result.includes('MYMEMORY WARNING') ||
      result.includes('QUERY LENGTH LIMIT EXCEEDED')
    ) {
      console.warn('⚠️ Traduzione saltata per mancanza crediti.');
      return text;
    }

    return result;
  } catch (error) {
    console.error('Errore traduzione:', error);
    return text; // fallback senza errori
  }
}
