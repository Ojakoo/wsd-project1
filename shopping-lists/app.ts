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
  lists: [],
};

const redirectTo = (path: string, code: number) => {
  return new Response("Redirect", {
    status: code,
    headers: { "Location": path },
  });
};

const handleRequest = async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response(await renderFile("index.eta", data), responseDetails);
  } else if (url.pathname === "/lists") {
    if (req.method === "POST") {
      const formData = await req.formData();
      const name = formData.get("name");

      await listService.add(name);

      return redirectTo("/lists", 303);
    } else {
      data.lists = await listService.getAll();
      return new Response(await renderFile("lists.eta", data), responseDetails);
    }
  } else {
    return new Response("404", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
