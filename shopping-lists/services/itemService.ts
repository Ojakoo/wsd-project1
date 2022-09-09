import { executeQuery } from "../database/database.ts";

const add = async (list_id: number, name: string) => {
  const result = await executeQuery(
    "INSERT INTO shopping_list_items (shopping_list_id, name, collected) VALUES ($list_id, $name, false)",
    { list_id: list_id, name: name },
  );
  return result.rows;
};

const collect = async (id: number) => {
  const result = await executeQuery(
    "UPDATE shopping_list_items SET collected = true WHERE id = $id",
    { id: id },
  );
  return result.rows;
};

const getByListId = async (list_id: number) => {
  const result = await executeQuery(
    "SELECT * FROM shopping_list_items WHERE shopping_list_id = $list_id",
    { list_id: list_id },
  );
  return result.rows;
};

export { add, collect, getByListId };
