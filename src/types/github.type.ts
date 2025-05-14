export interface Repo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string;
  owner: { avatar_url: string };
}

export interface LanguageColor {
  color: string | null;
  url?: string;
}

export interface GitHubApiResponse {
  items: Repo[];
  total_count: number;
  incomplete_results: boolean;
}

export interface CacheData {
  data: Repo[];
  timestamp: number;
}
