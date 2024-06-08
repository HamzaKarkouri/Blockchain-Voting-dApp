import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { contractAbi, contractAddress } from "./Constant/constant";
import Connected from "./Components/Connected";
import Finished from "./Components/Finished";

function VotingPage({ account }) {
    const [provider, setProvider] = useState(null);
    const [votingStatus, setVotingStatus] = useState(true);
    const [remainingTime, setRemainingTime] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [isAllowedToVote, setIsAllowedToVote] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            fetchData(provider);
        }
    }, [account]);

    async function fetchData(provider) {
        try {
            await Promise.all([
                getCandidates(provider),
                getRemainingTime(provider),
                getCurrentStatus(provider),
                checkIfCanVote(provider),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function vote(candidateIndex) {
        try {
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

            const tx = await contractInstance.vote(candidateIndex);
            await tx.wait();
            checkIfCanVote(provider);
            alert("Vote cast successfully!");
        } catch (error) {
            console.error("Error casting vote:", error);
            alert("Failed to cast vote. Please try again.");
        }
    }

    async function endVoting() {
        try {
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

            const tx = await contractInstance.endVoting();
            await tx.wait();
            setVotingStatus(false);
            alert("Voting ended successfully!");
        } catch (error) {
            console.error("Error ending voting:", error);
            alert("Failed to end voting. Please try again.");
        }
    }

    async function getCandidates(provider) {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const candidatesList = await contractInstance.getAllVotesOfCandidates();
        const formattedCandidates = candidatesList.map((candidate, index) => ({
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber(),
            image: candidate.image,
        }));
        setCandidates(formattedCandidates);
    }

    async function getCurrentStatus(provider) {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const status = await contractInstance.getVotingStatus();
        setVotingStatus(status);
    }

    async function getRemainingTime(provider) {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const time = await contractInstance.getRemainingTime();
        setRemainingTime(convertSecondsToHours(parseInt(time, 16)));
    }

    async function checkIfCanVote(provider) {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const voteStatus = await contractInstance.voters(await signer.getAddress());
        setIsAllowedToVote(!voteStatus); // Assuming voteStatus is false if the user hasn't voted yet
    }

    function convertSecondsToHours(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while fetching data
    }

    return (
        <div className="flex">

            <div className="w-3/4 p-4">
                {votingStatus ? (
                    <div>
                        <Connected account={account} remainingTime={remainingTime} />
                        <h2 className="text-2xl font-bold mb-4">Candidates</h2>
                        <ul className="space-y-4">
                            {candidates.map((candidate) => (
                                <li key={candidate.index} className="bg-white p-4 rounded shadow-md flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={candidate.image} alt={candidate.name} className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                                            <p className="text-gray-600">{candidate.voteCount} votes</p>
                                        </div>
                                    </div>
                                    {isAllowedToVote && (
                                        <button onClick={() => vote(candidate.index)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                            Vote
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button onClick={endVoting} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4">
                            End Voting
                        </button>
                    </div>
                ) : (
                    <Finished />
                )}
            </div>
        </div>
    );
}

export default VotingPage;
