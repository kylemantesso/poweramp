import { Divider } from "@mui/material";

// import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { MainLayout } from "./components/MainLayout";
// import { Onboarding } from "./components/Onboarding";
// import { Onramp } from "./components/Onramp";

export function Home() {
  return (
    <main>
      <MainLayout>
        <Hero />
        <Divider />
        {/*<Onboarding />*/}
        {/*<Divider />*/}
        {/*<Onramp />*/}
        {/*<Features />*/}
        {/*<Divider />*/}
      </MainLayout>
    </main>
  );
}
