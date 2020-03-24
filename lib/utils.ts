import { words, reduce, join } from "lodash";

// eslint-disable-next-line import/prefer-default-export
export const wordWrap = (str = "", lineLength: number) => {
  return join(
    reduce<string, string[]>(
      words(str, /([A-Za-z0-9'.!?"]?)+\S/g),
      (acc, word) => {
        const [last] = acc.slice(-1);
        const initial = acc.slice(0, -1);

        if (!last) {
          return acc.concat(word);
        }

        if (last.length + word.length < lineLength) {
          return initial.concat(`${last} ${word}`);
        }

        return initial.concat(`${last}\n`, word);
      },
      []
    ),
    ""
  );
};
