"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowBuilder = void 0;
class FlowBuilder {
    constructor() {
        this.flow = {};
    }
    static create() {
        return new FlowBuilder();
    }
    executeOn(action) {
        this.flow.executeOn = action;
        return this;
    }
    startWith(step) {
        this.flow.startTransaction = step;
        return this;
    }
    onSuccess(callback) {
        this.flow.executionCallBack = callback;
        return this;
    }
    build() {
        if (!this.flow.executeOn || !this.flow.startTransaction) {
            throw new Error('Flow must have executeOn and startTransaction defined');
        }
        return this.flow;
    }
}
exports.FlowBuilder = FlowBuilder;
//# sourceMappingURL=FlowBuilder.js.map