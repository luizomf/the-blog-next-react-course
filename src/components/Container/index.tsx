type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className='text-slate-900 bg-slate-100 min-h-screen'>
      <div className='max-w-screen-lg mx-auto px-8'>{children}</div>
    </div>
  );
}
