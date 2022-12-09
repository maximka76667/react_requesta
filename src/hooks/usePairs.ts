import { Dispatch, SetStateAction, useState } from "react";
import { IPairWithId } from "../interfaces";
import { defaultPairsValue } from "../constants";

export default function usePairs(): [
  IPairWithId[],
  Dispatch<SetStateAction<IPairWithId[]>>
] {
  const [pairs, setPairs] = useState<IPairWithId[]>(defaultPairsValue);

  return [pairs, setPairs];
}
