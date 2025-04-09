export class ArrayExtended {
  static getRandomArray = (array: any[]) =>
    array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1])

  static reorder = (
    list: Iterable<unknown> | ArrayLike<unknown>,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  static getArrayNumberComplexity = (arr: any[]) => {
    let validity = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] - 1 !== i) {
        validity++
      }
    }
    return validity
  }

  static arrayEquals = (a: any[], b: string | any[]) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])

  // https://www.geeksforgeeks.org/minimum-operations-required-to-sort-the-array/
  static getMinimumOperationsToSortArray(arr: any[]) {
    let mpp = new Map()
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i]
      if (mpp.has(val)) {
        mpp.get(val).push(i)
      } else {
        mpp.set(val, [i])
      }
    }

    let q = []
    let st = new Set()

    let count = 0
    for (let i = 0; i < arr.length - 1; i++) {
      if (!st.has(arr[i]) && arr[i] !== 0) {
        q.push(arr[i])
        st.add(arr[i])
      }

      if (arr[i] > arr[i + 1]) {
        count += q.length
        while (q.length > 0) {
          let top = q.shift()

          if (mpp.has(top)) {
            let idx = mpp.get(top)
            for (let i = 0; i < idx.length; i++) {
              arr[idx[i]] = 0
            }
          }
        }
      }
    }

    return Math.abs(count)
  }

  static getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)]
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
