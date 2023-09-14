
type Resolve<T> = (value: T) => void;

type Reject = (reason?: any) => void;

export type PromiseExecutor<T> = (Resolve: Resolve<T>, reject: Reject) => void;

