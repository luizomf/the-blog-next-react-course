'use server';

import { asyncDelay } from '@/utils/async-delay';

export async function logoutAction() {
  await asyncDelay(5000); // Vou manter
}
