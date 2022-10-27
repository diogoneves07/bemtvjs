export function routeToKebabCase(route: string) {
  return (
    route[0].toLowerCase() +
    route
      .slice(1)
      .split("")
      .map((c) => (c === c.toUpperCase() ? "-" + c.toLowerCase() : c))
      .join("")
  );
}
export function routeToCamelCase(route: string) {
  return route
    .split("-")
    .map((c) => c[0].toUpperCase() + c.slice(1))
    .join("");
}
