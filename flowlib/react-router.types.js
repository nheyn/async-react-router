declare module "react-router" {
	declare function run(routes: ReactRouterRoute, loc: any, callback: ReactRouterCallback): void;
}

//ERROR, flow is acting as if ReactRouterHandlerClass doesn't extend ReactClass
/*declare class ReactRouterHandlerClass<D, P, S> extends ReactClass<D, P, S> {
	getAsyncInitialState: (props: {[key: string]: any}) => Promise<Object>;
}*/

type ReactRouterRoute = ReactElement;
type ReactRouterCallback = (Handler: ReactClass, state: ReactRouterState) => void; //TODO
type ReactRouterState = any; //TODO