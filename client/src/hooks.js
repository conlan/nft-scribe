import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected } from "./connectors";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && !active && !error && !suppress) {
      const handleNetworkChanged = networkId => {
        console.log("networkChanged", networkId);
        activate(injected);
      };
      const handleAccountsChanged = accounts => {
        console.log("accountsChanged", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      ethereum.on("networkChanged", handleNetworkChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum.removeListener("networkChanged", handleNetworkChanged);
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }

    return () => {};
  }, [active, error, suppress, activate]);
}
