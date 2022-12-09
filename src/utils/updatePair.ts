import { IPair, IPairWithId } from "../interfaces";

export default function updatePair(
  pairs: IPairWithId[],
  id: string,
  pair: IPair
) {
  const newPairs = [...pairs];
  const index = newPairs.findIndex((p) => p._id === id);
  newPairs[index] = { _id: id, ...pair };
  return newPairs;
}
