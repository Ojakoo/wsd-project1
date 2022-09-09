import { executeQuery } from "../database/database.ts";

const getAll = async () => {
  const result = await executeQuery(
    "SELECT * FROM shopping_lists WHERE active = true",
    {},
  );
  return result.rows;
};

const getById = async (id: number) => {
  const result = await executeQuery(
    "SELECT * FROM shopping_lists WHERE id = $id",
    { id: id },
  );
  return result.rows;
};

const add = async (name: string) => {
  const result = await executeQuery(
    "INSERT INTO shopping_lists (name, active) VALUES ($name, true)",
    { name: name },
  );
  return result.rows;
};

const deactivateById = async (id: number) => {
  const result = await executeQuery(
    "UPDATE shopping_lists SET active = false WHERE id = $id",
    { id: id },
  );
  return result.rows;
};

const countResources = async () => {
  const result = await executeQuery(
    "SELECT COUNT(id) FROM shopping_lists",
    {},
  );
  return result.rows[0].count;
}

export { add, deactivateById, getAll, getById, countResources };
