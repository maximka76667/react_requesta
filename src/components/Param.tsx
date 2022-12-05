import { Button, Input } from "@material-tailwind/react";
import React from "react";

const Param = () => {
  return (
    <div className="flex mb-2 gap-2">
      <div className="flex-initial w-[30%]">
        <Input label="Key" />
      </div>
      <div className="flex-initial w-[30%]">
        <Input label="Value" />
      </div>
      <Button type="button">Remove</Button>
    </div>
  );
};

export default Param;
