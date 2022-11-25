import { hasComponent } from "./components-main";

export default function hasRoute(routeName: string) {
  return hasComponent(`Router:${routeName}`);
}
