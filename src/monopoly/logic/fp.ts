
export type Fn<A,B> = (arg:A) => B;

export type EndoFn<A> = (arg:A) => A;

export const pipe = <A,B>(...fns: Array<Fn<any,any>>) =>
  (initValue: A) => fns.reduce( (value,fn) => fn(value), initValue ) as unknown as B;

export const endoPipe = <A>(...fns: Array<EndoFn<A>>) =>
  (initValue: A) => pipe( ...fns )(initValue) as A;