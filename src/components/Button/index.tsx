type ButtonProps = {} & React.ComponentProps<'button'>;

export function Button({ ...props }: ButtonProps) {
  return <button {...props} />;
}
