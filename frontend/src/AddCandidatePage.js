import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";

const pinataApiKey = "1091ad6c4f0ea94e993d";
const pinataSecretApiKey = "5a352792d20537cfc3bd01369028ddb62fa85daaa6e169fa5ca42b539ada07c0";

function AddCandidatePage({ account }) {
    const [newCandidateName, setNewCandidateName] = useState("");
    const [newCandidateImage, setNewCandidateImage] = useState(null);

    async function addCandidate() {
        if (!newCandidateName || !newCandidateImage) {
            return alert("Please enter candidate name and select an image");
        }

        try {
            const formData = new FormData();
            formData.append("file", newCandidateImage);

            const metadata = JSON.stringify({
                name: newCandidateImage.name,
                keyvalues: {
                    description: "Candidate image uploaded using Pinata",
                },
            });

            formData.append("pinataMetadata", metadata);
            formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

            const result = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                        pinata_api_key: pinataApiKey,
                        pinata_secret_api_key: pinataSecretApiKey,
                    },
                }
            );

            const imageUrl = `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`;

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

            const tx = await contractInstance.addCandidate(newCandidateName, imageUrl);
            await tx.wait();
            alert("Candidate added successfully!");
        } catch (error) {
            console.error("Error uploading image to Pinata:", error);
            alert("Failed to upload image to Pinata");
        }
    }

    function handleNewCandidateChange(e) {
        setNewCandidateName(e.target.value);
    }

    function handleNewCandidateImageChange(e) {
        setNewCandidateImage(e.target.files[0]);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Add Candidate</h2>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-105">
                <div className="mb-6">
                    <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="candidateName">
                        Candidate Name
                    </label>
                    <input
                        type="text"
                        id="candidateName"
                        className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        value={newCandidateName}
                        onChange={handleNewCandidateChange}
                        placeholder="Enter candidate name"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="candidateImage">
                        Candidate Image
                    </label>
                    <input
                        type="file"
                        id="candidateImage"
                        className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        onChange={handleNewCandidateImageChange}
                    />
                </div>
                <button
                    onClick={addCandidate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                    Add Candidate
                </button>
            </div>
        </div>
    );
}

export default AddCandidatePage;
