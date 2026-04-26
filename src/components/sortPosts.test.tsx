import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
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

describe("SortPosts filtering", () => {
  it("renders all posts by default sorted by rating ascending", () => {
    render(<SortPosts posts={posts} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    // ascending rating: 6 (Lamb Paris), 8 (Beef London), 9 (Beef Edinburgh)
    expect(within(items[0]).getByRole("link")).toHaveTextContent("Lamb Paris");
    expect(within(items[1]).getByRole("link")).toHaveTextContent("Beef London");
    expect(within(items[2]).getByRole("link")).toHaveTextContent(
      "Beef Edinburgh"
    );
  });

  it("filters by meat type", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /filter by meat/i }),
      "Beef"
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(
      items.every((li) =>
        within(li).getByRole("link").textContent?.includes("Beef")
      )
    ).toBe(true);
  });

  it("filters by country", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /filter by country/i }),
      "France"
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByRole("link")).toHaveTextContent("Lamb Paris");
  });

  it("filters by minimum rating", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.type(
      screen.getByRole("spinbutton", { name: /minimum/i }),
      "8"
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    // rating >= 8: Beef London (8) and Beef Edinburgh (9)
    const links = items.map((li) => within(li).getByRole("link").textContent);
    expect(links).toContain("Beef London");
    expect(links).toContain("Beef Edinburgh");
  });

  it("filters by maximum converted price", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.type(
      screen.getByRole("spinbutton", { name: /maximum/i }),
      "15"
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    // convertedPrice <= 15: Beef London (10) and Beef Edinburgh (15)
    const links = items.map((li) => within(li).getByRole("link").textContent);
    expect(links).toContain("Beef London");
    expect(links).toContain("Beef Edinburgh");
  });

  it("clears all filters to restore full list", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /filter by meat/i }),
      "Beef"
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    await userEvent.click(
      screen.getByRole("button", { name: /clear all filters/i })
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});

describe("SortPosts sorting", () => {
  it("toggles sort order from ascending to descending", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.click(
      screen.getByRole("button", { name: /sort descending/i })
    );
    const items = screen.getAllByRole("listitem");
    // descending rating: 9 (Beef Edinburgh), 8 (Beef London), 6 (Lamb Paris)
    expect(within(items[0]).getByRole("link")).toHaveTextContent(
      "Beef Edinburgh"
    );
    expect(within(items[2]).getByRole("link")).toHaveTextContent("Lamb Paris");
  });

  it("sorts by convertedPrice ascending", async () => {
    render(<SortPosts posts={posts} />);
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /sort by/i }),
      "convertedPrice"
    );
    const items = screen.getAllByRole("listitem");
    // ascending convertedPrice: 10, 15, 22
    expect(within(items[0]).getByRole("link")).toHaveTextContent("Beef London");
    expect(within(items[1]).getByRole("link")).toHaveTextContent(
      "Beef Edinburgh"
    );
    expect(within(items[2]).getByRole("link")).toHaveTextContent("Lamb Paris");
  });
});
