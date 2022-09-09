import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as listService from "./services/listService.ts";
import * as itemService from "./services/itemService.ts";

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

// lists page handlers

const handleListsAdd = async (req) => {
  const formData = await req.formData();
  const name = formData.get("name");
  await listService.add(name);
  return redirectTo("/lists", 303);
};

const handleListsGet = async () => {
  const data = {
    lists: [],
  };

  data.lists = await listService.getAll();
  return new Response(await renderFile("lists.eta", data), responseDetails);
};

const handleListDeactivate = async (id: number) => {
  await listService.deactivateById(id);
  return redirectTo("/lists", 303);
};

// list page handlers

const handleListGet = async (id: number) => {
  const res = await listService.getById(id);
  const items = await itemService.getByListId(id);

  const data = {
    list: res[0],
    items: items,
  };

  return new Response(await renderFile("list.eta", data), responseDetails);
};

const handleItemAdd = async (req, list_id: number) => {
  const formData = await req.formData();
  const name = formData.get("name");
  await itemService.add(list_id, name);
  return redirectTo(`/lists/${list_id}`, 303);
};

const handleCollection = async (list_id: number, id: number) => {
  await itemService.collect(id);
  return redirectTo(`/lists/${list_id}`, 303);
}

// request handler

const handleRequest = async (req) => {
  const url = new URL(req.url);
  const pathSplit = url.pathname.slice(1).split("/");

  if (url.pathname === "/") {
    const list_count = await listService.countResources();
    const item_count = await itemService.countResources();

    const data = {
      list_count: list_count,
      item_count: item_count,
    }

    return new Response(await renderFile("index.eta", data), responseDetails);
  } else if (url.pathname === "/lists" && req.method === "POST") {
    return await handleListsAdd(req);
  } else if (url.pathname === "/lists" && req.method === "GET") {
    return await handleListsGet();
  } else if (
    pathSplit.length === 2 && pathSplit[0] === "lists" && req.method === "GET"
  ) {
    return await handleListGet(Number(pathSplit[1]));
  } else if (
    pathSplit.length === 3 && pathSplit[0] === "lists" &&
    pathSplit[2] === "deactivate" && req.method === "POST"
  ) {
    return await handleListDeactivate(Number(pathSplit[1]));
  } else if (
    pathSplit.length === 2 && pathSplit[0] === "lists" && req.method === "POST"
  ) {
    return await handleItemAdd(req, Number(pathSplit[1]));
  } else if (
    pathSplit.length === 5 && pathSplit[0] === "lists" && pathSplit[2] === "items" && pathSplit[4] === "collect" && req.method === "POST"
  ) {
    return await handleCollection( Number(pathSplit[1]), Number(pathSplit[3]));
  } else {
    console.log("missed path");
    return new Response("404", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
