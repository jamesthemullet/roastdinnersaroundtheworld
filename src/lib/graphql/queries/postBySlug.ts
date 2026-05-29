const POST_BY_SLUG_QUERY = `
  query PostBySlug($id: ID!) {
    post(idType: SLUG, id: $id) {
      date
      content
      title
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
      customfields {
        country
        rating
      }
      seo {
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

export default POST_BY_SLUG_QUERY;
