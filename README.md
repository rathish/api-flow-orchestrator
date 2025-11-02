# 🚀 API Flow Orchestrator

Enterprise-grade API orchestration framework with SAGA pattern support for React/React Native applications.

## ✨ Features

- 🔄 **SAGA Pattern**: Built-in support for complex transaction workflows
- 🎯 **Declarative Flows**: Define API workflows as configuration
- 🔗 **Sequential & Parallel Execution**: Chain API calls with automatic error handling
- 🛡️ **Type Safety**: Full TypeScript support
- ⚙️ **Configurable**: Environment-based configuration
- 🔄 **Auto-Retry**: Built-in retry mechanisms
- 📊 **Redux Integration**: Seamless state management

## 📦 Installation

```bash
npm install @yobny/api-flow-orchestrator
# or
yarn add @yobny/api-flow-orchestrator
```

## 🚀 Quick Start

### 1. Define Your Flow

```typescript
import { IFlowExecution } from '@yobny/api-flow-orchestrator';

const createUserFlow: IFlowExecution = {
  executeOn: "CREATE",
  startTransaction: {
    name: "createUser",
    description: "Create new user",
    executeOn: "always",
    method: "POST",
    transactionUrl: "https://api.example.com/users",
    authorization: { headers: { 'Content-Type': 'application/json' } },
    next: {
      name: "sendWelcomeEmail",
      description: "Send welcome email after user creation",
      executeOn: "always",
      method: "POST",
      transactionUrl: "https://api.example.com/emails/welcome",
      authorization: { headers: { 'Content-Type': 'application/json' } }
    }
  }
};
```

### 2. Execute the Flow

```typescript
import { api_orchestrator } from '@yobny/api-flow-orchestrator';

api_orchestrator("CREATE", {
  ...createUserFlow,
  executionCallBack: (stepName, status, result) => {
    if (status === "Completed") {
      console.log(`${stepName} completed successfully`);
    } else if (status === "Failed") {
      console.error(`${stepName} failed:`, result);
    }
  },
  payLoadMappingCallBack: (stepName) => {
    if (stepName === "createUser") {
      return { name: "John Doe", email: "john@example.com" };
    }
    return null;
  }
});
```

### 3. Using the Flow Builder (Advanced)

```typescript
import { FlowBuilder } from '@yobny/api-flow-orchestrator';

const flow = FlowBuilder
  .create()
  .executeOn("CREATE")
  .startWith({
    name: "createProduct",
    description: "Create product",
    executeOn: "always",
    method: "POST",
    transactionUrl: "/api/products",
    authorization: { headers: { 'Content-Type': 'application/json' } }
  })
  .onSuccess((stepName, status, result) => {
    console.log('Flow completed:', result);
  })
  .build();
```

## 🔧 Configuration

Set your API base URL via environment variables:

```bash
# React
REACT_APP_API_BASE_URL=https://api.yourapp.com

# React Native/Expo
EXPO_PUBLIC_API_BASE_URL=https://api.yourapp.com
```

## 📚 Advanced Usage

### Error Handling & Retry

```typescript
const flowWithRetry: IFlowExecution = {
  executeOn: "CREATE",
  startTransaction: {
    name: "createOrder",
    executeOn: "always",
    method: "POST",
    transactionUrl: "/api/orders",
    repeat: 3, // Retry up to 3 times
    authorization: { headers: { 'Content-Type': 'application/json' } }
  }
};
```

### Parallel Execution

```typescript
const parallelFlow: IFlowExecution = {
  executeOn: "GET",
  startTransaction: {
    name: "fetchUserData",
    executeOn: "always",
    method: "GET",
    transactionUrl: "/api/users/{id}",
    parallel: [
      {
        name: "fetchUserOrders",
        executeOn: "always",
        method: "GET",
        transactionUrl: "/api/users/{id}/orders"
      },
      {
        name: "fetchUserPreferences",
        executeOn: "always", 
        method: "GET",
        transactionUrl: "/api/users/{id}/preferences"
      }
    ]
  }
};
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Rathish J](https://github.com/rathishraj)

## 🌟 Support

If this project helped you, please consider giving it a ⭐️ on [GitHub](https://github.com/yobny/api-flow-orchestrator)!
