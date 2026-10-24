const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyTraceability Smart Contract", function () {
  let HoneyTraceability, honeyTraceability, owner, beekeeper, lab, processor, consumer;

  beforeEach(async function () {
    [owner, beekeeper, lab, processor, consumer] = await ethers.getSigners();
    HoneyTraceability = await ethers.getContractFactory("HoneyTraceability");
    honeyTraceability = await HoneyTraceability.deploy();
    await honeyTraceability.waitForDeployment();

    // Authorize roles
    await honeyTraceability.setBeekeeperAuthorization(beekeeper.address, true);
    await honeyTraceability.setLabAuthorization(lab.address, true);
    await honeyTraceability.setProcessorAuthorization(processor.address, true);
  });

  it("should deploy with owner authorized for all supply chain roles", async function () {
    expect(await honeyTraceability.owner()).to.equal(owner.address);
    expect(await honeyTraceability.authorizedLabs(lab.address)).to.equal(true);
    expect(await honeyTraceability.authorizedProcessors(processor.address)).to.equal(true);
  });

  it("should register a honey batch with canonical hash", async function () {
    const batchId = "HC-2026-H04-B001";
    const canonicalHash = ethers.keccak256(ethers.toUtf8Bytes("canonical-batch-payload"));

    await honeyTraceability.connect(beekeeper).registerBatch(batchId, canonicalHash, "Initial harvest");

    const total = await honeyTraceability.getTotalBatches();
    expect(total).to.equal(1n);

    const verification = await honeyTraceability.verifyBatchIntegrity(batchId, canonicalHash);
    expect(verification.exists).to.equal(true);
    expect(verification.hashMatches).to.equal(true);
    expect(verification.onChainHash).to.equal(canonicalHash);
  });

  it("should fail integrity verification if client computed hash differs", async function () {
    const batchId = "HC-2026-H04-B001";
    const canonicalHash = ethers.keccak256(ethers.toUtf8Bytes("canonical-batch-payload"));
    const tamperedHash = ethers.keccak256(ethers.toUtf8Bytes("tampered-payload"));

    await honeyTraceability.connect(beekeeper).registerBatch(batchId, canonicalHash, "Initial harvest");

    const verification = await honeyTraceability.verifyBatchIntegrity(batchId, tamperedHash);
    expect(verification.exists).to.equal(true);
    expect(verification.hashMatches).to.equal(false);
  });

  it("should record laboratory test outcome by authorized lab", async function () {
    const batchId = "HC-2026-H04-B001";
    const canonicalHash = ethers.keccak256(ethers.toUtf8Bytes("canonical-batch-payload"));
    const qualityHash = ethers.keccak256(ethers.toUtf8Bytes("lab-assay-fssai-compliant"));

    await honeyTraceability.connect(beekeeper).registerBatch(batchId, canonicalHash, "Initial harvest");
    await honeyTraceability.connect(lab).recordQualityTest(batchId, qualityHash, true, "Passed FSSAI 2020");

    const verification = await honeyTraceability.verifyBatchIntegrity(batchId, canonicalHash);
    expect(verification.status).to.equal(2n); // BatchStatus.QualityVerified
    expect(verification.qualityTestHash).to.equal(qualityHash);
  });

  it("should prevent unauthorized entities from submitting laboratory tests", async function () {
    const batchId = "HC-2026-H04-B001";
    const canonicalHash = ethers.keccak256(ethers.toUtf8Bytes("canonical-batch-payload"));
    const qualityHash = ethers.keccak256(ethers.toUtf8Bytes("lab-assay-fssai-compliant"));

    await honeyTraceability.connect(beekeeper).registerBatch(batchId, canonicalHash, "Initial harvest");

    await expect(
      honeyTraceability.connect(consumer).recordQualityTest(batchId, qualityHash, true, "Unauthorized")
    ).to.be.revertedWith("Caller is not an authorized quality laboratory");
  });

  it("should append immutable trace events for each milestone", async function () {
    const batchId = "HC-2026-H04-B001";
    const canonicalHash = ethers.keccak256(ethers.toUtf8Bytes("canonical-batch-payload"));
    const qualityHash = ethers.keccak256(ethers.toUtf8Bytes("lab-report"));

    await honeyTraceability.connect(beekeeper).registerBatch(batchId, canonicalHash, "Initial harvest");
    await honeyTraceability.connect(lab).recordQualityTest(batchId, qualityHash, true, "Lab Pass");

    const count = await honeyTraceability.getBatchEventCount(batchId);
    expect(count).to.equal(2n);

    const event0 = await honeyTraceability.getBatchEvent(batchId, 0);
    expect(event0.eventType).to.equal("BATCH_HARVESTED");

    const event1 = await honeyTraceability.getBatchEvent(batchId, 1);
    expect(event1.eventType).to.equal("LAB_TEST_PASSED");
  });
});
