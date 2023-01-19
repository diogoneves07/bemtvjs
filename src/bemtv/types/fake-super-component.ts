import ComponentInst from "../component-inst";
import { SuperComponent } from "../super-component/super-component";

export interface FakeSuperComponentInternal<
  CompVars extends Record<string, any>
> extends SuperComponent<CompVars> {
  key: string;
  isFakeSuperComponent: true;
  __componentInst: ComponentInst;
}

export type FakeSuperComponent<CompVars extends Record<string, any>> = Omit<
  FakeSuperComponentInternal<CompVars>,
  "__componentInst"
>;
