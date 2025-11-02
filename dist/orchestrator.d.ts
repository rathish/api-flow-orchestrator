export interface IStepExecution {
    name: string;
    description: string;
    executeOn: "always" | "HTTP_1xx" | "HTTP_2xx" | "HTTP_3xx" | "HTTP_4xx" | "HTTP_5xx" | IGenericCallBack;
    method: "GET" | "POST" | "DELETE" | "PUT";
    transactionUrl: string;
    complementingTransactionUrl?: string;
    executeComplementingTransaction?: "HTTP_1xx" | "HTTP_2xx" | "HTTP_3xx" | "HTTP_4xx" | "HTTP_5xx" | IGenericCallBack | undefined;
    status?: "COMPLETED_SUCCESS" | "COMPLETED_FAILURE" | "COMPLETED_COMPLEMENTING" | "NO_STARTED" | "IN_EXECTION";
    next?: IStepExecution;
    parallel?: IStepExecution[] | undefined;
    payload?: any;
    authorization?: any;
    repeat?: number;
}
export interface IGenericCallBack {
    callback: any;
}
export interface IFlowExecution {
    startTransaction: IStepExecution;
    executeOn: "CREATE" | "UPDATE" | "DELETE" | "GET";
    failureNotice?: any;
    executionCallBack?: any;
    payLoadMappingCallBack?: any;
    changeUrlCallBack?: any;
    repeatConfirmationCallBack?: any;
    canExecuteCallBack?: any;
}
export interface ITransactionExecutionResult {
    transactionName: string;
    transactionUrl: string;
    http_status_code: any;
    http_status_message: string;
    http_response: any;
}
export interface IChangeTransactionURLAndMethod {
    transactionUrl: string;
    transactionMethod: "GET" | "POST" | "DELETE" | "PUT";
}
export declare function api_orchestrator(action: string, execute: IFlowExecution, authorization?: any): any;
export declare function executeAPI(step: IStepExecution, authorization: any, execution_callback?: any, payload_callback?: any, changeUrlCallBack?: any, repeatConfirmationCallBack?: any, prev_result?: ITransactionExecutionResult, canExeuteStep?: any): void;
//# sourceMappingURL=orchestrator.d.ts.map