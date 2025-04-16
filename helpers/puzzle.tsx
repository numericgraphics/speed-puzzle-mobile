import { PuzzlePieceType } from "@/types";
import { ArrayExtended } from "@/utils/array";

const PuzzlePieces = {
  checkPuzzleOrder(array: PuzzlePieceType[]): boolean {
    const test = array.map((item) => {
      return item.index;
    });
    return ArrayExtended.arrayEquals(test, [0, 1, 2, 3]);
  },

  checkPuzzleOrderMobile(positions: Record<string, any>): boolean {
    "worklet";
    return Object.entries(positions).every(([key, value]) => {
      return key === value.toString();
    });
  },

  checkPuzzleComplexity(array: PuzzlePieceType[]) {
    const test = array.map((item) => {
      return item.index;
    });
    console.log("checkPuzzleComplexity test array", test.toString());
    const result = ArrayExtended.getMinimumOperationsToSortArray(test);
    console.log("checkPuzzleComplexity result", result);
    return result;
  },

  getInitialItemArray(count: number): PuzzlePieceType[] {
    return Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `item-${k}`,
      index: k,
      content: `item ${k}`,
    }));
  },

  async recursiveRandomArray(
    items: PuzzlePieceType[]
  ): Promise<PuzzlePieceType[]> {
    const randomArray = ArrayExtended.getRandomArray(
      items
    ) as PuzzlePieceType[];
    if (PuzzlePieces.checkPuzzleOrder(randomArray)) {
      return await PuzzlePieces.recursiveRandomArray(items);
    }
    return randomArray;
  },

  async getPuzzlePieces(num: number) {
    return PuzzlePieces.recursiveRandomArray(
      PuzzlePieces.getInitialItemArray(num)
    );
  },
};

export default PuzzlePieces;
