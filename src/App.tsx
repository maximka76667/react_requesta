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
import { FormEvent, useState } from "react";
import { Pair } from "./components";
import { IPairWithId, IPair } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosResponse } from "axios";

const options = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function App() {
  const defaultSelectValue = options[0];
  const jsonDefaultValue = `{\n\t\n}`;

  const [method, setMethod] = useState(defaultSelectValue);
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  const [json, setJson] = useState(jsonDefaultValue);
  const [params, setParams] = useState<IPairWithId[]>([]);
  const [headers, setHeaders] = useState<IPairWithId[]>([]);

  const [response, setResponse] = useState<AxiosResponse<any, any>>();

  function convertPairs(pairs: IPairWithId[]) {
    return pairs.reduce((object, { _id, ...pair }) => {
      if (Object.keys(pair).includes("")) return { ...object };
      return { ...object, ...pair };
    }, {});
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(convertPairs(params));
    console.log(convertPairs(headers));

    axios({
      url,
      method,
      params: convertPairs(params),
      headers: convertPairs(headers),
    }).then((res) => {
      console.log(res);
      setResponse(res);
    });
  }

  // Creates a pair template with id
  function createPair() {
    const paramId = uuidv4();
    return { _id: paramId };
  }

  function handleAddParam() {
    const newParam = createPair();
    setParams([...params, newParam]);
  }

  function handleAddHeader() {
    const newHeader = createPair();
    setHeaders([...headers, newHeader]);
  }

  function updatePair(pairs: IPairWithId[], id: string, pair: IPair) {
    const newPairs = [...pairs];
    const index = newPairs.findIndex((p) => p._id === id);
    newPairs[index] = { _id: id, ...pair };
    return newPairs;
  }

  function handleParamChange(id: string, pair: IPair) {
    const newParams = updatePair(params, id, pair);
    setParams([...newParams]);
  }

  function handleHeaderChange(id: string, pair: IPair) {
    const newHeaders = updatePair(headers, id, pair);
    setHeaders([...newHeaders]);
  }

  function deletePair(pairs: IPairWithId[], id: string) {
    const pairsCopy = [...pairs];
    const newPairs = pairsCopy.filter((p, i) => p._id !== id);
    return newPairs;
  }

  function handleParamDelete(id: string) {
    const newParams = deletePair(params, id);
    setParams([...newParams]);
  }

  function handleHeaderDelete(id: string) {
    const newHeaders = deletePair(headers, id);
    setHeaders([...newHeaders]);
  }

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
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
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
                  {params.map((param) => {
                    return (
                      <Pair
                        key={param._id}
                        pair={param}
                        onPairDelete={handleParamDelete}
                        onPairChange={handleParamChange}
                      />
                    );
                  })}
                  <Button className="self-start" onClick={handleAddParam}>
                    Add
                  </Button>
                </div>
              </TabPanel>
              <TabPanel value="headers" className="flex justify-center">
                <div className="flex justify-center items-center flex-col">
                  {headers.map((header) => {
                    return (
                      <Pair
                        key={header._id}
                        pair={header}
                        onPairDelete={handleHeaderDelete}
                        onPairChange={handleHeaderChange}
                      />
                    );
                  })}
                  <Button className="self-start" onClick={handleAddHeader}>
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
      {response && (
        <div>
          <h2>Response</h2>
          <p>{response.status}</p>
        </div>
      )}
    </div>
  );
}

export default App;
