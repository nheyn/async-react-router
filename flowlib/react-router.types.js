declare module "react-router" {
	declare function run(routes: ReactRouterRoute, loc: any, callback: ReactRouterCallback): void;
}

declare class ReactRouterHandler<D, P, S> extends ReactComponent<D, P, S> {
	getAsyncInitialState: (props: {[key: string]: any}) => Promise<Object>;
}

type ReactRouterRoute = any; //TODO
type ReactRouterCallback = (Handler: ReactRouterHandler, state: ReactRouterState) => void;
type ReactRouterState = any; //TODO