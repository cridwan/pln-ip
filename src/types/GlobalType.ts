export interface IPagination<T> {
  data: T;
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: null | string;
  next_page_url: null | string;
  path: string;
  per_page: null | number;
  prev_page_url: null | number;
  to: number;
  total: number;
}

export interface IParams {
  search: string;
  filter?: string;
  filters?: Record<string, any>[] | string;
  currentPage?: number;
  perPage?: number;
}

export interface CreateDocumentInterface {
  document: File;
  document_type: string;
  document_uuid: string;
}

export interface NotificationInterface {
  uuid: string;
  uri: string;
  title: string;
  summary: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface ResponseDocumentInterface {
  uuid: string;
  document_uuid: string;
  document_type: string;
  document_name: string;
  document_link: string;
  document_size: number;
  document_mime_type: string;
  document_original_name: string;
  created_at: string;
  updated_at: string;
}
