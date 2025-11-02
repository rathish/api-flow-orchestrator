"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_orchestrator = api_orchestrator;
exports.executeAPI = executeAPI;
const axios_1 = __importDefault(require("axios"));
function api_orchestrator(action, execute, authorization) {
    if (action === execute.executeOn) {
        executeAPI(execute.startTransaction, authorization, execute.executionCallBack, execute.payLoadMappingCallBack, execute.changeUrlCallBack, execute.repeatConfirmationCallBack, undefined, execute.canExecuteCallBack);
    }
}
function executeAPI(step, authorization, execution_callback, payload_callback, changeUrlCallBack, repeatConfirmationCallBack, prev_result, canExeuteStep) {
    if (step.executeOn === "always") {
        !step.payload && payload_callback && (step.payload = payload_callback(step.name, prev_result));
        const changedUrl = changeUrlCallBack
            ? changeUrlCallBack(step.name, step.transactionUrl, step.method, prev_result, step.payload)
            : undefined;
        if (changedUrl) {
            step.transactionUrl = changedUrl.transactionUrl;
            step.method = changedUrl.transactionMethod;
        }
        !step.authorization ? (step.authorization = authorization) : undefined;
        canExecute(step, canExeuteStep)
            ? Promise.resolve(makeAPICall(step, authorization, payload_callback, prev_result, canExeuteStep, changeUrlCallBack))
                .then((response) => {
                let nextStepToExecute = undefined;
                execution_callback && execution_callback(step.name, "Completed", response);
                if (repeatConfirmationCallBack) {
                    if (repeatConfirmationCallBack(step.name, response)) {
                        nextStepToExecute = step;
                        payload_callback && (step.payload = payload_callback(step.name, prev_result));
                    }
                    else {
                        nextStepToExecute = step.next;
                    }
                }
                else {
                    nextStepToExecute = step.next;
                }
                nextStepToExecute && executeAPI(nextStepToExecute, authorization, execution_callback, payload_callback, changeUrlCallBack, repeatConfirmationCallBack, response, canExeuteStep);
            })
                .catch((response) => {
                execution_callback && execution_callback(step.name, "Failed", response);
            })
            : (execution_callback && execution_callback(step.name, "Skipped", {}),
                step.next && executeAPI(step.next, authorization, execution_callback, payload_callback, changeUrlCallBack, repeatConfirmationCallBack, undefined, canExeuteStep));
    }
}
function canExecute(step, canExeuteStep) {
    if (step.method == "PUT" || step.method == "POST") {
        if (!step.payload)
            return false;
    }
    if (!step.authorization)
        return false;
    if (canExeuteStep)
        return canExeuteStep(step.name);
    return true;
}
function makeAPICall(step, authorization, payload_callback, prev_result, canExecuteCallBack, changeUrlCallBack) {
    const parallelPromise = [];
    switch (step.method) {
        case "GET":
            parallelPromise.push(axios_1.default.get(step.transactionUrl, step.authorization).catch(useNull));
            break;
        case "POST":
            parallelPromise.push(axios_1.default.post(step.transactionUrl, step.payload, step.authorization).catch(useNull));
            break;
        case "DELETE":
            parallelPromise.push(axios_1.default.delete(step.transactionUrl, step.authorization).catch(useNull));
            break;
        case "PUT":
            parallelPromise.push(axios_1.default.put(step.transactionUrl, step.payload, step.authorization).catch(useNull));
    }
    return axios_1.default.all(parallelPromise).then(axios_1.default.spread((...args) => {
        const results = [];
        for (let iCount = 0; iCount < args.length; iCount++) {
            if (args[iCount] != null) {
                results.push({
                    http_status_code: args[iCount].status,
                    http_status_message: args[iCount].statusText,
                    http_response: args[iCount].data,
                    transactionName: step.name,
                    transactionUrl: args[iCount].request.responseURL,
                });
            }
        }
        return results[0];
    }));
}
function useNull() {
    return null;
}
//# sourceMappingURL=orchestrator.js.map