import { Button } from "@material-tailwind/react";
import React from "react";
import { IPair, IPairWithId } from "../interfaces";
import Pair from "./Pair";

export interface RequestGridTabPanelProps {
  pairs: IPairWithId[];
  handlePairDelete: (id: string) => void;
  handlePairChange: (id: string, pair: IPair) => void;
  handlePairAdd: () => void;
}

const RequestGridTabPanel = ({
  pairs,
  handlePairDelete,
  handlePairChange,
  handlePairAdd,
}: RequestGridTabPanelProps) => {
  return (
    <div className="flex justify-center items-center flex-col">
      {pairs.map((pair) => {
        return (
          <Pair
            key={pair._id}
            pair={pair}
            onPairDelete={handlePairDelete}
            onPairChange={handlePairChange}
          />
        );
      })}
      {pairs.length == 0 && (
        <p className="text-center text-xl mb-3">Nothing is here</p>
      )}
      <Button
        color="deep-purple"
        className={pairs.length == 0 ? "" : "self-start"}
        onClick={handlePairAdd}
      >
        Add
      </Button>
    </div>
  );
};

export default RequestGridTabPanel;
