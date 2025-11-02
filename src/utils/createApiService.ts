import { api_orchestrator, IFlowExecution } from '../orchestrator';

export function createApiService(flows: Record<string, IFlowExecution>) {
  const service: Record<string, Function> = {};
  
  Object.entries(flows).forEach(([name, flow]) => {
    service[name] = (params: any, callback: Function) => {
      api_orchestrator(flow.executeOn, {
        ...flow,
        executionCallBack: callback,
        payLoadMappingCallBack: () => params?.payload || null,
        changeUrlCallBack: (stepName: string, url: string) => {
          if (params?.urlParams) {
            let newUrl = url;
            Object.entries(params.urlParams).forEach(([key, value]) => {
              newUrl = newUrl.replace(`{${key}}`, value as string);
            });
            return { transactionUrl: newUrl, transactionMethod: flow.startTransaction.method };
          }
          return null;
        }
      });
    };
  });
  
  return service;
}
