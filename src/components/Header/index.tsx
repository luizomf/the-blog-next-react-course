'use client';

import clsx from 'clsx';

export function Header() {
  console.log('HEADER');

  return (
    <h1
      className={clsx(
        'text-6xl',
        'font-bold',
        'text-blue-500',
        'hover:text-blue-50',
        'hover:bg-blue-500',
        'transition',
        'duration-1000',
      )}
      onClick={() => alert(123)}
    >
      Texto no meu h1
    </h1>
  );
}
