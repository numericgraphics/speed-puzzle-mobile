export class MathExtended {
  static getRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };
}

export const getRandomBoolean = (): boolean => Math.random() >= 0.5;
