import type { Route } from "./+types/home";
import Welcome from "../pages/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BMW Motorrad Configurator" },
    {
      name: "description",
      content: "BMW Motorrad Configurator - All colors, packages and prices",
    },
  ];
}

export default function Home() {
  return (
  <Welcome />
  );
}
