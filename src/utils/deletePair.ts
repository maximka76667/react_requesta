import { IPairWithId } from "../interfaces";

export default function deletePair(pairs: IPairWithId[], id: string) {
  const pairsCopy = [...pairs];
  const newPairs = pairsCopy.filter((p, i) => p._id !== id);
  return newPairs;
}
