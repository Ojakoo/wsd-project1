import { executeQuery } from "../database/database.ts";

const getAll = async () => {
  const result = await executeQuery(
    "SELECT * FROM shopping_lists",
    {}
  );
  return result.rows;
}

export {
  getAll,
}