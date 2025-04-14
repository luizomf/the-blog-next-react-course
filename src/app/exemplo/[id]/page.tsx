import { formatHour } from '@/utils/format-datetime';

export default async function ExemploDynamicPage() {
  const hour = formatHour(Date.now());

  return (
    <main className='min-h-[600px] text-4xl font-bold'>
      <div>Hora: {hour}</div>
    </main>
  );
}
