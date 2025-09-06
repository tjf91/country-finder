import type { Country } from "@/App";
const authURL = import.meta.env.VITE_AUTH_URL;

async function fetchCountries(token: string): Promise<Record<string, Country>> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const res = await fetch(`${authURL}/challenges/countries`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }
  return res.json();
}
async function postCountryCode(
  token: string,
  phone_number: number,
  country_id: number,
): Promise<void> {
  const response = await fetch(`${authURL}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phone_number, country_id }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit country code");
  }
}
export { fetchCountries, postCountryCode };
