import { PostModel } from '@/models/post/post-model';
import { PostRepository } from './post-repository';

const ROOT_DIR = process.cwd();

export class JsonPostRepository implements PostRepository {
  private async readFromDisk() {}

  async findAll(): Promise<PostModel[]> {}
}

export const postRepository = new JsonPostRepository();

console.log(ROOT_DIR);
