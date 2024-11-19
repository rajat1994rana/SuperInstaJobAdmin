import { useCallback, useEffect, useRef } from "react";

function useDebouncedCallback(callback = () => {}, wait = 1000) {
  const argsRef = useRef();
  const timeout = useRef(null);

  function cleanup() {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
    }
  }

  useEffect(() => cleanup, []);

  return useCallback(
    (...args) => {
      argsRef.current = args;

      cleanup();

      timeout.current = setTimeout(() => {
        if (argsRef.current) {
          callback(...argsRef.current);
        }
      }, wait);
    },
    [callback, wait]
  );
}

export default useDebouncedCallback;
