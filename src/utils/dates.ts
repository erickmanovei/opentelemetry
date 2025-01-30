import { addHours, format } from 'date-fns';

// eslint-disable-next-line import/prefer-default-export
export const writeDate = (data: Date): string => {
  return data.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDate = (date: Date | string): string =>
  format(addHours(typeof date === 'string' ? new Date(date) : date, 4), 'yyyy-MM-dd');

export const getDateTime = (date: Date): string =>
  addHours(date, 4).toISOString();
