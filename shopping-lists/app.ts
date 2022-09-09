import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listService from "./services/listService.ts";

configure({
  views: `${Deno.cwd()}/views`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const data = {
  lists: []
}

const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/lists") {
    const result = await listService.getAll();
    console.log(result);
    data.lists = result;
    return new Response(await renderFile("lists.eta", data), responseDetails);
  } else {
    return new Response("404", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
