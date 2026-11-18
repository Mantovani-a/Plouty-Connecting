import { getStorageItem } from './storage.js';

export const LOCAL_SOCIAL_POSTS_KEY = 'plouty.demo.social-posts.v1';

export function readLocalPosts() {
  const stored = getStorageItem(LOCAL_SOCIAL_POSTS_KEY, []);
  if (!Array.isArray(stored)) return [];

  // Publicações anteriores à página de perfil guardavam uma cópia do autor.
  return stored.map((post) => {
    const authorId = post.authorId || (post.author?.type === 'institution' ? 'escola-caminhos' : 'joao-carlos');
    const { author, postImage, image, ...content } = post;
    const media = postImage || image;
    const hasPersonalImage = typeof media?.src === 'string'
      && media.src.length > 0
      && !media.src.startsWith('/images/social/posts/');
    return { ...content, authorId, ...(hasPersonalImage ? { postImage: media } : {}) };
  });
}
