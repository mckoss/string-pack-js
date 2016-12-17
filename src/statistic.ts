export class Statistic {
  count = 0;
  min: number;
  max: number;

  private sum = 0;
  private sumSquares = 0;

  get average(): number | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.sum / this.count;
  }

  sample(x: number) {
    this.sum += x;
    this.sumSquares += x * x;
    this.count += 1;
  }
}
