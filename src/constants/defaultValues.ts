import { v4 as uuidv4 } from "uuid";
import methods from "./methods";

const defaultSelectValue = methods[0];
const defaultUrlValue = "https://jsonplaceholder.typicode.com/todos/1";
const defaultJsonValue = `{\n\t\n}`;
const defaultPairsValue = [{ _id: uuidv4() }];

export {
  defaultSelectValue,
  defaultUrlValue,
  defaultJsonValue,
  defaultPairsValue,
};
