export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type State<T> = [T, SetState<T>];
