"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type AutosaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";

type UseAutosaveOptions<T> = {
  value: T;

  onSave: (value: T) => Promise<void>;

  delay?: number;

  enabled?: boolean;

  onSuccess?: () => void;

  onError?: (error: Error) => void;
};

type UseAutosaveReturn = {
  status: AutosaveStatus;

  isSaving: boolean;
  isSaved: boolean;
  hasError: boolean;

  error: Error | null;

  saveNow: () => Promise<void>;
  cancel: () => void;
};

export function useAutosave<T>({
  value,
  onSave,
  delay = 1000,
  enabled = true,
  onSuccess,
  onError,
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [status, setStatus] =
    useState<AutosaveStatus>("idle");

  const [error, setError] =
    useState<Error | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const latestValueRef =
    useRef(value);

  const saveIdRef =
    useRef(0);

  const isMountedRef =
    useRef(true);

  const lastSavedValueRef =
    useRef<T | null>(null);

  /* ====================================== */
  /* KEEP LATEST VALUE                      */
  /* ====================================== */

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  /* ====================================== */
  /* MOUNT / UNMOUNT                        */
  /* ====================================== */

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* ====================================== */
  /* SAVE                                    */
  /* ====================================== */

  const saveNow = useCallback(
    async () => {
      const currentSaveId =
        ++saveIdRef.current;

      const currentValue =
        latestValueRef.current;

      setStatus("saving");
      setError(null);

      try {
        await onSave(currentValue);

        /*
         * If another save started while this
         * request was running, don't mark this
         * older request as the latest save.
         */

        if (
          currentSaveId !==
          saveIdRef.current
        ) {
          return;
        }

        lastSavedValueRef.current =
          currentValue;

        if (isMountedRef.current) {
          setStatus("saved");
          onSuccess?.();
        }
      } catch (caught) {
        /*
         * Ignore errors from stale saves.
         */

        if (
          currentSaveId !==
          saveIdRef.current
        ) {
          return;
        }

        const saveError =
          caught instanceof Error
            ? caught
            : new Error(
                "Autosave failed."
              );

        if (isMountedRef.current) {
          setError(saveError);
          setStatus("error");

          onError?.(saveError);
        }
      }
    },
    [onSave, onSuccess, onError]
  );

  /* ====================================== */
  /* DEBOUNCED AUTOSAVE                    */
  /* ====================================== */

  useEffect(() => {
    if (!enabled) {
      return;
    }

    /*
     * Don't save the initial value if it
     * hasn't changed from what was already
     * saved.
     */

    if (
      lastSavedValueRef.current !== null &&
      Object.is(
        lastSavedValueRef.current,
        value
      )
    ) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current =
      setTimeout(() => {
        timerRef.current = null;
        void saveNow();
      }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(
          timerRef.current
        );

        timerRef.current = null;
      }
    };
  }, [
    value,
    delay,
    enabled,
    saveNow,
  ]);

  /* ====================================== */
  /* CANCEL                                  */
  /* ====================================== */

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(
        timerRef.current
      );

      timerRef.current = null;
    }

    /*
     * Invalidate any save currently in
     * progress so its result cannot update
     * the state as the latest save.
     */

    saveIdRef.current += 1;

    if (isMountedRef.current) {
      setStatus("idle");
      setError(null);
    }
  }, []);

  return {
    status,

    isSaving:
      status === "saving",

    isSaved:
      status === "saved",

    hasError:
      status === "error",

    error,

    saveNow,
    cancel,
  };
}

export default useAutosave;