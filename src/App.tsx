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
import {
  RequestGridTabPanel,
  RequestMethodSelect,
  ResponsePair,
} from "./components";
import { IPair, TResponse } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { EditorView } from "@codemirror/view";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { deletePair, parseJson } from "./utils";
import {
  defaultSelectValue,
  defaultJsonValue,
  defaultUrlValue,
} from "./constants";
import useResponseData from "./hooks/useResponseData";
import updatePair from "./utils/updatePair";
import convertPairs from "./utils/convertPairs";
import usePairs from "./hooks/usePairs";

function App() {
  // Request states
  const [requestMethod, setRequestMethod] = useState(defaultSelectValue);
  const [requestUrl, setRequestUrl] = useState(defaultUrlValue);
  const [requestParams, setRequestParams] = usePairs();
  const [requestHeaders, setRequestHeaders] = usePairs();
  const [requestJson, setRequestJson] = useState(defaultJsonValue);
  const [requestJsonErrorMessage, setRequestJsonErrorMessage] = useState("");

  // Response states
  const [response, setResponse] = useState<TResponse>(null);
  const [responseHeaders, responseBody, responseSize] =
    useResponseData(response);
  const [responseTime, setResponseTime] = useState(0);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    resetResponse();

    // Parse request JSON data
    // If gives error => invalid json
    let data;
    try {
      data = parseJson(requestJson, defaultJsonValue);
    } catch (e) {
      setRequestJsonErrorMessage("You have to insert valid JSON");
      return;
    }

    const axiosConfig = generateAxiosConfig(data);

    const [response, time] = await fetchUrl(axiosConfig);

    setResponse(response);
    setResponseTime(time);
  }

  function resetResponse() {
    setResponse(null);
    setRequestJsonErrorMessage("");
  }

  function generateAxiosConfig(data: any) {
    return {
      url: requestUrl,
      method: requestMethod,
      params: convertPairs(requestParams),
      headers: convertPairs(requestHeaders),
      data,
    };
  }

  async function fetchUrl(
    axiosConfig: AxiosRequestConfig<any>
  ): Promise<[AxiosResponse<any, any>, number]> {
    let response;
    // startTime and endTime are used to calculate time of request
    const startTime = new Date().getTime();
    try {
      response = await axios(axiosConfig);
    } catch (e: any) {
      response = e.response;
    }
    const endTime = new Date().getTime();
    const time = endTime - startTime;
    return [response, time];
  }

  // Create a pair template with id
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

  function handleParamChange(id: string, pair: IPair) {
    const newParams = updatePair(requestParams, id, pair);
    setRequestParams(newParams);
  }

  function handleHeaderChange(id: string, pair: IPair) {
    const newHeaders = updatePair(requestHeaders, id, pair);
    setRequestHeaders(newHeaders);
  }

  function handleParamDelete(id: string) {
    const newParams = deletePair(requestParams, id);
    setRequestParams(newParams);
  }

  function handleHeaderDelete(id: string) {
    const newHeaders = deletePair(requestHeaders, id);
    setRequestHeaders(newHeaders);
  }

  return (
    <div className="app flex-col w-[80%] p-2 items-center justify-center m-auto">
      <form className="mt-5 mb-10" onSubmit={handleSubmit}>
        <h2 className="text-3xl">Request</h2>
        <div className="flex items-center justify-center mx-auto my-5">
          <RequestMethodSelect
            onMethodSelect={(method) => setRequestMethod(method!.toString())}
            selectedRequestMethod={requestMethod}
          />
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
      {response && (
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
