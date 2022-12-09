import { useEffect, useState } from "react";
import { IPairWithId, TResponse, TResponseHeaders } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { defaultJsonValue } from "../constants";
import { getResponseSize } from "../utils";

export default function useResponseData(
  response: TResponse
): [IPairWithId[], string, string] {
  const [responseBody, setResponseBody] = useState(defaultJsonValue);
  const [responseHeaders, setResponseHeaders] = useState<IPairWithId[]>([]);

  const [responseSize, setResponseSize] = useState("");

  useEffect(() => {
    if (response == null) {
      setResponseHeaders([]);
      setResponseBody(defaultJsonValue);
      return;
    }
    setResponseHeaders(convertHeaders(response.headers));
    setResponseBody(JSON.stringify(response.data, null, 2));

    setResponseSize(getResponseSize(response));
  }, [response]);

  function convertHeaders(headers: TResponseHeaders) {
    return Object.keys(headers).reduce((array: any[], key) => {
      return [...array, { _id: uuidv4(), key, value: headers[key] }];
    }, []);
  }

  return [responseHeaders, responseBody, responseSize];
}
