import { Button, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { IPairWithId, IPair } from "../interfaces";

const Pair = ({
  pair,
  onPairChange,
  onPairDelete,
}: {
  pair: IPairWithId;
  onPairChange: (id: string, param: IPair) => void;
  onPairDelete: (id: string) => void;
}) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [isError, setError] = useState(false);

  useEffect(() => {
    onPairChange(pair._id, { [key]: value });
  }, [key, value]);

  const handleSetKey: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    if (value === "_id") return setError(true);
    setError(false);
    setKey(value);
  };

  return (
    <div className="flex mb-2 gap-2">
      <div className="flex-initial w-[30%]">
        <Input
          onChange={handleSetKey}
          error={isError}
          label={isError ? "Key _id isn't allowed" : "Key"}
          value={pair.key}
        />
      </div>
      <div className="flex-initial w-[30%]">
        <Input
          onChange={(e) => setValue(e.target.value)}
          label="Value"
          value={pair.value}
        />
      </div>
      <Button type="button" onClick={() => onPairDelete(pair._id)}>
        Remove
      </Button>
    </div>
  );
};

export default Pair;
