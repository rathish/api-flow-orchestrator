import { IFlowExecution, IStepExecution } from '../orchestrator';
export declare class FlowBuilder {
    private flow;
    static create(): FlowBuilder;
    executeOn(action: "CREATE" | "UPDATE" | "DELETE" | "GET"): this;
    startWith(step: IStepExecution): this;
    onSuccess(callback: Function): this;
    build(): IFlowExecution;
}
//# sourceMappingURL=FlowBuilder.d.ts.map