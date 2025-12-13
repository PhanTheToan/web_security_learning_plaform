export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  title: string;
  status: 'Published' | 'Draft' | 'Archived';
  authorName?: string;
  content: string;
  labs: Lab[];
  tags: Tag[];
  coverImage?: string;
}

export interface Lab {
  id: number;
  name: string;
  estatus: string;
}

export interface TopicsApiResponse {
  content: Topic[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface TopicDetailApiResponse extends Omit<Topic, 'authorName'> {}