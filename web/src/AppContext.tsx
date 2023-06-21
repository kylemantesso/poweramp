import { createContext, useContext, useEffect, useState } from "react";
import { MagicProvider } from "./MagicProvider";
import { Magic } from "magic-sdk";
import { HederaExtension } from "@magic-ext/hedera";
import { MagicUserMetadata } from "@magic-sdk/types";
import { MagicWallet } from "./MagicWallet";

interface IAppContext {
  magicWallet?: MagicWallet;
  magic: any;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  publicAddress: string;
  userMetadata: MagicUserMetadata | undefined;
  logout: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create the context and provide an initial value
const AppContext = createContext<IAppContext>({} as any);
// Define a provider component to wrap your app with
export function AppContextProvider({
  network,
  children,
}: {
  network: "testnet" | "mainnet";
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [publicAddress, setPublicAddress] = useState("");
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata>();
  const [magicWallet, setMagicWallet] = useState<MagicWallet>();

  const magic = new Magic("pk_live_C8037E2E6520BBDF", {
    extensions: [
      new HederaExtension({
        network: network,
      }),
    ],
  });

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const publicAddress =
          (await magic.user.getMetadata()).publicAddress ?? "";

        const { publicKeyDer } = await magic.hedera.getPublicKey();

        fetch("https://us-central1-helix-grid.cloudfunctions.net/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId: publicAddress,
          }),
        });

        const magicSign = (message: Uint8Array) => magic.hedera.sign(message);
        const magicWallet = new MagicWallet(
          publicAddress,
          new MagicProvider(network),
          publicKeyDer,
          magicSign
        );
        setMagicWallet(magicWallet);
        setPublicAddress(publicAddress);
        setUserMetadata(await magic.user.getMetadata());
      }
      setIsLoading(false);
    });
  }, [isLoggedIn]);

  return (
    <AppContext.Provider
      value={{
        magicWallet,
        isLoading,
        setIsLoading,
        magic,
        isLoggedIn,
        setIsLoggedIn,
        publicAddress,
        userMetadata,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
