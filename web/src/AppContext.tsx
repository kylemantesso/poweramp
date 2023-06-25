import { createContext, useContext, useEffect, useState } from "react";
import { MagicProvider } from "./MagicProvider";
import { Magic } from "magic-sdk";
import { HederaExtension } from "@magic-ext/hedera";
import { MagicUserMetadata } from "@magic-sdk/types";
import { MagicWallet } from "./MagicWallet";
import { TokenAssociateTransaction } from "@hashgraph/sdk";

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

const POWER_AMP_TOKEN_ID_TESTNET = "0.0.14935581";

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
    if (isLoggedIn && publicAddress !== "") {
      // const loginendpoint =
      //   "http://127.0.0.1:5001/helix-grid/us-central1/login";
      const loginendpoint = "https://us-central1-helix-grid.cloudfunctions.net/login";

      // const transferendpoint =
      //   "http://127.0.0.1:5001/helix-grid/us-central1/transfer";
      const transferendpoint = "https://us-central1-helix-grid.cloudfunctions.net/login";

      // Associate the token with the user
      // Add to firebase db
      fetch(loginendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: publicAddress,
        }),
      })
        .then((res) => {
          return res.text();
        })
        .then((res) => {
          if (res === "created") {
            const tx = new TokenAssociateTransaction()
              .setAccountId(publicAddress)
              .setTokenIds([POWER_AMP_TOKEN_ID_TESTNET]);
            magicWallet
              ?.populateTransaction(tx)
              .then((res) => {
                return magicWallet?.call(res);
              })
              .then(() => {
                return fetch(transferendpoint, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    accountId: publicAddress,
                  }),
                });
              });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [isLoggedIn, publicAddress]);

  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const publicAddress =
          (await magic.user.getMetadata()).publicAddress ?? "";


        const { publicKeyDer } = await magic.hedera.getPublicKey();
        console.log(publicKeyDer);

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
