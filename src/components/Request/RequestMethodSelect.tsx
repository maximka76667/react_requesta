import { Option, Select } from "@material-tailwind/react";
import { onChange } from "@material-tailwind/react/types/components/select";
import React from "react";
import { methods } from "../../constants";

interface RequestMethodSelectProps {
  selectedRequestMethod: string;
  onMethodSelect: onChange;
}

const RequestMethodSelect = ({
  selectedRequestMethod,
  onMethodSelect,
}: RequestMethodSelectProps) => {
  return (
    <Select
      color="purple"
      onChange={onMethodSelect}
      variant="outlined"
      label="Method"
      value={selectedRequestMethod}
    >
      {methods.map((method) => (
        <Option key={method} value={method}>
          {method}
        </Option>
      ))}
    </Select>
  );
};

export default RequestMethodSelect;
