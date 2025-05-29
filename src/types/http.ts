export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface RequestConfig extends RequestInit {
  url: string;
  skipAuth?: boolean;
}
