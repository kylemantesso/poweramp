import { Divider } from "@mui/material";

import { Hero } from "./components/Hero";
import { MainLayout } from "./components/MainLayout";
import { Onboarding } from "./components/Onboarding";
import { Onramp } from "./components/Onramp";

export function Home() {
  return (
    <main>
      <MainLayout>
        <Hero />
        <Divider />
        <Onboarding />
        <Divider />
        <Onramp />

      </MainLayout>
    </main>
  );
}
