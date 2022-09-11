import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

interface serverSchema {
  user: string | undefined;
  password: string | undefined;
  host: string | undefined;
  port: string | undefined;
  database: string | undefined;
}

interface List {
  id: number;
  name: string;
  active: boolean;
}

interface Item {
  id: number;
  shopping_list_id: number;
  name: string;
  collected: boolean;
}

interface Count {
  count: number;
}

type QueryParams = Record<string, unknown>;

type ResponseFields = Array<string>;

// this is union type, need to fix to template with multiple return types
type ReturnFields = Array<List | Item | Count>;

interface responseDetails {
  rows?: ReturnFields;
  error?: Error;
}

const db: serverSchema = {
  user: Deno.env.get("PGUSER"),
  password: Deno.env.get("PGPASSWORD"),
  host: Deno.env.get("PGHOST"),
  port: Deno.env.get("PGPORT"),
  database: Deno.env.get("PGDATABASE"),
};

const client = new Client(db);

// Using multiple interface returns is quite sketchy but it works for now
// need to figure how to better construct typesafe query based on inputs.
// Implementing guards is probably the wy to go.

const executeQuery = async (
  query: string,
  params: QueryParams,
  fields: ResponseFields,
) => {
  const response: responseDetails = {};
  try {
    await client.connect();
    const result = await client.queryObject<List | Item | Count>(
      {
        text: query,
        args: params,
        fields: fields,
      },
    );
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
export type { Count, Item, List, ResponseFields };
