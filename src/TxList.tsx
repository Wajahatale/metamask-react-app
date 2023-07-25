import React from "react";

interface Tx {
  hash: string;
}

interface TxListProps {
  txs: Tx[];
}

const TxList: React.FC<TxListProps> = ({ txs }) => {
  if (txs.length === 0) return null;

  return (
    <>
      {txs.map((item) => (
        <div key={item.hash} className="alert alert-info mt-5">
          <div className="flex-1">
            <label>{item.hash}</label>
          </div>
        </div>
      ))}
    </>
  );
};

export default TxList;
