import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

configure({
  views: `${Deno.cwd()}/views`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/lists") {
    return new Response(await renderFile("lists.eta", {}), responseDetails);
  } else {
    return new Response("404", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
