import { PromiseExecutor } from './types/promise';
import { runWithErrorHandler } from './utils/run-with-error-handler';

/** Represents the completion of an asynchronous operation */
export class MyPromise<T = unknown> {

  private latestValue!: T;
  private hasValue = false;

  private error: any;
  private hasError = false

  private waiters: ((value: T) => void)[] = [];

  public constructor(executor: PromiseExecutor<T>) {
    this.resolver = this.resolver.bind(this);
    this.rejector = this.rejector.bind(this);
    this.handleError = this.handleError.bind(this);

    setTimeout(() => {
      runWithErrorHandler(() => {
        executor(this.resolver, this.rejector)
      }, this.handleError)
    });
  }

  private resolver(value: T): void {
    if (!this.hasValue) {
      this.latestValue ??= value;
      this.hasValue = true;
      this.emitIfValueFulfiledOrRejected();
    }
  }

  private rejector(reason?: any): void {
    this.handleError(reason ?? new Error())
    throw reason ?? new Error()
  }

  private addWaiter(waiter: (value: T) => void): void {
    this.waiters.push(waiter);
    this.emitIfValueFulfiledOrRejected();
  }

  private emitIfValueFulfiledOrRejected(): void {
    if (this.hasValue || this.hasError) {
      this.waiters.forEach(e => e(this.latestValue));
      this.waiters = [];
    }
  }

  private handleError(error: any): void {
    if (!this.hasError) {
      this.error ??= error;
      this.hasError = true;
      this.emitIfValueFulfiledOrRejected()
    }
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   */
  public then<R>(onfulfilled: (value: T) => R): MyPromise<R> {
    return new MyPromise((resolve, reject) => {
      this.addWaiter((val) => {
        runWithErrorHandler(() => {
          if (this.hasError) {
            reject(this.error)
          } else {
            resolve(onfulfilled(val))
          }
        }, reject);
      });
    });
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected — The callback to execute when the Promise is rejected.
   */
  public catch<R>(onrejected: (reason?: any) => R | T): MyPromise<R | T> {
    return new MyPromise((resolve, reject) => {
      this.addWaiter((val) => {
        runWithErrorHandler(() => {
          if (this.hasError) {
            resolve(onrejected(this.error))
          } else {
            resolve(val);
          }
        }, reject)
      })
    });
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected).
   * The resolved value cannot be modified from the callback.
   *
   * @param onfinally — The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns
   */
  public finally(onfinally?: () => void): MyPromise<void> {
    return new MyPromise((resolve, reject) => {
      this.addWaiter(() => {
        runWithErrorHandler(() => {
          onfinally?.();
          resolve(void 0);
        }, reject);
      })
    });
  }
}
