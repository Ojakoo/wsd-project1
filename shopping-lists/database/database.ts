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

//  this is still bit sketch
type QueryParams = Record<string, unknown>;

type ResponseFields = Array<string>;

const db: serverSchema = {
  user: Deno.env.get("PGUSER"),
  password: Deno.env.get("PGPASSWORD"),
  host: Deno.env.get("PGHOST"),
  port: Deno.env.get("PGPORT"),
  database: Deno.env.get("PGDATABASE"),
};

const client = new Client(db);

const executeQuery = async <ResponseType>(
  query: string,
  params: QueryParams,
  fields: ResponseFields,
): Promise<{
  rows: Array<ResponseType>;
  error?: Error;
}> => {
  const response: {
    rows: Array<ResponseType>;
    error?: Error;
  } = { rows: [] };
  try {
    await client.connect();
    const result = await client.queryObject<ResponseType>(
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
export type { Count, Item, List };
