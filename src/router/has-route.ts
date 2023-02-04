import { hasComponent } from "../bemtv/components-main";

export default function hasRoute(routeName: string) {
  return hasComponent(`Router:${routeName}`);
}
