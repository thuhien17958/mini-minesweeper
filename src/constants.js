export const INFO = {
  beginner: {
    size: 9,
    mines: 10,
  },
  advantage: {
    size: 16,
    mines: 40,
  },
};

export const DIRECTTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const SQUARE_TYPES = {
  BLANK: "blank",
  BOMBREVEALED: "bombrevealed",
  BOMBDEATH: "bombdeath",
  BOMDFLAGGED: "bombflagged",
};

export const GAME_STATE = {
  INIT: "init",
  INGAME: "ingame",
  GAMEOVER: "gameover",
};

export const URL = "https://tiki-minesweeper.herokuapp.com/getMines";
