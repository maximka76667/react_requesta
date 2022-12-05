import {
  Select,
  Option,
  Input,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";
import { useState } from "react";
import { Param } from "./components";

const options = ["GET", "POST", "PUT", "PATCH", "DELETE"];

interface IParam {
  key: string;
  value: string;
}

function App() {
  const defaultSelectValue = options[0];
  const jsonDefaultValue = `{\n\t\n}`;

  const [method, setMethod] = useState(defaultSelectValue);
  const [json, setJson] = useState(jsonDefaultValue);
  const [params, setParams] = useState<IParam>({ key: "", value: "" });

  function addParam() {
    setParams([...params, { key: "", value: "" }]);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(method);
      }}
    >
      <div className="flex p-6 items-center justify-center m-auto">
        <Select
          color="purple"
          onChange={(method) => setMethod(method!.toString())}
          variant="outlined"
          label="Method"
          value={method}
        >
          {options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <div className="w-[60%]">
          <Input
            required
            type="url"
            color="light-blue"
            label="https://example.com"
            className="px-3 text-base"
            variant="outlined"
          />
        </div>
        <Button type="submit" color="deep-purple">
          Send
        </Button>
      </div>
      <div className="m-auto">
        <Tabs value="params">
          <TabsHeader>
            <Tab value="params">Query params</Tab>
            <Tab value="headers">Headers</Tab>
            <Tab value="json">JSON</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="params" className="flex justify-center">
              <div className="flex justify-center items-center flex-col">
                <div className="flex mb-2 gap-2">
                  <div className="flex-initial w-[30%]">
                    <Input label="Key" />
                  </div>
                  <div className="flex-initial w-[30%]">
                    <Input label="Value" />
                  </div>
                  <Button type="button">Remove</Button>
                </div>
                <Button className="self-start">Add</Button>
              </div>
            </TabPanel>
            <TabPanel value="headers" className="flex justify-center">
              <div className="flex justify-center items-center flex-col">
                {params.map((param) => (
                  <Param />
                ))}
                <Param />
                <Button className="self-start" onClick={addParam}>
                  Add
                </Button>
              </div>
            </TabPanel>
            <TabPanel value="json">
              <ReactCodeMirror
                value={json}
                extensions={[jsonLang()]}
                onChange={(value, viewUpdate) => setJson(value)}
              />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </form>
  );
}

export default App;
