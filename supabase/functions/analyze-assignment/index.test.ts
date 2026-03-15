import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/analyze-assignment`;

Deno.test("rejects unauthenticated requests with 401", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ documentText: "Test assignment" }),
  });
  assertEquals(response.status, 401);
  const body = await response.json();
  assertEquals(body.error, "Unauthorized");
});

Deno.test("rejects request without Bearer prefix", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "InvalidToken",
    },
    body: JSON.stringify({ documentText: "Test assignment" }),
  });
  assertEquals(response.status, 401);
  await response.text();
});

Deno.test("rejects request with invalid Bearer token", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer invalid-jwt-token-here",
    },
    body: JSON.stringify({ documentText: "Test assignment" }),
  });
  assertEquals(response.status, 401);
  await response.text();
});

Deno.test("CORS preflight returns 200", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
    },
  });
  assertEquals(response.status, 200);
  await response.text();
});
