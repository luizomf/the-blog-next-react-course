import { MenuAdmin } from '@/components/admin/MenuAdmin';

type AdminPostLayoutProps = {
  children: React.ReactNode;
};

export default function AdminPostLayout({
  children,
}: Readonly<AdminPostLayoutProps>) {
  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
