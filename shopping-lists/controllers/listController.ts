import * as listService from "../services/listService.ts";
import * as itemService from "../services/itemService.ts";
import { redirectTo, responseDetails } from "../utils/requestUtils.ts";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

const handleListGet = async (id: number) => {
  const res = await listService.getById(id);
  const items = await itemService.getByListId(id);

  items.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    return 0;
  }).sort((a, b) => {
    return Number(a.collected) - Number(b.collected);
  });

  if (res && items) {
    const data = {
      list: res[0],
      items: items,
    };

    return new Response(
      await renderFile("list.eta", data) as string,
      responseDetails,
    );
  }
  // no list page with id return 404
  return new Response("404", { status: 404 });
  // error return
};

const handleItemAdd = async (req: Request, list_id: number) => {
  const formData = await req.formData();
  const name = formData.get("name");
  await itemService.add(list_id, name as string);
  return redirectTo(`/lists/${list_id}`, 303);
};

const handleCollection = async (list_id: number, id: number) => {
  await itemService.collect(id);
  return redirectTo(`/lists/${list_id}`, 303);
};

export { handleCollection, handleItemAdd, handleListGet };
