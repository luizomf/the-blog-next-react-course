import clsx from 'clsx';

type SpinLoaderProps = {
  containerClasses?: string;
};

export function SpinLoader({ containerClasses = '' }: SpinLoaderProps) {
  const classes = clsx(
    'flex',
    'items-center',
    'justify-center',
    containerClasses,
  );

  return (
    <div className={classes}>
      <div
        className={clsx(
          'w-10 h-10',
          'border-5 border-t-transparent border-slate-900',
          'rounded-full',
          'animate-spin',
        )}
      ></div>
    </div>
  );
}
