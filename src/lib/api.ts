import SINGLE_POST_QUERY from "./graphql/queries/singlePost";

interface GraphQLResponse<T> {
  data: T;
  errors?: unknown;
}

export interface SinglePost {
  title: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      mediaDetails?: {
        height: number;
        width: number;
      };
    };
  };
  seo: {
    opengraphDescription: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
}

interface SinglePostResponse {
  page: SinglePost;
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch("https://blog.roastdinnersaroundtheworld.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (!response.ok || json.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

export async function fetchSinglePost(id: string): Promise<SinglePost> {
  try {
    const { page } = await fetchGraphQL<SinglePostResponse>(SINGLE_POST_QUERY, { id });
    return page;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    throw error;
  }
}
