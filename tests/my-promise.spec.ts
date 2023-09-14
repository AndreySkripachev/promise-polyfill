import { MyPromise } from '../src/my-promise';
import { PromiseExecutor } from '../src/types/promise';

function expectPromiseBehavior<T = unknown>(
  executor: PromiseExecutor<T>,
): void {
  const promise = new Promise(executor);
  const myPromise = new MyPromise(executor);

  Promise.all([promise, myPromise])
    .then(([expected, actual]) => expect(actual).toEqual(expected));
}

it('should fulfils if came a value', () => {
  expectPromiseBehavior(resolve => {
    setTimeout(resolve, 10);
  });
})

it('should returns only one value', () => {
  expectPromiseBehavior(resolve => {
    resolve(1);
    resolve(2);
  })
})

it('should pass the value through the chain of `then`', async() => {
  const result = await new MyPromise<number>(res => {
    setTimeout(() => {
      res(10)
    }, 10);
  })
    .then(val => val * 2)
    .then(val => val - 1);

  expect(result).toEqual(10 * 2 - 1);
});
