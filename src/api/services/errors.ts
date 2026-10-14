export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null && 'status' in err) {
    const { status } = err as { status: unknown };
    if (status === 'FETCH_ERROR') return 'Не удалось связаться с GREEN-API (сеть или CORS)';
    if (status === 401 || status === 403) return 'Неверные idInstance или apiTokenInstance';
    if (status === 429) return 'Слишком много запросов, попробуйте позже';
  }
  return 'Что-то пошло не так, попробуйте ещё раз';
}