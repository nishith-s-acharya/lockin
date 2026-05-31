import * as React from 'react';

export function useControlledState(props) {
  const { value, defaultValue, onChange } = props;

  const [state, setInternalState] = React.useState(value !== undefined ? value : defaultValue);
  const [prevValue, setPrevValue] = React.useState(value);

  if (value !== prevValue) {
    setInternalState(value !== undefined ? value : defaultValue);
    setPrevValue(value);
  }

  const setState = React.useCallback((next, ...args) => {
    setInternalState(next);
    onChange?.(next, ...args);
  }, [onChange]);

  return [state, setState];
}

