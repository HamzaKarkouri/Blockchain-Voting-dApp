import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import VotingPage from "./VotingPage";
import AddCandidatePage from "./AddCandidatePage";
import "./App.css";
import { ethers } from "ethers";
import { FaVoteYea, FaPlusCircle } from "react-icons/fa";
import ResultsPage from "./ResultsPage";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      connectToMetamask();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  return (
      <Router>
        <div className="flex">
          <nav className="w-64 h-screen bg-neutral-900 text-white p-6 shadow-lg">
            <h1 className="text-2xl font-bold mb-8 text-center ">Voting DApp</h1>
            <ul className="space-y-6">
              <li>
                <Link
                    to="/"
                    className="flex items-center p-3 rounded-lg transition duration-300 ease-in-out hover:bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:shadow-md"
                >
                  <FaVoteYea className="mr-3 " />
                  Voting Page
                </Link>
              </li>
              <li>
                <Link
                    to="/add-candidate"
                    className="flex items-center p-3 rounded-lg transition duration-300 ease-in-out hover:bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:shadow-md"
                >
                  <FaPlusCircle className="mr-3" />
                  Add Candidate
                </Link>
              </li>
              <li>
                <Link
                    to="/results"
                    className="flex items-center p-3 rounded-lg transition duration-300 ease-in-out hover:bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:shadow-md"
                >
                  <FaPlusCircle className="mr-3" />
                  Results
                </Link>
              </li>
            </ul>
            {isConnected && (
                <div className="mt-auto text-center p-4">
                  <p className="text-sm">Connected as:</p>
                  <p className="text-sm font-semibold break-words">{account}</p>
                </div>
            )}
          </nav>

          <div className="flex-1 p-6 bg-gray-100">
            <Routes>
              <Route
                  path="/"
                  element={
                    isConnected ? (
                        <VotingPage account={account} />
                    ) : (
                        <Login connectWallet={connectToMetamask} />
                    )
                  }
              />
              <Route
                  path="/add-candidate"
                  element={
                    isConnected ? (
                        <AddCandidatePage account={account} />
                    ) : (
                        <Login connectWallet={connectToMetamask} />
                    )
                  }
              />
              <Route
                  path="/results"
                  element={
                    isConnected ? (
                        <ResultsPage account={account} />
                    ) : (
                        <Login connectWallet={connectToMetamask} />
                    )
                  }
              />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

function Login({ connectWallet }) {
  return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">Please connect to MetaMask</h2>
        <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          Connect to MetaMask
        </button>
      </div>
  );
}

export default App;