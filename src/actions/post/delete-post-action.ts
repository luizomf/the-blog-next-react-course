'use server';

import { asyncDelay } from '@/utils/async-delay';
import { logColor } from '@/utils/log-color';

export async function deletePostAction(id: string) {
  await asyncDelay(2000);
  logColor('' + id);
  return id;
}
