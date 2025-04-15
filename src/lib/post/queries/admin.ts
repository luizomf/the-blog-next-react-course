import { postRepository } from '@/repositories/post';
import { cache } from 'react';

export const findPostByIdAdmin = cache(async (id: string) => {
  return postRepository.findById(id);
});

export const findAllPostAdmin = cache(async () => {
  return postRepository.findAll();
});
