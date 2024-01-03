import axios, {AxiosError, RawAxiosResponseHeaders} from "axios";

export interface Response<T> {
    data: T | null
    status: number;
    statusText: string;
    headers: RawAxiosResponseHeaders
    error: string | null
}

type Http = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface Request {
    method: string
    url: string
    headers: Record<string, string>
    token: string

    send<T>(): Promise<Response<T>>

}

interface BuildRequestOptions {
    url: string,
    method?: Http
    body?: object
    headers?: Record<string, string>
    token?: string
}

export default class RequestBuilder {
    public static requestInterval: number = 100;
    private static lastRequestTime: number = 0;

    static async wait(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static async sendRequest<T>(options: BuildRequestOptions): Promise<Response<T>> {
        const headers = {
            ...(options.headers ?? {}),
            "Authorization": `Bearer ${options.token ?? ""}`
        };

        try {
            this.lastRequestTime = Date.now()
            const response = await axios.request({
                method: options.method ?? "GET",
                url: options.url,
                headers: headers,
                data: options.body,
                validateStatus: (status) => status < 500
            })
            return {
                error: null,
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            }
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                return {
                    error: e.message,
                    data: null,
                    status: e.response?.status ?? 500,
                    statusText: e.response?.statusText ?? "",
                    headers: e.response?.headers ?? {}
                }
            } else {
                return {
                    error: e as string,
                    data: null,
                    status: 500,
                    statusText: "",
                    headers: {}
                }
            }
        }


    }

    public static buildRequest(options: BuildRequestOptions): Request {
        return {
            method: options.method ?? "GET",
            url: options.url,
            headers: options.headers ?? {},
            token: options.token ?? "",

            async send<T>(): Promise<Response<T>> {
                while (Date.now() - RequestBuilder.lastRequestTime < RequestBuilder.requestInterval) {
                    await RequestBuilder.wait(RequestBuilder.requestInterval - (Date.now() - RequestBuilder.lastRequestTime))
                }

                return await RequestBuilder.sendRequest<T>({
                    method: options.method,
                    url: options.url,
                    headers: options.headers,
                    body: options.body,
                    token: options.token
                })
            },


        };
    }


}
