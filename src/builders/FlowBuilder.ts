import { IFlowExecution, IStepExecution } from '../orchestrator';

export class FlowBuilder {
  private flow: Partial<IFlowExecution> = {};
  
  static create() {
    return new FlowBuilder();
  }
  
  executeOn(action: "CREATE" | "UPDATE" | "DELETE" | "GET") {
    this.flow.executeOn = action;
    return this;
  }
  
  startWith(step: IStepExecution) {
    this.flow.startTransaction = step;
    return this;
  }
  
  onSuccess(callback: Function) {
    this.flow.executionCallBack = callback;
    return this;
  }
  
  build(): IFlowExecution {
    if (!this.flow.executeOn || !this.flow.startTransaction) {
      throw new Error('Flow must have executeOn and startTransaction defined');
    }
    return this.flow as IFlowExecution;
  }
}
