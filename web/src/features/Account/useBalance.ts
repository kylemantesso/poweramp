import { useEffect, useState } from "react";
import { MagicWallet } from "../../MagicWallet";

export interface Balance {
  hbars: string;
  tokens: Token[];
}

export interface Token {
  tokenId: "0.0.14935581";
  balance: string;
  decimals: number;
}

export function useBalance(magicWallet: MagicWallet) {
  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    magicWallet.getAccountBalance().then((res: any) => {
      setBalance(JSON.parse(res.toString()));
    });
  }, []);

  return balance;
}
