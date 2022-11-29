import { useState, useEffect } from 'react'
import {ethers} from "ethers"

export default function MetaConnect() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged)
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountsChanged(res[0]);
        setErrorMessage(null)
      } catch (err) {
        console.error(err);
        setErrorMessage(err.message)
      }
    } else {
      setErrorMessage("Install MetaMask")
    }
  };

  const accountsChanged = async (newAccount) => {
    setAccount(newAccount);
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
      setBalance(ethers.utils.formatEther(balance))
    } catch (err) {
      if (newAccount.length == 0) {
        setErrorMessage(null)
        setBalance("")
      } else {
        console.error(err);
        setErrorMessage(err.message)
      }
    }
  };

  const chainChanged = () => {    
    setErrorMessage(null);    
    setAccount(null);    
    setBalance(null);  
  };


  return (
    <div>
        <p>Account : {account}</p>
        <p>Balance (ETH) : {balance}</p>
        <button onClick={connectHandler}>Connect wallet</button>
        {errorMessage ? <p style={{color:"red"}}>Error : {errorMessage}</p> : null}
    </div>
  )
}
