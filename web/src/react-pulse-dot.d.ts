declare module "react-pulse-dot" {
  import { ReactNode } from "react";

  interface PulseDotProps {
    color?: string;
    style: any;
  }

  const PulseDot: React.FC<PulseDotProps>;

  export default PulseDot;
}
