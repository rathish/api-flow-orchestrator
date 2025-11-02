"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiService = createApiService;
const orchestrator_1 = require("../orchestrator");
function createApiService(flows) {
    const service = {};
    Object.entries(flows).forEach(([name, flow]) => {
        service[name] = (params, callback) => {
            (0, orchestrator_1.api_orchestrator)(flow.executeOn, {
                ...flow,
                executionCallBack: callback,
                payLoadMappingCallBack: () => params?.payload || null,
                changeUrlCallBack: (stepName, url) => {
                    if (params?.urlParams) {
                        let newUrl = url;
                        Object.entries(params.urlParams).forEach(([key, value]) => {
                            newUrl = newUrl.replace(`{${key}}`, value);
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
//# sourceMappingURL=createApiService.js.map