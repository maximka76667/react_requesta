import { IPairWithId } from "../interfaces";

export default function convertPairs(pairs: IPairWithId[]) {
  return pairs.reduce((object, { _id, ...pair }) => {
    if (Object.keys(pair).includes("")) return { ...object };
    return { ...object, ...pair };
  }, {});
}
