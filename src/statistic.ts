export class Statistic {
  count = 0;
  sum = 0;
  sumSquares = 0;

  min: number;
  max: number;

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
