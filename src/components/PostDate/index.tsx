import { formatDatetime, formatDistanceToNow } from '@/utils/format-datetime';

type PostDateProps = {
  dateTime: string;
};

export function PostDate({ dateTime }: PostDateProps) {
  return (
    <time
      className='text-slate-600 text-sm/tight'
      dateTime={dateTime}
      title={formatDistanceToNow(dateTime)}
    >
      {formatDatetime(dateTime)}
    </time>
  );
}
