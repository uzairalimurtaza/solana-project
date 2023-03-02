import { FC, useEffect, useState, useContext } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { ReactComponent as WalletIcon } from "../../../assets/images/Icon awesome-wallet.svg";
import { ReactComponent as DisconnectWalletIcon } from "../../../assets/images/Disconnect wallet.svg";
import { toast } from "react-toastify";
import Axios from "../../../api/Axios";
import MainContext from "../../../Context/MainContext";
import { useNavigate, useLocation } from "react-router-dom";
import { walletAddressLogin } from "../../../api/Url";
import CircularProgress from '@mui/material/CircularProgress';

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
}

type WindowWithSolana = Window & {
  solana?: PhantomProvider;
};

const ConnectWallet = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hello = localStorage.getItem("wallet");

  const { walletIsConnected, setWalletIsConnected } = useContext(MainContext);
  const [walletAvail, setWalletAvail] = useState(false);
  const [reload, setreload] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [loader, setLoader] = useState(false);

  const [pubKey, setPubKey] = useState<PublicKey | null>(null);

  const [solWindow, setSolWindow] = useState(window as WindowWithSolana);

  useEffect(() => {
    if ("solana" in window) {
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
      }
      solWindow.solana?.on("connect", async (publicKey: PublicKey) => {
        setConnected(true);
        setPubKey(publicKey);
        localStorage.setItem("wallet", "true");
      });
      solWindow.solana?.on("disconnect", () => {
        console.log("disconnect event");
        setConnected(false);
        setPubKey(null);
        setWalletIsConnected(false);
        // localStorage.clear();
      });
    }
  }, [solWindow.solana]);

  const RegisterUser = async (pubkey) => {
    const value = pubkey?.toBase58();
    const data = {
      walletAdress: value,
    };
    try {
      setLoader(true)
      const response = await Axios.post(walletAddressLogin, data);
      const { status, message, token, role, user_id, user_name } = response.data;
      if (response) {
        setLoader(false)
      }
      if (status) {
        localStorage.setItem("uToken", `Bearer ${token}`);
        localStorage.setItem("user_id", `${user_id}`);
        localStorage.setItem("user_name", `${user_name}`);
        localStorage.setItem("role", `${role}`);
        setWalletIsConnected(true);
      }
    } catch (err) {
      setLoader(false)
      console.log(err);
    }
  };

  const connectHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    await setProvider(solWindow.solana);
    if (!solWindow.solana) {
      toast.error("Please install your phantom extension to connect wallet", {
        toastId: 'FE5',
      });
    }
    if (provider) {
      provider
        ?.connect()
        .then(async (res) => {
          setConnected(true);
          setPubKey(provider.publicKey);
          localStorage.setItem("wallet", "true");
          await RegisterUser(provider.publicKey);
        })
        .catch((err) => {
          console.error("connect ERROR:", err);
        });
    }
  };

  const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    provider?.disconnect().catch((err) => {
      console.error("disconnect ERROR:", err);
    });
  };

  return (
    <div className="sc-btn-top mg-r-12" id="site-header">
      <div className="d-flex align-items-center">
        {
          loader ? (
            <CircularProgress />
          ) :
            !connected ? (
              <button
                onClick={connectHandler}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                <span>
                  
                  <WalletIcon style={{ width: "25px" }} />
                  {children}
                </span>
              </button>
            ) : (
              <button
                onClick={disconnectHandler}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                <span>
                  <DisconnectWalletIcon style={{ width: "25px" }} />
                </span>
              </button>
            )
        }
      </div>
    </div>
  );
};

export default ConnectWallet;
