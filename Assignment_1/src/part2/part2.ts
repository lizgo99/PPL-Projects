import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */

export const countLetters = (str: string) =>
  R.pipe(
    stringToArray,
    R.filter((char: string) => char !== " "),
    R.map(R.toLower),
    R.countBy((char: string) => char)
  )(str);


/* Question 2 */

const checkParenthesis = (parenStack: string[], char: string): string[] => 
((char === "}" && R.head(parenStack) === "{") || (char === ")" && R.head(parenStack) === "(") || (char === "]" && R.head(parenStack) === "[")) ? R.tail(parenStack) : 
    R.prepend(char, parenStack);

export const isPaired = (str: string) =>
R.pipe(
    stringToArray,
    R.filter((char: string) => char === "{" || char === "}" || char === "(" || char === ")" || char === "[" || char === "]"),
    R.reduce(checkParenthesis , []),
    R.isEmpty
)(str);

/* Question 3 */
export type WordTree = {
  root: string;
  children: WordTree[];
}

export const treeToSentence = (tree: WordTree): string =>
  [tree.root, ...tree.children.map(treeToSentence)].join(" ");
