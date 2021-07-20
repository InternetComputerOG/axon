import React, { useEffect, useState } from "react";
import { Command, Disburse } from "../../declarations/Axon/Axon.did";
import { isAccount } from "../../lib/account";
import useDebounce from "../../lib/hooks/useDebounce";
import ErrorAlert from "../Labels/ErrorAlert";

export function DisburseForm({
  makeCommand,
  stake,
}: {
  makeCommand: (cmd: Command | null) => void;
  stake?: bigint;
}) {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const debouncedAccount = useDebounce(account);
  const debouncedAmount = useDebounce(amount);

  useEffect(() => {
    console.log("debounced");

    let to_account = [];
    setError("");
    if (account) {
      if (isAccount(account)) {
        to_account = [{ hash: Array.from(Buffer.from(account, "hex")) }];
      } else {
        setError("Invalid account");
        return makeCommand(null);
      }
    }
    console.log("after");

    makeCommand({
      Disburse: {
        to_account,
        amount: amount ? [{ e8s: BigInt(amount) * BigInt(1e8) }] : [],
      } as Disburse,
    });
  }, [debouncedAccount, debouncedAmount]);

  return (
    <>
      <div className="flex flex-col py-4 gap-2">
        <div>
          <label>Account</label>
          <input
            type="text"
            placeholder="Account"
            className="w-full mt-1"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            maxLength={64}
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            placeholder="Amount"
            className="w-full mt-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
            max={stake !== undefined ? Number(stake / BigInt(1e8)) : undefined}
          />
        </div>
      </div>

      {!!error && <ErrorAlert>{error}</ErrorAlert>}
    </>
  );
}
