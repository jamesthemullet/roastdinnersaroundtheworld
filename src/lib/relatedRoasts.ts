export interface RoastPost {
  slug: string;
  title: string;
  customfields: {
    country: string;
  };
}

export function findRelatedRoasts(currentPost: RoastPost, allPosts: RoastPost[]): RoastPost[] {
  return allPosts.filter(
    (post) =>
      post.slug !== currentPost.slug &&
      post.customfields.country === currentPost.customfields.country
  );
}
