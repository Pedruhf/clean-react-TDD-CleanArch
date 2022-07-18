import { HttpGetClient, HttpGetParams, HttpPostClient, httpPostParams, HttpResponse } from "@/data/protocols/http";
import axios, { AxiosResponse } from "axios";

export class AxiosHttpClient implements HttpPostClient, HttpGetClient {
  async post(params: httpPostParams): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.post(params.url, params.body);
    } catch (error) {
      axiosResponse = error.response;
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
  
  async get(params: HttpGetParams): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.get(params.url);
    } catch (error) {
      axiosResponse = error.response;
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
