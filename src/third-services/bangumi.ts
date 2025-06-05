// Base types for Bangumi API
interface Response<T> {
  code: number;
  message: string;
  data: T;
}

// Common types
export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: {
    large: string;
    medium: string;
    small: string;
  };
  sign: string;
  usergroup: number;
}

export enum SubjectType {
  book = 1,
  anime = 2,
  music = 3,
  game = 4,
  realWorld = 6,
}

export interface Subject {
  id: number;
  type: SubjectType;
  name: string;
  name_cn: string;
  summary: string;
  eps: number;
  eps_count: number;
  date: string;
  air_weekday: number;
  rating: {
    total: number;
    count: {
      [key: string]: number;
    };
    score: number;
    rank: number;
  };
  rank: number;
  images: {
    large: string;
    common: string;
    medium: string;
    small: string;
    grid: string;
  };
  collection: {
    wish: number;
    collect: number;
    doing: number;
    on_hold: number;
    dropped: number;
  };
}

export interface Episode {
  id: number;
  type: number;
  name: string;
  name_cn: string;
  sort: number;
  ep: number;
  airdate: string;
  comment: number;
  duration: string;
  desc: string;
  disc: number;
}

export interface Character {
  id: number;
  name: string;
  name_cn: string;
  role_name: string;
  images: {
    large: string;
    medium: string;
    small: string;
    grid: string;
  };
  actors: Array<{
    id: number;
    name: string;
    name_cn: string;
    images: {
      large: string;
      medium: string;
      small: string;
      grid: string;
    };
  }>;
}

export interface Person {
  id: number;
  name: string;
  name_cn: string;
  type: number;
  images: {
    large: string;
    medium: string;
    small: string;
    grid: string;
  };
  summary: string;
  locked: boolean;
  date: string;
  blood_type: number;
  height: number;
  weight: number;
  bwh: string;
  source: string;
}

export interface Calendar {
  weekday: {
    en: string;
    cn: string;
    ja: string;
    id: number;
  };
  items: Subject[];
}

export interface Collection {
  type: number;
  rate: number;
  comment: string;
  tags: string[];
  private: boolean;
  updated_at: string;
}

export interface Progress {
  ep_id: number;
  last_touch: number;
  updated_at: string;
}

export interface Notification {
  id: number;
  type: number;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
}

// API Client class
export class BangumiClient {
  private baseUrl: string;
  private token: string;

  constructor(token: string) {
    this.baseUrl = 'api.bgm.tv';
    this.token = token;
  }

  private request<T>(endpoint: string, options: any = {}): Promise<Response<T>> {
    const method = options.method || 'GET';
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const fetchOptions: RequestInit = {
      method: method,
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    return fetch(`https://${this.baseUrl}${endpoint}`, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        return data as Response<T>;
      })
      .catch(error => {
        throw new Error(`Request failed: ${error.message}`);
      });
  }

  // User related endpoints
  async getCurrentUser(): Promise<Response<User>> {
    return this.request<User>('/v0/me');
  }

  async getUserById(id: number): Promise<Response<User>> {
    return this.request<User>(`/v0/users/${id}`);
  }

  async getUserCollections(userId: number, subjectType: number = 2): Promise<Response<Collection[]>> {
    return this.request<Collection[]>(`/v0/users/${userId}/collections?subject_type=${subjectType}`);
  }

  async getUserProgress(userId: number, subjectId: number): Promise<Response<Progress[]>> {
    return this.request<Progress[]>(`/v0/users/${userId}/progress?subject_id=${subjectId}`);
  }

  // Subject related endpoints
  async getSubjectById(id: number): Promise<Response<Subject>> {
    return this.request<Subject>(`/v0/subjects/${id}`);
  }

  async getSubjectEpisodes(id: number): Promise<Response<Episode[]>> {
    return this.request<Episode[]>(`/v0/subjects/${id}/episodes`);
  }

  async getSubjectCharacters(id: number): Promise<Response<Character[]>> {
    return this.request<Character[]>(`/v0/subjects/${id}/characters`);
  }

  async getSubjectPersons(id: number): Promise<Response<Person[]>> {
    return this.request<Person[]>(`/v0/subjects/${id}/persons`);
  }

  async getSubjectRelated(id: number): Promise<Response<Subject[]>> {
    return this.request<Subject[]>(`/v0/subjects/${id}/subjects`);
  }

  // Calendar related endpoints
  async getCalendar(): Promise<Response<Calendar[]>> {
    return this.request<Calendar[]>('/v0/calendar');
  }

  // Search related endpoints
  async searchSubjects(keyword: string, specs?: {
    sort?: 'match' // eilisearch 的默认排序，按照匹配程度
      | 'heat' // 收藏人数
      | 'rank' // 排名由高到低
      | 'score'; // 评分
    type?: [SubjectType]; // 多值之间为 或 的关系
    meta_tags?: string[]; // 多个值之间为 且 关系。可以用 - 排除标签。比如 -科幻 可以排除科幻标签。
    tag?: string[];
    air_date?: string; // eg: [ ">=2020-07-01", "<2020-10-01" ]
    rating?: string[]; // eg: [ ">=6", "<8" ]
    rank?: string[]; // eg: [ ">10", "<=18" ]
  }): Promise<Response<Subject[]>> {
    const body: Record<string, any> = { keyword };
    const { sort, ...filter } = specs || {};

    if (sort) body.sort = sort;
    if (filter) body.filter = filter;
    return this.request<Subject[]>(`/v0/search/subjects`, {
      method: 'POST',
      body,
    });
  }

  async searchPersons(keyword: string): Promise<Response<Person[]>> {
    return this.request<Person[]>(`/v0/search/person/${keyword}`);
  }

  async searchCharacters(keyword: string): Promise<Response<Character[]>> {
    return this.request<Character[]>(`/v0/search/character/${keyword}`);
  }

  // Collection related endpoints
  async getSubjectCollection(id: number): Promise<Response<Collection>> {
    return this.request<Collection>(`/v0/subjects/${id}/collection`);
  }

  async updateSubjectCollection(id: number, data: {
    type: number;
    rate?: number;
    comment?: string;
    tags?: string[];
    private?: boolean;
  }): Promise<Response<any>> {
    return this.request<any>(`/v0/subjects/${id}/collection`, {
      method: 'POST',
      body: data,
    });
  }

  async updateEpisodeProgress(episodeId: number): Promise<Response<any>> {
    return this.request<any>(`/v0/episodes/${episodeId}/status`, {
      method: 'POST',
      body: { status: 2 }, // 2 means watched
    });
  }

  // Notification related endpoints
  async getNotifications(): Promise<Response<Notification[]>> {
    return this.request<Notification[]>('/v0/notifications');
  }

  async markNotificationAsRead(notificationId: number): Promise<Response<any>> {
    return this.request<any>(`/v0/notifications/${notificationId}`, {
      method: 'PUT',
      body: { read: true },
    });
  }
}
