export function mockSendPromise(): Promise<
  {
    image: string;
    pieces: string[];
    complexity: number;
    isVertical: boolean;
  }[]
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          image: "Mock Image URL",
          pieces: ["piece1", "piece2", "piece3"],
          complexity: 3,
          isVertical: true,
        },
      ]);
    }, 2000);
  });
}
