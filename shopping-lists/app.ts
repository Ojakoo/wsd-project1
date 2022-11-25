import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as itemService from "./services/itemService.ts";
import * as listService from "./services/listService.ts";
import * as listsController from "./controllers/listsController.ts";
import * as listController from "./controllers/listController.ts";

configure({
  views: `${Deno.cwd()}/views`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path: string, code: number) => {
  return new Response("Redirect", {
    status: code,
    headers: { "Location": path },
  });
};

// router

const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const pathSplit = url.pathname.slice(1).split("/");

  if (url.pathname === "/") {
    const data = {
      list_count: 0,
      item_count: 0,
    };

    const list_count = await listService.countResources();
    const item_count = await itemService.countResources();

    if (list_count && item_count) {
      data.list_count = Number(list_count[0].count);
      data.item_count = Number(item_count[0].count);
    }

    return new Response(
      await renderFile("index.eta", data) as string,
      responseDetails,
    );
  } else if (url.pathname === "/lists" && req.method === "POST") {
    return await listsController.handleListsAdd(req);
  } else if (url.pathname === "/lists" && req.method === "GET") {
    return await listsController.handleListsGet();
  } else if (
    pathSplit.length === 2 && pathSplit[0] === "lists" && req.method === "GET"
  ) {
    return await listController.handleListGet(Number(pathSplit[1]));
  } else if (
    pathSplit.length === 3 && pathSplit[0] === "lists" &&
    pathSplit[2] === "deactivate" && req.method === "POST"
  ) {
    return await listsController.handleListDeactivate(Number(pathSplit[1]));
  } else if (
    pathSplit.length === 2 && pathSplit[0] === "lists" && req.method === "POST"
  ) {
    return await listController.handleItemAdd(req, Number(pathSplit[1]));
  } else if (
    pathSplit.length === 5 && pathSplit[0] === "lists" &&
    pathSplit[2] === "items" && pathSplit[4] === "collect" &&
    req.method === "POST"
  ) {
    return await listController.handleCollection(
      Number(pathSplit[1]),
      Number(pathSplit[3]),
    );
  } else {
    console.log("missed path");
    return new Response("404", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
