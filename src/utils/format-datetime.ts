import {
  format,
  formatDistanceToNow as dateFnsFormatDistanceToNow,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export function formatDatetime(rawDate: string): string {
  const date = new Date(rawDate);

  return format(date, "dd/MM/yyyy 'às' HH'h'mm", {
    locale: ptBR,
  });
}

export function formatDistanceToNow(rawDate: string): string {
  const date = new Date(rawDate);

  return dateFnsFormatDistanceToNow(date, {
    locale: ptBR,
    addSuffix: true,
  });
}

export function formatHour(timestampMs: number): string {
  const date = new Date(timestampMs);

  return format(date, 'HH:mm:ss', {
    locale: ptBR,
  });
}

export async function formatHourCached() {
  'use cache';
  cacheLife('seconds');
  cacheTag('formatHourCached');

  return formatHour(Date.now());
}
