const API_URL = "https://api.pokemontcg.io/v2";

export async function getCard(cardId: string) {
  const res = await fetch(`${API_URL}/cards/${cardId}`, {
    headers: {
      "X-Api-Key": process.env.POKEMON_TCG_API_KEY || "",
    },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  return data.data;
}

export async function searchCards(query: string) {
  const res = await fetch(`${API_URL}/cards?q=name:${query}*`, {
    headers: {
      "X-Api-Key": process.env.POKEMON_TCG_API_KEY || "",
    },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  return data.data;
}