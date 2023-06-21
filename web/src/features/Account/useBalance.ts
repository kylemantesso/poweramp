import { useEffect, useState } from "react";
import { MagicWallet } from "../../MagicWallet";

export function useBalance(magicWallet: MagicWallet) {
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    magicWallet.getAccountBalance().then((balance) => {
      debugger;
      setBalance(balance);
    });
  }, []);

  return balance;
}
