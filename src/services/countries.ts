async function fetchCountries(token: string): Promise<Country[]> {
  const headers= {
    Authorization: `Bearer ${token}`;
  };
  const res = await fetch(`${"API_BASE_URL"}/countries`, { method: "GET", headers });
  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }
  return res.json();
}
async function postCountryCode(
  token: string,
  countryCode: string,
): Promise<void> {
  const response = await fetch(`${"API_BASE_URL"}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ countryCode }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit country code");
  }
}
export { fetchCountries, postCountryCode };
