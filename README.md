# react-event-hook

A library for emitting and listening to events in a React application.

[![Coveralls github](https://img.shields.io/coveralls/github/etienne-martin/react-event-hook.svg)](https://coveralls.io/github/etienne-martin/react-event-hook)
[![npm monthly downloads](https://img.shields.io/npm/dm/react-event-hook.svg)](https://www.npmjs.com/package/react-event-hook)

## Installation

To use react-event-hook in your project, run:

```shell script
yarn add react-event-hook
```

## Listening for events

Event listeners can be registered using the `useListener` hook. Listeners are automatically removed when components are unmounted to avoid memory leaks.

```jsx
import { useListener } from "react-event-hook";

const ListenerComponent = () => {
  const [count, setCount] = useState(0);

  useListener("increment", () => {
    setCount(count + 1);
  });

  return <div>{count}</div>;
};
```

## Emitting events

Events can be emitted from anywhere in your application using the `useEmitter` hook.

```jsx
import { useEmitter } from "react-event-hook";

const EmitterComponent = () => {
  const emit = useEmitter();

  return <button onClick={() => emit("increment")} />;
};
```

## Contributing

When contributing to this project, please first discuss the change you wish to make via a [GitHub issue](https://github.com/etienne-martin/react-event-hook/issues/new) before making a change.

Run `yarn test` and update the tests if needed.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/etienne-martin/react-event-hook/blob/main/LICENSE) file for details.