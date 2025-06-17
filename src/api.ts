// src/api.ts
const API_URL = "http://192.168.0.178:5104/api";

export async function getShifts(token: string) {
  const resp = await fetch(`${API_URL}/shift`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!resp.ok) throw new Error(await resp.text());
  return await resp.json();
}