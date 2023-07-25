import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./components/ErrorMessage";
import TxList from "./TxList";
import styles from "./styles/App.module.css"; // Import the CSS module

interface Transaction {
  hash: string;
  // Add other properties of the transaction if needed
}

const startPayment = async ({
  setError,
  setTxs,
  ether,
  addr,
}: {
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTxs: React.Dispatch<React.SetStateAction<Transaction[]>>;
  ether: any;
  addr: any;
}) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    ethers.getAddress(addr!); // Make sure 'addr' is not null
    const tx = await (
      await signer
    ).sendTransaction({
      to: addr!,
      value: ethers.parseEther(ether!),
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err: any) {
    setError(err.message);
  }
};

export default function App() {
  const [error, setError] = useState<string | undefined>();
  const [txs, setTxs] = useState<Transaction[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(undefined);
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };

  return (
    <form className={`m-4 ${styles["credit-card"]}`} onSubmit={handleSubmit}>
      <main className="mt-4 p-4">
        <h1 className="text-xl font-semibold text-gray-700 text-center">
          Send ETH payment
        </h1>
        <div className="">
          <div className={styles["form-input"]}>
            <input
              type="text"
              name="addr"
              className={`form-control`}
              placeholder="Recipient Address"
            />
          </div>
          <div className={styles["form-input"]}>
            <input
              name="ether"
              type="text"
              className={`form-control`}
              placeholder="Amount in ETH"
            />
          </div>
        </div>
      </main>
      <footer className="p-4">
        <button
          type="submit"
          className={`btn btn-primary ${styles["submit-button"]}`}
        >
          Pay now
        </button>
        <ErrorMessage message={error} />
        <TxList txs={txs} />
      </footer>
    </form>
  );
}
