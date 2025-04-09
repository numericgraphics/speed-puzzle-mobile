import { PuzzlePieceType } from '@/types'
import { ArrayExtended } from '@/utils/array'

const PuzzlePieces = {
  checkPuzzleOrder(array: PuzzlePieceType[]): boolean {
    const test = array.map((item) => {
      return item.index
    })
    return ArrayExtended.arrayEquals(test, [0, 1, 2, 3])
  },

  checkPuzzleComplexity(array: any[]) {
    const test = array.map((item: { index: any }) => {
      return item.index + 1
    })
    console.log('checkPuzzleComplexity', test)
    const result = ArrayExtended.getMinimumOperationsToSortArray(test)
    console.log('checkPuzzleComplexity result', result)
    return result
  },

  getInitialItemArray(count: number): PuzzlePieceType[] {
    return Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `item-${k}`,
      index: k,
      content: `item ${k}`,
    }))
  },

  async recursiveRandomArray(
    items: PuzzlePieceType[]
  ): Promise<PuzzlePieceType[]> {
    const randomArray = ArrayExtended.getRandomArray(items) as PuzzlePieceType[]
    console.log('recursiveRandomArray')
    if (PuzzlePieces.checkPuzzleOrder(randomArray)) {
      return await PuzzlePieces.recursiveRandomArray(items)
    }
    return randomArray
  },

  async getPuzzlePieces(num: number) {
    console.log('getPuzzlePieces', num)
    return PuzzlePieces.recursiveRandomArray(
      PuzzlePieces.getInitialItemArray(num)
    )
  },
}

export default PuzzlePieces
