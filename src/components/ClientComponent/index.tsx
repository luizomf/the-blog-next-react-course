'use client'; // <- Se espalha para todos os componentes que eu importar aqui

export function ClientComponent({ children }: { children: React.ReactNode }) {
  console.log('ClientComponent');
  return <div>ClientComponent {children}</div>;
}
