import { AxiosResponseHeaders } from "axios";

type TResponseHeaders =
  | AxiosResponseHeaders
  | Partial<
      Record<string, string | number> & {
        "set-cookie"?: string[] | undefined;
      }
    >;

export default TResponseHeaders;
