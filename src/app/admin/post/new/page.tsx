import { InputText } from '@/components/InputText';

export const dynamic = 'force-dynamic';

export default async function AdminPostNewPage() {
  return (
    <div className='flex flex-col gap-6'>
      <InputText
        labelText='Nome'
        placeholder='Digite seu nome'
        type='password'
      />
      <InputText labelText='Sobrenome' placeholder='Digite seu sobrenome' />
      <InputText
        disabled
        labelText='Sobrenome'
        placeholder='Digite seu sobrenome'
        defaultValue='Olá mundo'
      />
      <InputText
        disabled
        labelText='Sobrenome'
        placeholder='Digite seu sobrenome'
      />
      <InputText
        labelText='Sobrenome'
        placeholder='Digite seu sobrenome'
        readOnly
      />
      <InputText
        labelText='Sobrenome'
        placeholder='Digite seu sobrenome'
        defaultValue='Olá mundo'
        readOnly
      />
    </div>
  );
}
