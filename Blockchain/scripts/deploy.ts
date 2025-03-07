import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy AccessControlContract
  const AccessControlFactory = await ethers.getContractFactory("AccessControlContract");
  const accessControl = await AccessControlFactory.deploy(deployer.address);
  await accessControl.waitForDeployment(); // <-- changed
  console.log("AccessControlContract deployed to:", await accessControl.getAddress());

  // Deploy DigitalSignatureContract
  const DigitalSignatureFactory = await ethers.getContractFactory("DigitalSignatureContract");
  const digitalSignature = await DigitalSignatureFactory.deploy();
  await digitalSignature.waitForDeployment(); // <-- changed
  console.log("DigitalSignatureContract deployed to:", await digitalSignature.getAddress());

  // Deploy CertificateContract
  const CertificateFactory = await ethers.getContractFactory("CertificateContract");
  const certificateContract = await CertificateFactory.deploy(
    await accessControl.getAddress(),
    await digitalSignature.getAddress()
  );
  await certificateContract.waitForDeployment(); // <-- changed
  console.log("CertificateContract deployed to:", await certificateContract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
