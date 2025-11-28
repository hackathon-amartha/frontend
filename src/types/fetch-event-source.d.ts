declare module "@sentool/fetch-event-source" {
  export interface EventSourceMessage {
    data: string | Record<string, unknown>;
    event?: string;
    id?: string;
    retry?: number;
  }

  export interface FetchEventSourceInit extends Omit<RequestInit, "headers"> {
    headers?: HeadersInit | Headers | Record<string, string>;
    onopen?: (response: Response) => Promise<void> | void;
    onmessage?: (event: EventSourceMessage) => void;
    onclose?: () => void;
    onerror?: (err: unknown) => unknown;
    openWhenHidden?: boolean;
  }

  export function fetchEventSource(
    url: string,
    options: FetchEventSourceInit
  ): Promise<void>;
}
