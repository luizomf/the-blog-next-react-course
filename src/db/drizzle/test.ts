import { drizzleDb } from '.';
import { postsTable } from './schemas';

(async () => {
  const posts = await drizzleDb.select().from(postsTable);

  console.log(posts);
})();
