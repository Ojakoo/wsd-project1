import * as listService from "../services/listService.ts";
import { redirectTo, responseDetails } from "../utils/requestUtils.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

const handleListsAdd = async (req: Request) => {
  const formData = await req.formData();

  if (formData.has("name")) {
    await listService.add(formData.get("name") as string);
  }

  return redirectTo("/lists", 303);
};

const handleListsGet = async () => {
  const lists = await listService.getAll();
  return new Response(
    await renderFile("lists.eta", { lists }) as string,
    responseDetails,
  );
};

const handleListDeactivate = async (id: number) => {
  await listService.deactivateById(id);
  return redirectTo("/lists", 303);
};

export { handleListDeactivate, handleListsAdd, handleListsGet };
