import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGraphQL } from "./api";

const mockFetch = (ok: boolean, body: unknown) => {
  const spy = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", spy);
  return spy;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchGraphQL", () => {
  it("returns json.data on a successful response", async () => {
    mockFetch(true, { data: { posts: { nodes: [] } } });
    const result = await fetchGraphQL("query { posts { nodes { slug } } }");
    expect(result).toEqual({ posts: { nodes: [] } });
  });

  it("sends the query and variables as JSON in the request body", async () => {
    const fetchSpy = mockFetch(true, { data: {} });
    await fetchGraphQL("query Foo { foo }", { id: "42" });
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body).toEqual({ query: "query Foo { foo }", variables: { id: "42" } });
  });

  it("defaults variables to an empty object when not provided", async () => {
    const fetchSpy = mockFetch(true, { data: {} });
    await fetchGraphQL("query Foo { foo }");
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.variables).toEqual({});
  });

  it("throws when response.ok is false", async () => {
    mockFetch(false, { errors: [{ message: "Not found" }] });
    await expect(fetchGraphQL("query { foo }")).rejects.toThrow("GraphQL Error");
  });

  it("throws when response.ok is true but json.errors is present", async () => {
    mockFetch(true, { errors: [{ message: "Field does not exist" }] });
    await expect(fetchGraphQL("query { foo }")).rejects.toThrow("GraphQL Error");
  });
});
