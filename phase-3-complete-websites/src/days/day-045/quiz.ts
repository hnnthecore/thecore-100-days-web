/** Day 045 · Lingua Lane · placement-test questions: six per language, easiest first. `a` is the index of the correct option. */
export interface Q { q: string; opts: string[]; a: number }

export const QUIZ: Record<string, { label: string; hello: string; qs: Q[] }> = {
  spanish: { label: 'Spanish', hello: 'Hola', qs: [
    { q: '¿Cómo ___ llamas?', opts: ['me', 'te', 'se', 'le'], a: 1 },
    { q: 'Ayer ___ al cine con mis amigos.', opts: ['voy', 'iré', 'fui', 'iba a'], a: 2 },
    { q: 'Mi hermana ___ más alta que yo.', opts: ['es', 'está', 'tiene', 'hay'], a: 0 },
    { q: 'Si tuviera dinero, ___ un coche nuevo.', opts: ['compré', 'compraré', 'compro', 'compraría'], a: 3 },
    { q: 'Me alegro de que ___ venido.', opts: ['has', 'hayas', 'habías', 'hubiste'], a: 1 },
    { q: 'Habría ido a la fiesta si me ___ avisado.', opts: ['habían', 'han', 'hubieran', 'hayan'], a: 2 },
  ] },
  french: { label: 'French', hello: 'Bonjour', qs: [
    { q: 'Je ___ étudiant.', opts: ['es', 'est', 'êtes', 'suis'], a: 3 },
    { q: 'Hier, nous ___ au restaurant.', opts: ['allons', 'sommes allés', 'irons', 'allions'], a: 1 },
    { q: 'Elle habite ___ Paris depuis 2020.', opts: ['à', 'en', 'sur', 'chez'], a: 0 },
    { q: 'Il faut que tu ___ patient.', opts: ['es', 'seras', 'sois', 'étais'], a: 2 },
    { q: 'Si j’avais su, je ___ venu.', opts: ['suis', 'serais', 'étais', 'serai'], a: 1 },
    { q: 'Le livre ___ je t’ai parlé est ici.', opts: ['que', 'qui', 'où', 'dont'], a: 3 },
  ] },
  german: { label: 'German', hello: 'Hallo', qs: [
    { q: 'Ich ___ aus Spanien.', opts: ['kommst', 'kommt', 'komme', 'kommen'], a: 2 },
    { q: 'Gestern ___ wir ins Kino gegangen.', opts: ['haben', 'sind', 'werden', 'hatten'], a: 1 },
    { q: 'Das ist der Mann, ___ ich gestern gesehen habe.', opts: ['der', 'dem', 'den', 'dessen'], a: 2 },
    { q: 'Ich warte ___ den Bus.', opts: ['für', 'auf', 'an', 'bei'], a: 1 },
    { q: 'Wenn ich Zeit ___, würde ich kommen.', opts: ['habe', 'hatte', 'haben', 'hätte'], a: 3 },
    { q: 'Er tat, als ___ er krank.', opts: ['wenn', 'dass', 'ob', 'weil'], a: 2 },
  ] },
};

/** Six questions map to the four common CEFR levels. */
export function levelFor(score: number): { level: string; name: string } {
  if (score <= 1) return { level: 'A1', name: 'Beginner' };
  if (score <= 3) return { level: 'A2', name: 'Elementary' };
  if (score <= 5) return { level: 'B1', name: 'Intermediate' };
  return { level: 'B2', name: 'Upper-intermediate' };
}
