const HOME_PAGE_POSTS_QUERY = `
  query GetHomePagePosts {
    posts(first: 14) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            mediaDetails {
              sizes {
                sourceUrl
                name
              }
            }
          }
        }
      }
    }
  }
`;

export default HOME_PAGE_POSTS_QUERY;
