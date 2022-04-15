import type { PascalCase } from "../utils/pascal-case.def";
import type { Trim } from "../utils/trim.def";

export type NormalizedEventName<Str extends string> = PascalCase<Trim<Str>>;
