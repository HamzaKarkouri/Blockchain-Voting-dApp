// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Owner address: " + deployer.address);

//   const Voting = await ethers.getContractFactory("Voting");
//   const votingDeploy = await Voting.deploy();

//   await votingDeploy.deployed();
//   console.log(
//     "Contract deployed successfully at address: " + votingDeploy.address
//   );

//   // Add candidates
//   await votingDeploy.addCandidate("Candidate 1");
//   await votingDeploy.addCandidate("Candidate 2");
//   await votingDeploy.addCandidate("Candidate 3");

//   console.log("Candidates added");
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Owner address: " + deployer.address);
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy([],[], 90);
  await voting.deployed();
  console.log("Voting deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
