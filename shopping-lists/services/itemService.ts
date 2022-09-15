import { executeQuery } from "../database/database.ts";
import { Count, Item } from "../database/database.ts";

// TODO: proper error handling

const add = async (list_id: number, name: string) => {
  const result = await executeQuery<Item>(
    "INSERT INTO shopping_list_items (shopping_list_id, name, collected) VALUES ($list_id, $name, false)",
    { list_id: list_id, name: name },
    ["id", "shopping_list_id", "name", "collected"],
  );
  return result.rows;
};

const collect = async (id: number) => {
  const result = await executeQuery<void>(
    "UPDATE shopping_list_items SET collected = true WHERE id = $id",
    { id: id },
    [],
  );
  return result.rows;
};

const getByListId = async (list_id: number) => {
  const result = await executeQuery<Item>(
    "SELECT * FROM shopping_list_items WHERE shopping_list_id = $list_id",
    { list_id: list_id },
    ["id", "shopping_list_id", "name", "collected"],
  );
  return result.rows;
};

const countResources = async () => {
  const result = await executeQuery<Count>(
    "SELECT COUNT(id) FROM shopping_list_items",
    {},
    ["count"],
  );
  return result.rows;
};

export { add, collect, countResources, getByListId };
