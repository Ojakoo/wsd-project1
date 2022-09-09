import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const client = new Client({
  user: Deno.env.get("PGUSER"),
  password: Deno.env.get("PGPASSWORD"),
  host: Deno.env.get("PGHOST"),
  port: Deno.env.get("PGPORT"),
  database: Deno.env.get("PGDATABASE"),
});

const executeQuery = async (query, params) => {
  const response = {};
  try {
    await client.connect();
    const result = await client.queryObject(query, params);
    if (result && result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    if (client) {
      try {
      await client.end();
      } catch (e) {
      console.log(e);
      }
    }
  }

  return response;
};

export { executeQuery };