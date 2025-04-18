'use server';

type CreatePostActionState = {
  numero: number;
};

export async function createPostAction(
  prevState: CreatePostActionState,
): Promise<CreatePostActionState> {
  console.log({ prevState });

  return {
    numero: prevState.numero + 1,
  };
}
