// Drop-in replacement for useLocalStorage that syncs with Firestore in real-time
import { useState, useEffect, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useFirestore(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const docRef = doc(db, "state", key);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setValue(snap.data().value);
      }
    });
    return unsub;
  }, [key]);

  const setValueFn = useCallback(
    (newValue) => {
      const val = newValue instanceof Function ? newValue(valueRef.current) : newValue;
      setValue(val);
      setDoc(doc(db, "state", key), { value: val });
    },
    [key]
  );

  return [value, setValueFn];
}
