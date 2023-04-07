# React Event Hook

A library for emitting and listening to events within a React application.

This package was inspired by [a Tweet](https://twitter.com/pedronauck/status/1502792417761800193?s=20&t=PFC7inszDOUhRFf7se88UA) from [@pedronauck](https://github.com/pedronauck).

[![Build status](https://github.com/etienne-martin/react-event-hook/workflows/Build/badge.svg)](https://github.com/etienne-martin/react-event-hook/actions)
[![Coveralls github](https://img.shields.io/coveralls/github/etienne-martin/react-event-hook.svg)](https://coveralls.io/github/etienne-martin/react-event-hook)
[![npm monthly downloads](https://img.shields.io/npm/dm/react-event-hook.svg)](https://www.npmjs.com/package/react-event-hook)

## Installation

To install react-event-hook into your project, run the following command:

```bash
yarn add react-event-hook
```

## Event Creation

Use the `createEvent` function to declare events. The only required argument is the event name. The function returns an object containing a listener and an emitter function, both named based on the provided event name.

```javascript
import { createEvent } from "react-event-hook";

const { usePingListener, emitPing } = createEvent("ping")();
const { usePongListener, emitPong } = createEvent("pong")();
```

### Cross-Tab Events

Enable the `crossTab` option to extend events to other tabs sharing the same origin. This feature allows local propagation of changes across multiple application instances.

```javascript
import { createEvent } from "react-event-hook";

const { useSignInListener, emitSignIn } = createEvent("sign-in")({
  crossTab: true
});
```

### Duplicate Events Warning

Since events are registered globally, ensure each event is created only once. Duplicate events sharing the same name may cause issues if their payloads differ. To avoid such problems, reuse the functions provided by `createEvent` throughout your application.

## Event Listeners

Use the listener function returned by `createEvent` to listen for events. Listeners are implemented as custom React hooks.

```jsx
import { useMessageListener } from "./events";

const ListenerComponent = () => {
  useMessageListener((message) => {
    console.log("Received a message:", message);
  });

  return <>...</>;
};
```

## Event Emitters

Emit events from anywhere in your application using the emitter function returned by `createEvent`.

```jsx
import { emitMessage } from "./events";

const EmitterComponent = () => (
  <button onClick={() => emitMessage("hello")}>Send Message</button>
);
```

Cross-tab event payloads are serialized using `JSON.stringify`. If a payload contains values that cannot be converted to JSON, an error will be thrown, and the event won't be delivered. Cross-tab payloads can contain arrays, objects, or primitive values (strings, numbers, booleans, null, undefined).

### Broadcasting Events (Cross-Tab)

Broadcast events exclusively to other tabs using the `broadcast` function. The emitting tab will not receive the event, but other tabs will. Ensure the `crossTab` option is enabled for your event.

```jsx
import { emitMessage } from "./events";

const EmitterComponent = () => (
  <button onClick={() => emitMessage.broadcast("hello")}>Send Message</button>
);
```

## TypeScript

This library is written in TypeScript to ensure type safety. It requires TypeScript v4.1 or greater due to its use of [Key Remapping](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as) and [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html).

### Typing Events

Specify event types using the following syntax:

```typescript
import { createEvent } from "react-event-hook";

interface Message {
  subject: string;
  body: string;
}

const { emitMessage } = createEvent("message")<Message>();

emitMessage({
  subject: "greeting",
  body: "hello"
});
```

## Contributing

When contributing to this project, please first discuss the proposed changes through a [GitHub issue](https://github.com/etienne-martin/react-event-hook/issues/new).

Execute `yarn test` and update the tests as necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/etienne-martin/react-event-hook/blob/main/LICENSE) file for details.
