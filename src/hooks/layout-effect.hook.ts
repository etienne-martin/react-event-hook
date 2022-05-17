import { useEffect, useLayoutEffect } from "react";
import { canUseDom } from "../utils/dom";

export const useIsomorphicLayoutEffect = canUseDom
  ? useLayoutEffect
  : useEffect;
