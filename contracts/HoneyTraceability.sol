// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HoneyTraceability
 * @notice Tamper-evident honey batch verification and lifecycle ledger for Smart India Hackathon 2026 (SIH26021)
 * @dev Stores only cryptographic hashes and state proofs on-chain; all detailed reports are stored off-chain.
 */
contract HoneyTraceability {
    enum BatchStatus {
        Harvested,               // 0
        QualityTestingPending,   // 1
        QualityVerified,         // 2
        Processing,              // 3
        Packaged,                // 4
        ReadyForDistribution,    // 5
        RecalledOrFlagged        // 6
    }

    struct TraceEvent {
        string eventType;
        bytes32 dataHash;
        address actor;
        uint256 timestamp;
        string remarks;
    }

    struct BatchRecord {
        string batchId;
        bytes32 canonicalHash;      // Canonical SHA-256 hash of batch core attributes
        bytes32 qualityTestHash;    // Hash of certified laboratory report
        bytes32 processingHash;     // Hash of processing & packaging parameters
        BatchStatus status;
        address registeredBy;
        address verifiedByLab;
        uint256 createdAt;
        uint256 updatedAt;
        bool exists;
    }

    address public owner;

    // Authorized role registries
    mapping(address => bool) public authorizedLabs;
    mapping(address => bool) public authorizedProcessors;
    mapping(address => bool) public authorizedBeekeepers;

    // Batch storage
    mapping(string => BatchRecord) private batches;
    mapping(string => TraceEvent[]) private batchEvents;
    string[] private allBatchIds;

    // Events
    event BatchRegistered(string indexed batchId, bytes32 canonicalHash, address indexed beekeeper, uint256 timestamp);
    event QualityTestRecorded(string indexed batchId, bytes32 testHash, address indexed lab, bool passed, uint256 timestamp);
    event ProcessingRecorded(string indexed batchId, bytes32 processHash, BatchStatus newStatus, address indexed processor, uint256 timestamp);
    event BatchStatusUpdated(string indexed batchId, BatchStatus status, address indexed actor, string reason, uint256 timestamp);
    event LabAuthorized(address indexed lab, bool status);
    event ProcessorAuthorized(address indexed processor, bool status);
    event BeekeeperAuthorized(address indexed beekeeper, bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute");
        _;
    }

    modifier onlyAuthorizedLab() {
        require(authorizedLabs[msg.sender] || msg.sender == owner, "Caller is not an authorized quality laboratory");
        _;
    }

    modifier onlyAuthorizedProcessor() {
        require(authorizedProcessors[msg.sender] || msg.sender == owner, "Caller is not an authorized processor");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedLabs[msg.sender] = true;
        authorizedProcessors[msg.sender] = true;
        authorizedBeekeepers[msg.sender] = true;
    }

    // Role Management
    function setLabAuthorization(address lab, bool status) external onlyOwner {
        authorizedLabs[lab] = status;
        emit LabAuthorized(lab, status);
    }

    function setProcessorAuthorization(address processor, bool status) external onlyOwner {
        authorizedProcessors[processor] = status;
        emit ProcessorAuthorized(processor, status);
    }

    function setBeekeeperAuthorization(address beekeeper, bool status) external onlyOwner {
        authorizedBeekeepers[beekeeper] = status;
        emit BeekeeperAuthorized(beekeeper, status);
    }

    /**
     * @notice Register a newly harvested honey batch
     * @param batchId Unique identifier (e.g., HC-2026-H04-B001)
     * @param canonicalHash SHA-256 hash of canonical harvest payload
     * @param remarks Initial remarks or metadata URI
     */
    function registerBatch(
        string calldata batchId,
        bytes32 canonicalHash,
        string calldata remarks
    ) external {
        require(bytes(batchId).length > 0, "Batch ID cannot be empty");
        require(!batches[batchId].exists, "Batch already registered");
        require(canonicalHash != bytes32(0), "Invalid canonical hash");

        batches[batchId] = BatchRecord({
            batchId: batchId,
            canonicalHash: canonicalHash,
            qualityTestHash: bytes32(0),
            processingHash: bytes32(0),
            status: BatchStatus.Harvested,
            registeredBy: msg.sender,
            verifiedByLab: address(0),
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true
        });

        allBatchIds.push(batchId);

        batchEvents[batchId].push(TraceEvent({
            eventType: "BATCH_HARVESTED",
            dataHash: canonicalHash,
            actor: msg.sender,
            timestamp: block.timestamp,
            remarks: remarks
        }));

        emit BatchRegistered(batchId, canonicalHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Record laboratory quality verification
     * @param batchId Target batch ID
     * @param qualityHash SHA-256 hash of certified laboratory analysis
     * @param passed Whether the batch meets regulatory quality thresholds (Moisture <= 20%, HMF <= 40 mg/kg)
     * @param labNotes Summary notes from testing
     */
    function recordQualityTest(
        string calldata batchId,
        bytes32 qualityHash,
        bool passed,
        string calldata labNotes
    ) external onlyAuthorizedLab {
        require(batches[batchId].exists, "Batch not found");
        BatchRecord storage batch = batches[batchId];

        batch.qualityTestHash = qualityHash;
        batch.verifiedByLab = msg.sender;
        batch.updatedAt = block.timestamp;
        batch.status = passed ? BatchStatus.QualityVerified : BatchStatus.RecalledOrFlagged;

        batchEvents[batchId].push(TraceEvent({
            eventType: passed ? "LAB_TEST_PASSED" : "LAB_TEST_FAILED",
            dataHash: qualityHash,
            actor: msg.sender,
            timestamp: block.timestamp,
            remarks: labNotes
        }));

        emit QualityTestRecorded(batchId, qualityHash, msg.sender, passed, block.timestamp);
    }

    /**
     * @notice Record processing and packaging events
     */
    function recordProcessingAndPackaging(
        string calldata batchId,
        bytes32 processingHash,
        BatchStatus newStatus,
        string calldata processNotes
    ) external onlyAuthorizedProcessor {
        require(batches[batchId].exists, "Batch not found");
        require(
            newStatus == BatchStatus.Processing ||
            newStatus == BatchStatus.Packaged ||
            newStatus == BatchStatus.ReadyForDistribution,
            "Invalid status for processor"
        );

        BatchRecord storage batch = batches[batchId];
        batch.processingHash = processingHash;
        batch.status = newStatus;
        batch.updatedAt = block.timestamp;

        batchEvents[batchId].push(TraceEvent({
            eventType: newStatus == BatchStatus.ReadyForDistribution ? "READY_FOR_DISTRIBUTION" : "PROCESSING_UPDATE",
            dataHash: processingHash,
            actor: msg.sender,
            timestamp: block.timestamp,
            remarks: processNotes
        }));

        emit ProcessingRecorded(batchId, processingHash, newStatus, msg.sender, block.timestamp);
    }

    /**
     * @notice Flag or recall a batch upon quality anomaly or authority directive
     */
    function flagOrRecallBatch(string calldata batchId, string calldata reason) external {
        require(batches[batchId].exists, "Batch not found");
        require(msg.sender == owner || authorizedLabs[msg.sender], "Unauthorized to flag batch");

        BatchRecord storage batch = batches[batchId];
        batch.status = BatchStatus.RecalledOrFlagged;
        batch.updatedAt = block.timestamp;

        batchEvents[batchId].push(TraceEvent({
            eventType: "BATCH_FLAGGED_OR_RECALLED",
            dataHash: keccak256(abi.encodePacked(batchId, reason, block.timestamp)),
            actor: msg.sender,
            timestamp: block.timestamp,
            remarks: reason
        }));

        emit BatchStatusUpdated(batchId, BatchStatus.RecalledOrFlagged, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Public verification function to test whether a batch's calculated canonical hash matches on-chain record
     */
    function verifyBatchIntegrity(
        string calldata batchId,
        bytes32 clientComputedHash
    ) external view returns (
        bool exists,
        bool hashMatches,
        BatchStatus status,
        bytes32 onChainHash,
        bytes32 qualityTestHash,
        uint256 timestamp
    ) {
        if (!batches[batchId].exists) {
            return (false, false, BatchStatus.Harvested, bytes32(0), bytes32(0), 0);
        }

        BatchRecord memory record = batches[batchId];
        bool matches = (record.canonicalHash == clientComputedHash);

        return (
            true,
            matches,
            record.status,
            record.canonicalHash,
            record.qualityTestHash,
            record.createdAt
        );
    }

    /**
     * @notice Retrieve batch full traceability events count
     */
    function getBatchEventCount(string calldata batchId) external view returns (uint256) {
        return batchEvents[batchId].length;
    }

    /**
     * @notice Retrieve a specific event by index
     */
    function getBatchEvent(string calldata batchId, uint256 index) external view returns (
        string memory eventType,
        bytes32 dataHash,
        address actor,
        uint256 timestamp,
        string memory remarks
    ) {
        require(batches[batchId].exists, "Batch not found");
        require(index < batchEvents[batchId].length, "Index out of bounds");
        TraceEvent memory e = batchEvents[batchId][index];
        return (e.eventType, e.dataHash, e.actor, e.timestamp, e.remarks);
    }

    /**
     * @notice Total registered batches
     */
    function getTotalBatches() external view returns (uint256) {
        return allBatchIds.length;
    }
}
