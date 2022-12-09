import { AxiosResponse } from "axios";
import prettyBytes from "pretty-bytes";

export default function getResponseSize(response: AxiosResponse<any, any>) {
  const responseDataLength = JSON.stringify(response.data).length;
  const responseHeadersLength = JSON.stringify(response.headers).length;
  return prettyBytes(responseDataLength + responseHeadersLength);
}
