// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

interface Range {
  index: number;
  first: number;
  next: number;
}

export class Statistic {
  count = 0;
  sum = 0;
  sumSquares = 0;
  histogram: number[] = [];
  buckets: number[] = [];

  min: number;
  max: number;

  // Define an infite collection of histogram buckets based on this sequence of
  // break points. Each number defined the low end of the range of a bucket. We
  // extrapolate an infinite number of buckets based on the difference of the
  // last two listed.
  constructor(buckets?: number[]) {
    if (buckets) {
      this.buckets = buckets;
    }
  }

  get average(): number | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.sum / this.count;
  }

  private get hasBuckets(): boolean {
    return this.buckets.length > 0;
  }

  rangesIterator(): () => Range {
    let i = 0;
    let delta = 1;
    let base = this.buckets[0];
    let next: number;

    return () => {
      if (i + 1 < this.buckets.length) {
        next = this.buckets[i + 1];
        delta = next - base;
      } else {
        next = base + delta;
      }
      let value = {
        index: i,
        first: base,
        next
      };
      i += 1;
      base = next;
      return value;
    };
  }

  sample(x: number) {
    this.sum += x;
    this.sumSquares += x * x;
    this.count += 1;

    if (!this.hasBuckets) {
      return;
    }

    let next = this.rangesIterator();
    let range: Range;
    while (true) {
      range = next();
      if (this.histogram[range.index] === undefined) {
        this.histogram[range.index] = 0;
      }
      if (x >= range.first && x < range.next) {
        break;
      }
    }

    this.histogram[range.index] += 1;
  }

  histogramReport(): string {
    if (!this.hasBuckets) {
      throw new Error("No histogram data collected.");
    }

    let results: string[] = [];

    let next = this.rangesIterator();
    let range: Range;
    while (true) {
      range = next();
      if (!this.histogram[range.index]) {
        break;
      }
      results.push(`[${range.first}...${range.next}): ` +
                   `${this.histogram[range.index]}`);
    }
    results.push(`All Total: ${this.sum} (from ${this.count} entries).`);

    return results.join('\n');
  }
}
