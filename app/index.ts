import { MyPromise } from '../src/my-promise';

const promise = new MyPromise<number>((res, rej) => {
  setTimeout(() => {
    res(500)
  }, 1000);
})

console.log('Executes before promise')

promise.then(v => {
  console.log('Receive value:', v);
  return v + 1;
}).then(v => {
  console.log('Value increased by 1:', v);
  throw 'Error 123';
}).then(v => {
  console.log('~Skipped because error~');
}).catch(err => {
  console.log('Catch error:', err);
  return 123;
}).then(v => {
  console.log('Value after catch:', v);
}).finally(() => { console.log('Finally') })

console.log('Also executes before promise')
