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
  const pathSplit = url.pathname.slice(1).split("/");

  if (url.pathname === "/") {
    return new Response(await renderFile("index.eta", data), responseDetails);
  } else if (url.pathname === "/lists" && req.method === "POST") {
    const formData = await req.formData();
    const name = formData.get("name");

    await listService.add(name);

    return redirectTo("/lists", 303);
  } else if (url.pathname === "/lists" && req.method === "GET") {
    data.lists = await listService.getAll();
    return new Response(await renderFile("lists.eta", data), responseDetails);
  } else if (
    pathSplit.length === 2 && pathSplit[0] === "lists" && req.method === "GET"
  ) {
    const res = await listService.getById(Number(pathSplit[1]));
    return new Response(await renderFile("list.eta", res[0]), responseDetails);
  } else if (
    pathSplit.length === 3 && pathSplit[0] === "lists" &&
    pathSplit[2] === "deactivate" && req.method === "POST"
  ) {
    await listService.deactivateById(Number(pathSplit[1]));
    return redirectTo("/lists", 303);
  } else {
    return new Response("404", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
