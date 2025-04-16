export class ArrayExtended {
  static getRandomArray = (array: any[]) =>
    array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);

  static reorder = (
    list: Iterable<unknown> | ArrayLike<unknown>,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  static getArrayNumberComplexity = (arr: any[]) => {
    let validity = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] - 1 !== i) {
        validity++;
      }
    }
    return validity;
  };

  static arrayEquals = (a: any[], b: string | any[]) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);

  // https://www.geeksforgeeks.org/minimum-operations-required-to-sort-the-array/
  static getMinimumOperationsToSortArray(arr: number[]): number {
    // Gather distinct values’ min/max positions
    const posMap = new Map<number, { minPos: number; maxPos: number }>();
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (!posMap.has(val)) {
        posMap.set(val, { minPos: i, maxPos: i });
      } else {
        posMap.get(val)!.maxPos = i;
      }
    }

    // Convert to an array of (val, minPos, maxPos)
    const intervals = Array.from(posMap.entries()).map(([val, range]) => ({
      val,
      minPos: range.minPos,
      maxPos: range.maxPos,
    }));

    // Sort by numeric value ascending
    intervals.sort((a, b) => a.val - b.val);

    // We want the length of the longest chain:
    //   intervals[i].maxPos < intervals[j].minPos
    //   for i < j
    const n = intervals.length;
    const dp = new Array(n).fill(1);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        // If we can chain j -> i, update dp[i]
        if (
          intervals[j].val < intervals[i].val &&
          intervals[j].maxPos < intervals[i].minPos
        ) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
    }

    // Longest chain of distinct values
    const maxChain = Math.max(...dp);

    // Return how many distinct values must be removed
    return n - maxChain;
  }

  static getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

/*
    const max = scores.reduce(function(prev, current) {
        return (prev && prev.value > current.value) ? prev : current
    })

    const min = scores.reduce(function(prev, current) {
        return (prev && prev.value < current.value) ? prev : current
    })

    const ranking = scores.reduce(function(prev, current) {
        return (prev && prev.value < score && score > current.value) ? current : prev
    })
*/
