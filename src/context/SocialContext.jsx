import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socialFeedPosts } from '../data/socialFeedData';
import { readLocalPosts } from '../utils/localPosts';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useNotifications } from './NotificationsContext';

const SocialContext = createContext(null);
const KEY = 'plouty.demo.social.v2';

function readSocial() {
  const stored = getStorageItem(KEY, null);
  if (stored && typeof stored === 'object' && Array.isArray(stored.created)) {
    return { created: stored.created, edited: stored.edited || {}, deleted: stored.deleted || [],
      likes: stored.likes || {}, reposts: stored.reposts || {}, comments: stored.comments || {}, shares: stored.shares || {} };
  }
  return { created: readLocalPosts(), edited: {}, deleted: [], likes: {}, reposts: {}, comments: {}, shares: {} };
}

export function SocialProvider({ children }) {
  const [data, setData] = useState(readSocial);
  const { notify } = useNotifications();
  useEffect(() => {
    const sync = (event) => { if (event.key === KEY) setData(readSocial()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const posts = useMemo(() => [...data.created, ...socialFeedPosts]
    .filter((post) => !data.deleted.includes(post.id))
    .map((post) => data.edited[post.id] ? { ...post, text: data.edited[post.id] } : post)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)), [data]);

  const update = (makeNext) => {
    const next = makeNext(data);
    if (next === data) return { changed: false, saved: true };
    setData(next);
    return { changed: true, saved: setStorageItem(KEY, next) };
  };
  const exists = (id) => posts.some((post) => post.id === id);
  const createPost = (authorId, text, image) => update((current) => ({ ...current, created: [{
    id: `local-post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, authorId,
    publishedAt: new Date().toISOString(), text: text.trim(), postImage: image,
    reactionCount: 0, commentCount: 0, repostCount: 0, comments: [], isLocal: true
  }, ...current.created] }));
  const editPost = (id, actorId, text) => update((current) => {
    const post = posts.find((item) => item.id === id);
    if (!post || post.authorId !== actorId || (!text.trim() && !post.postImage?.src)) return current;
    return { ...current, edited: { ...current.edited, [id]: text.trim() } };
  });
  const deletePost = (id, actorId) => update((current) => {
    const post = posts.find((item) => item.id === id);
    if (!post || post.authorId !== actorId) return current;
    return { ...current, deleted: [...current.deleted, id] };
  });
  const toggle = (field, id, actorId) => {
    const wasActive = (data[field][id] || []).includes(actorId);
    const result = update((current) => {
      if (!exists(id) || !actorId) return current;
      const actors = current[field][id] || [];
      return { ...current, [field]: { ...current[field], [id]: actors.includes(actorId)
        ? actors.filter((value) => value !== actorId) : [...actors, actorId] } };
    });
    if (result.changed && field === 'likes' && !wasActive) {
      notify(posts.find((post) => post.id === id)?.authorId, 'like', { actorId, postId: id });
    }
    return result;
  };
  const addComment = (id, actorId, text) => {
    const result = update((current) => {
      if (!exists(id) || !actorId || !text.trim()) return current;
      const comment = { id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        authorId: actorId, text: text.trim(), time: 'agora mesmo' };
      return { ...current, comments: { ...current.comments, [id]: [...(current.comments[id] || []), comment] } };
    });
    if (result.changed) notify(posts.find((post) => post.id === id)?.authorId, 'comment',
      { actorId, postId: id, preview: text.trim().slice(0, 120) });
    return result;
  };
  const recordShare = (id, actorId) => update((current) => {
    if (!exists(id) || !actorId || (current.shares[id] || []).includes(actorId)) return current;
    return { ...current, shares: { ...current.shares, [id]: [...(current.shares[id] || []), actorId] } };
  });

  return <SocialContext.Provider value={{ posts, data, createPost, editPost, deletePost,
    toggleLike: (id, actorId) => toggle('likes', id, actorId),
    toggleRepost: (id, actorId) => toggle('reposts', id, actorId), addComment, recordShare }}>
    {children}
  </SocialContext.Provider>;
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within SocialProvider');
  return context;
}
