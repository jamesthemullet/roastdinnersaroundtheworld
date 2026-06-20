import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SortPosts from "./sortPosts";

const posts = [
  {
    slug: "/beef-london",
    title: "Beef London",
    customfields: {
      rating: 8,
      currency: "£",
      price: 10,
      meat: "Beef",
      country: "UK",
      yearVisited: 2023,
      convertedPrice: 10,
    },
  },
  {
    slug: "/lamb-paris",
    title: "Lamb Paris",
    customfields: {
      rating: 6,
      currency: "€",
      price: 20,
      meat: "Lamb",
      country: "France",
      yearVisited: 2022,
      convertedPrice: 22,
    },
  },
  {
    slug: "/beef-edinburgh",
    title: "Beef Edinburgh",
    customfields: {
      rating: 9,
      currency: "£",
      price: 15,
      meat: "Beef",
      country: "UK",
      yearVisited: 2024,
      convertedPrice: 15,
    },
  },
];

// Reset URL and stub history.replaceState before every test to prevent contamination
beforeEach(() => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { search: "", pathname: "/league-of-roasts", href: "http://localhost/league-of-roasts" },
  });
  vi.spyOn(history, "replaceState").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Each data row has one link; querying links gives ordered data rows
const getLinks = () => screen.getAllByRole("link");

describe("SortPosts filtering", () => {
  it("renders all posts by default sorted by rating ascending", () => {
    render(<SortPosts posts={posts} />);
    const links = getLinks();
    expect(links).toHaveLength(3);
    // ascending rating: 6 (Lamb Paris), 8 (Beef London), 9 (Beef Edinburgh)
    expect(links[0]).toHaveTextContent("Lamb Paris");
    expect(links[1]).toHaveTextContent("Beef London");
    expect(links[2]).toHaveTextContent("Beef Edinburgh");
  });

  it("filters by meat type", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /meat/i }), "Beef");
    const links = getLinks();
    expect(links).toHaveLength(2);
    expect(links.every((a) => a.textContent?.includes("Beef"))).toBe(true);
  });

  it("filters by country", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /country/i }), "France");
    const links = getLinks();
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("Lamb Paris");
  });

  it("filters by minimum rating", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.type(screen.getByRole("spinbutton", { name: /minimum/i }), "8");
    const links = getLinks();
    expect(links).toHaveLength(2);
    const texts = links.map((a) => a.textContent);
    expect(texts).toContain("Beef London");
    expect(texts).toContain("Beef Edinburgh");
  });

  it("filters by maximum converted price", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.type(screen.getByRole("spinbutton", { name: /maximum/i }), "15");
    const links = getLinks();
    expect(links).toHaveLength(2);
    const texts = links.map((a) => a.textContent);
    expect(texts).toContain("Beef London");
    expect(texts).toContain("Beef Edinburgh");
  });

  it("clears all filters to restore full list", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /meat/i }), "Beef");
    expect(getLinks()).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: /clear all filters/i }));
    expect(getLinks()).toHaveLength(3);
  });
});

describe("SortPosts sorting", () => {
  it("toggles sort order from ascending to descending", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.click(screen.getByRole("button", { name: /descending/i }));
    const links = getLinks();
    // descending rating: 9 (Beef Edinburgh), 8 (Beef London), 6 (Lamb Paris)
    expect(links[0]).toHaveTextContent("Beef Edinburgh");
    expect(links[2]).toHaveTextContent("Lamb Paris");
  });

  it("sorts by convertedPrice ascending", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /sort by/i }),
      "convertedPrice"
    );
    const links = getLinks();
    // ascending convertedPrice: 10, 15, 22
    expect(links[0]).toHaveTextContent("Beef London");
    expect(links[1]).toHaveTextContent("Beef Edinburgh");
    expect(links[2]).toHaveTextContent("Lamb Paris");
  });
});

describe("SortPosts column visibility", () => {
  it("hides the Meat column when the Meat checkbox is unchecked", async () => {
    render(<SortPosts posts={posts} />);
    expect(screen.getByRole("columnheader", { name: "Meat" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /meat/i }));
    expect(screen.queryByRole("columnheader", { name: "Meat" })).not.toBeInTheDocument();
  });

  it("restores the Meat column when the checkbox is re-checked", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.click(screen.getByRole("checkbox", { name: /meat/i }));
    await userEvent.click(screen.getByRole("checkbox", { name: /meat/i }));
    expect(screen.getByRole("columnheader", { name: "Meat" })).toBeInTheDocument();
  });

  it("hides the Country column when the Country checkbox is unchecked", async () => {
    render(<SortPosts posts={posts} />);
    expect(screen.getByRole("columnheader", { name: "Country" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /country/i }));
    expect(screen.queryByRole("columnheader", { name: "Country" })).not.toBeInTheDocument();
  });
});

describe("SortPosts URL params", () => {
  it("seeds meat filter from URL param on mount", () => {
    window.location.search = "?meat=Beef";
    render(<SortPosts posts={posts} />);
    const links = getLinks();
    expect(links).toHaveLength(2);
    expect(links.every((a) => a.textContent?.includes("Beef"))).toBe(true);
  });

  it("seeds country filter from URL param on mount", () => {
    window.location.search = "?country=France";
    render(<SortPosts posts={posts} />);
    const links = getLinks();
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("Lamb Paris");
  });

  it("seeds score filter from URL param on mount", () => {
    window.location.search = "?score=8";
    render(<SortPosts posts={posts} />);
    const links = getLinks();
    expect(links).toHaveLength(2);
    const texts = links.map((a) => a.textContent);
    expect(texts).toContain("Beef London");
    expect(texts).toContain("Beef Edinburgh");
  });

  it("seeds price filter from URL param on mount", () => {
    window.location.search = "?price=15";
    render(<SortPosts posts={posts} />);
    const links = getLinks();
    expect(links).toHaveLength(2);
    const texts = links.map((a) => a.textContent);
    expect(texts).toContain("Beef London");
    expect(texts).toContain("Beef Edinburgh");
  });

  it("seeds sort column and order from URL params on mount", () => {
    window.location.search = "?sortColumn=convertedPrice&sortOrder=desc";
    render(<SortPosts posts={posts} />);
    const links = getLinks();
    // descending convertedPrice: 22 (Lamb Paris), 15 (Beef Edinburgh), 10 (Beef London)
    expect(links[0]).toHaveTextContent("Lamb Paris");
    expect(links[2]).toHaveTextContent("Beef London");
  });

  it("updates URL when a filter changes", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /meat/i }), "Lamb");
    await waitFor(() => {
      expect(history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        expect.stringContaining("meat=Lamb")
      );
    });
  });

  it("clears URL params when all filters are cleared", async () => {
    window.location.search = "?meat=Beef";
    render(<SortPosts posts={posts} />);
    await userEvent.click(screen.getByRole("button", { name: /clear all filters/i }));
    await waitFor(() => {
      const lastCall = vi.mocked(history.replaceState).mock.calls.at(-1);
      expect(lastCall?.[2]).toBe(window.location.pathname);
    });
  });

  it("renders a copy link button", () => {
    render(<SortPosts posts={posts} />);
    expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
  });

  it("shows confirmation text after copy link is clicked", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<SortPosts posts={posts} />);
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));
    expect(screen.getByRole("button", { name: /link copied/i })).toBeInTheDocument();
  });

  it("announces copy confirmation in a status live region", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<SortPosts posts={posts} />);
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Link copied!");
  });
});
