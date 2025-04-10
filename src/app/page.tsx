import { SpinLoader } from '@/components/SpinLoader';
import clsx from 'clsx';

export default async function HomePage() {
  return (
    <div>
      <SpinLoader containerClasses={clsx('min-h-[500px]', 'bg-amber-500')} />
    </div>
  );
}
