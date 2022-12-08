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
  Alert,
} from "@material-tailwind/react";
import ReactCodeMirror, { basicSetup } from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";
import { FormEvent, useState } from "react";
import { Pair, RequestGridTabPanel, ResponsePair } from "./components";
import { IPairWithId, IPair } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosResponse, AxiosResponseHeaders } from "axios";
import prettyBytes from "pretty-bytes";
import { EditorView } from "@codemirror/view";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";

const options = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function App() {
  const defaultSelectValue = options[0];
  const defaultJsonValue = `{\n\t\n}`;

  const [requestMethod, setRequestMethod] = useState(defaultSelectValue);
  const [requestUrl, setRequestUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  const [requestParams, setRequestParams] = useState<IPairWithId[]>([
    { _id: uuidv4() },
  ]);
  const [requestHeaders, setRequestHeaders] = useState<IPairWithId[]>([
    { _id: uuidv4() },
  ]);
  const [requestJson, setRequestJson] = useState(defaultJsonValue);
  const [requestJsonErrorMessage, setRequestJsonErrorMessage] = useState("");

  const [response, setResponse] = useState<AxiosResponse<any, any>>();
  const [responseBody, setResponseBody] = useState(defaultJsonValue);
  const [responseHeaders, setResponseHeaders] = useState<IPairWithId[]>([]);
  const [responseTime, setResponseTime] = useState(0);
  const [responseSize, setResponseSize] = useState("");

  const requestTabs = [
    {
      id: "params",
      title: "Query params",
      className: "flex justify-center",
      element: (
        <RequestGridTabPanel
          pairs={requestParams}
          handlePairDelete={handleParamDelete}
          handlePairChange={handleParamChange}
          handlePairAdd={handleAddParam}
        />
      ),
    },
    {
      id: "headers",
      title: "Headers",
      className: "flex justify-center",
      element: (
        <RequestGridTabPanel
          pairs={requestHeaders}
          handlePairAdd={handleAddHeader}
          handlePairChange={handleHeaderChange}
          handlePairDelete={handleHeaderDelete}
        />
      ),
    },
    {
      id: "json",
      title: "JSON",
      element: (
        <ReactCodeMirror
          theme={noctisLilac}
          value={requestJson}
          extensions={[basicSetup(), jsonLang()]}
          onChange={(value) => setRequestJson(value)}
        />
      ),
    },
  ];

  type TResponseHeaders =
    | AxiosResponseHeaders
    | Partial<
        Record<string, string | number> & {
          "set-cookie"?: string[] | undefined;
        }
      >;

  function convertHeaders(headers: TResponseHeaders) {
    return Object.keys(headers).reduce((array: any[], key) => {
      return [...array, { _id: uuidv4(), key, value: headers[key] }];
    }, []);
  }

  function convertPairs(pairs: IPairWithId[]) {
    return pairs.reduce((object, { _id, ...pair }) => {
      if (Object.keys(pair).includes("")) return { ...object };
      return { ...object, ...pair };
    }, {});
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(convertPairs(requestParams));
    console.log(convertPairs(requestHeaders));

    setResponse(undefined);
    setResponseHeaders([]);
    setResponseBody(defaultJsonValue);
    setRequestJsonErrorMessage("");

    const startTime = new Date().getTime();

    let data;
    try {
      data = JSON.parse(requestJson || defaultJsonValue);
    } catch (e) {
      setRequestJsonErrorMessage("You have to insert valid JSON");
      return;
    }

    axios({
      url: requestUrl,
      method: requestMethod,
      params: convertPairs(requestParams),
      headers: convertPairs(requestHeaders),
      data,
    })
      .catch((e) => e.response)
      .then((res) => {
        const endTime = new Date().getTime();
        setResponse(res);
        setResponseHeaders(convertHeaders(res.headers));
        setResponseBody(JSON.stringify(res.data, null, 2));
        setResponseTime(endTime - startTime);
        setResponseSize(
          prettyBytes(
            JSON.stringify(res.data).length + JSON.stringify(res.headers).length
          )
        );
      });
  }

  // Creates a pair template with id
  function createPair() {
    const paramId = uuidv4();
    return { _id: paramId };
  }

  function handleAddParam() {
    const newParam = createPair();
    setRequestParams([...requestParams, newParam]);
  }

  function handleAddHeader() {
    const newHeader = createPair();
    setRequestHeaders([...requestHeaders, newHeader]);
  }

  function updatePair(pairs: IPairWithId[], id: string, pair: IPair) {
    const newPairs = [...pairs];
    const index = newPairs.findIndex((p) => p._id === id);
    newPairs[index] = { _id: id, ...pair };
    return newPairs;
  }

  function handleParamChange(id: string, pair: IPair) {
    const newParams = updatePair(requestParams, id, pair);
    setRequestParams([...newParams]);
  }

  function handleHeaderChange(id: string, pair: IPair) {
    const newHeaders = updatePair(requestHeaders, id, pair);
    setRequestHeaders([...newHeaders]);
  }

  function deletePair(pairs: IPairWithId[], id: string) {
    const pairsCopy = [...pairs];
    const newPairs = pairsCopy.filter((p, i) => p._id !== id);
    return newPairs;
  }

  function handleParamDelete(id: string) {
    const newParams = deletePair(requestParams, id);
    setRequestParams([...newParams]);
  }

  function handleHeaderDelete(id: string) {
    const newHeaders = deletePair(requestHeaders, id);
    setRequestHeaders([...newHeaders]);
  }

  return (
    <div className="app flex-col w-[80%] p-2 items-center justify-center m-auto">
      <form className="mt-5 mb-10" onSubmit={handleSubmit}>
        <h2 className="text-3xl">Request</h2>
        <div className="flex items-center justify-center mx-auto my-5">
          <Select
            color="purple"
            onChange={(method) => setRequestMethod(method!.toString())}
            variant="outlined"
            label="Method"
            value={requestMethod}
          >
            {options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <div className="w-full">
            <Input
              type="url"
              value={requestUrl}
              onChange={(e) => setRequestUrl(e.target.value)}
              color="deep-purple"
              label="https://example.com"
              className="px-3 text-base"
              variant="outlined"
            />
          </div>
          <Button className="w-[200px]" type="submit" color="deep-purple">
            Send
          </Button>
        </div>
        <div className="m-auto">
          <Tabs value={requestTabs[0].id}>
            <TabsHeader>
              {requestTabs.map((tab) => (
                <Tab key={tab.id} value={tab.id}>
                  {tab.title}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {requestTabs.map((tab) => (
                <TabPanel
                  className={tab.className + " py-8 min-h-[250px]"}
                  key={tab.id}
                  value={tab.id}
                >
                  {tab.element}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
          {requestJsonErrorMessage && (
            <Alert className="w-max pl-6" color="red">
              {requestJsonErrorMessage}
            </Alert>
          )}
        </div>
      </form>
      {response !== undefined && (
        <div className="min-h-[400px]">
          <h2 className="text-3xl">Response</h2>
          <div className="flex gap-5 mb-2 mt-3">
            <p>Status: {response.status}</p>
            <p>Time: {responseTime} ms</p>
            <p>Size: {responseSize}</p>
          </div>
          <Tabs value="response-body">
            <TabsHeader>
              <Tab value="response-body">Body</Tab>
              <Tab value="response-headers">Headers</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="response-body">
                <ReactCodeMirror
                  value={responseBody}
                  extensions={[
                    basicSetup(),
                    jsonLang(),
                    EditorView.editable.of(false),
                  ]}
                />
              </TabPanel>
              <TabPanel value="response-headers" className="flex">
                <div className="grid grid-cols-2 p-2 gap-x-5">
                  {responseHeaders.map(({ _id, ...pair }) => (
                    <ResponsePair key={_id} pair={pair} />
                  ))}
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default App;
