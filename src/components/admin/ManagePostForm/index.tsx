'use client';

import { Button } from '@/components/Button';
import { InputCheckbox } from '@/components/InputCheckbox';
import { InputText } from '@/components/InputText';

export function ManagePostForm() {
  return (
    <form action='' className='mb-16'>
      <div className='flex flex-col gap-6'>
        <InputText
          labelText='Nome'
          placeholder='Digite seu nome'
          type='password'
        />
        <InputText labelText='Sobrenome' placeholder='Digite seu sobrenome' />

        <InputCheckbox labelText='Sobrenome' />

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

        <div className='mt-4'>
          <Button type='submit'>Enviar</Button>
        </div>
      </div>
    </form>
  );
}
