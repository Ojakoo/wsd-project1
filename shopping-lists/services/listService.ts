import { executeQuery } from "../database/database.ts";

const getAll = async () => {
  const result = await executeQuery(
    "SELECT * FROM shopping_lists",
    {}
  );
  return result.rows;
}

const add = async (name: string) => {
  const result = await executeQuery(
    "INSERT INTO shopping_lists (name, active) VALUES ($name, true)",
    { name: name }
  )
  return result.rows;
}

export {
  getAll,
  add,
}