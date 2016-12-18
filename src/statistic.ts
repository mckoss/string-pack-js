export class Statistic {
  count = 0;
  sum = 0;
  sumSquares = 0;
  histogram: number[] = [];

  min: number;
  max: number;

  // Define an infite collection of histogram buckets based on this sequence of
  // break points. Each number defined the low end of the range of a bucket. We
  // extrapolate an infinite number of buckets based on the difference of the
  // last two listed.
  constructor(private buckets?: number[]) {
  }

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

    if (!this.buckets || this.buckets.length === 0) {
      return;
    }

    let i = 0;
    let delta = 1;
    let base = this.buckets[0];
    let next: number;
    while (true) {
      if (this.histogram[i] === undefined) {
        this.histogram[i] = 0;
      }
      if (i + 1 < this.buckets.length) {
        next = this.buckets[i + 1];
        delta = next - base;
      } else {
        next = base + delta;
      }
      if (x >= base && x < next) {
        break;
      }
      i += 1;
      base = next;
    }

    this.histogram[i] += 1;
  }
}
