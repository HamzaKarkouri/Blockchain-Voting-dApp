import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto"; // Importez Chart depuis chart.js/auto
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";

function ResultsPage({ account }) {
    const [provider, setProvider] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [chart, setChart] = useState(null);

    useEffect(() => {
        if (account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            fetchCandidates(provider);
        }
    }, [account]);

    useEffect(() => {
        if (chart) {
            chart.destroy();
        }
        if (candidates.length > 0) {
            createChart();
        }
    }, [candidates]);

    async function fetchCandidates(provider) {
        try {
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );
            const candidatesList = await contractInstance.getAllVotesOfCandidates();
            setCandidates(candidatesList);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    }

    // Function to generate data for the chart
    function generateChartData() {
        const labels = candidates.map((candidate) => candidate.name);
        const data = candidates.map((candidate) => candidate.voteCount.toNumber());

        return {
            labels: labels,
            datasets: [
                {
                    label: "Number of Votes",
                    backgroundColor: "rgba(75,192,192,1)",
                    borderColor: "rgba(0,0,0,1)",
                    borderWidth: 2,
                    data: data,
                },
            ],
        };
    }

    function createChart() {
        const ctx = document.getElementById("myChart");
        const newChart = new Chart(ctx, {
            type: "bar",
            data: generateChartData(),
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
        setChart(newChart);
    }

    return (
        <div>
            <h2>Results</h2>
            <div>
                <canvas id="myChart" />
            </div>
        </div>
    );
}

export default ResultsPage;
