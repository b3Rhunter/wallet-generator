import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [wallet, setWallet] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [created, isCreated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const connect = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        setErrorMessage("Please install an Ethereum-enabled browser like MetaMask to use this dApp.");
      }
    } catch (error) {
      setErrorMessage("Error connecting to the Ethereum network.");
      console.log(error.message);
    }
  };

  const createWallet = async () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      await newWallet.encrypt(password);
      setWallet(newWallet);
      setIsAuthenticated(true);
      isCreated(true)
      console.log('success')
    } catch (error) {
      console.log(error.message);
    }
  };

  const authenticate = async (e) => {
    e.preventDefault();
    const storedWallet = localStorage.getItem("Wallet");
    if (!storedWallet) {
      setErrorMessage("Wallet not found");
      return;
    }
    try {
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(storedWallet, password);
      if (decryptedWallet.address) {
        setWallet(decryptedWallet);
        setIsAuthenticated(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid wallet");
      }
    } catch (error) {
      setErrorMessage("Invalid password or wallet");
    }
  };
  
  
  
  

  const saveWallet = async (e) => {
    e.preventDefault();
    if (wallet) {
      try {
        const encryptedWallet = await wallet.encrypt(password);
        localStorage.setItem("Wallet", encryptedWallet);
        setErrorMessage("");
        alert('wallet saved')
      } catch (error) {
        setErrorMessage("Wallet cannot be saved");
      }
    }
  };

  const logout = () => {
    setWallet(null);
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("wallet");
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      setIsAuthenticated(true);
      setErrorMessage("");
    }
  }, []);
  
  const handleCopyClick = (wallet) => {
    navigator.clipboard.writeText(wallet.address);
    setIsCopied(true);
    window.alert(`Copied address: ${wallet.address}`);
  };
  
  

  return (
    <>
    <div className="App">
        <header className="App-header">
          <button style={{position: "fixed", top: "10px", right: "24px"}} onClick={connect}>connect</button>
          {isAuthenticated ? (
            <>
              <h1>wallets.pub</h1>
              <button style={{position: "fixed", top: "10px", left: "24px"}} onClick={logout}>Log out</button>
              {wallet ? (
                <>
                <span style={{display: "flex"}}>
                  <p>wallet address:</p>&nbsp;
                  <p style={{cursor: "pointer"}} onClick={() => handleCopyClick(wallet)}>
                       {wallet.address.substr(0, 6)}...
                  </p>
                </span>
                  {created && (
                  <form onSubmit={saveWallet}>
                  
                  <label htmlFor="savePassword">create password:</label>
                  <br/>
                  <input
                    type="password"
                    id="savePassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                    <br/><br/>
                  <button type="submit">Save Wallet</button>
                  {errorMessage && <p className="error">{errorMessage}</p>}
                  <h3><strong>password encrypt and store wallet</strong></h3>
                </form>
                  )}

                </>
              ) : (
                <>
                  <p>No wallet found. Create one or log in to an existing wallet.</p>
                </>
              )}
            </>
          ) : (
            <>
              <h1>wallets.pub</h1>
              <button onClick={createWallet}>Create Wallet</button>
              <form style={{position: "fixed", top: "10px", left: "24px"}} onSubmit={authenticate}>
              <button type="submit">log in</button>
              &nbsp;
                <label htmlFor="password"></label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />               
              </form>
            </>
          )}
        </header>
      </div></>
  );
}

export default App;
