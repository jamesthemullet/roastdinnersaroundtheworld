const ALL_SLUGS_QUERY = `
  query AllSlugs {
    posts {
      nodes {
        slug
      }
    }
  }
`;

export default ALL_SLUGS_QUERY;
