import clsx from 'clsx';

export function Header() {
  return (
    <header>
      <h1
        className={clsx(
          'text-4xl/normal font-extrabold py-8',
          'sm:text-5xl/normal sm:py-10',
          'md:text-6xl/normal md:py-11',
          'lg:text-7xl/normal lg:py-12',
        )}
      >
        <a href='#'>The Blog</a>
      </h1>
    </header>
  );
}
