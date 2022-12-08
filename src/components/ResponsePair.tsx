import React from "react";
import { IPair } from "../interfaces";

const ResponsePair = ({
  pair,
}: {
  pair: {
    [key: string]: string | number;
    [key: number]: string | number;
    [key: symbol]: string | number;
  };
}) => {
  return (
    <>
      <p className="border-r-2">{pair.key}</p>
      <p>{pair.value}</p>
    </>
  );
};

export default ResponsePair;
