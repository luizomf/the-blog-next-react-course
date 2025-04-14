import { revalidateExampleAction } from '@/actions/revalidate-example';
import { formatHourCached } from '@/utils/format-datetime';

// export const dynamic = 'force-static';
// export const revalidate = 30;

export default async function ExemploDynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hour = await formatHourCached();

  return (
    <main className='min-h-[600px] text-4xl font-bold'>
      <div>
        Hora: {hour} | (ID: {id})
      </div>

      <form className='py-16' action={revalidateExampleAction}>
        <input type='hidden' name='path' defaultValue={`/exemplo/${id}`} />

        <button
          className='bg-amber-500 text-white p-2 rounded hover:bg-amber-600 transition cursor-pointer'
          type='submit'
        >
          REVALIDATE
        </button>
      </form>
    </main>
  );
}
