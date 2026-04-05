export type Component<T extends object = any> = (props: T) => React.ReactNode

export type ComponentProps<T extends Component> = Parameters<T>[0]
