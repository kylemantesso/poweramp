// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./PowerAmpToken.sol";

contract PowerAmpDemandResponse {
    struct Event {
        uint256 startTimestamp;
        uint256 endTimestamp;
        string name;
    }

    struct OptedInEvent {
        uint256 eventId;
        uint256 optedInTimestamp;
        uint256 estimatedEnergyUsage;
        uint256 actualEnergyUsage;
        uint256 energySaving;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventId;
    address public admin;
    PowerAmpToken public powerAmpToken;

    mapping(address => OptedInEvent[]) public optedInEvents;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor(address _tokenAddress) {
        admin = msg.sender;
        powerAmpToken = PowerAmpToken(_tokenAddress);
    }

    function createEvent(uint256 _startTimestamp, uint256 _endTimestamp, string memory _name) external onlyAdmin {
        require(_startTimestamp < _endTimestamp, "Invalid event timestamps");

        eventId++;
        events[eventId].startTimestamp = _startTimestamp;
        events[eventId].endTimestamp = _endTimestamp;
        events[eventId].name = _name;
    }

    function getEvents() external view returns (Event[] memory) {
        Event[] memory eventList = new Event[](eventId);
        for (uint256 i = 1; i <= eventId; i++) {
            eventList[i - 1] = events[i];
        }
        return eventList;
    }

    function optInToEvent(uint256 _eventId) external {
        require(_eventId <= eventId, "Invalid event ID");
        require(events[_eventId].startTimestamp > block.timestamp, "Event has already started");
        require(optedInEvents[msg.sender].length == 0, "Already opted in");

        optedInEvents[msg.sender].push(
            OptedInEvent({
                eventId: _eventId,
                optedInTimestamp: block.timestamp,
                estimatedEnergyUsage: 0,
                actualEnergyUsage: 0,
                energySaving: 0
            })
        );
    }

    function assignEstimatedEnergyUsage(uint256 _eventId, address[] calldata _users, uint256[] calldata _estimatedUsages) external onlyAdmin {
        require(_eventId <= eventId, "Invalid event ID");
        require(events[_eventId].startTimestamp > block.timestamp, "Event has already started");
        require(_users.length == _estimatedUsages.length, "Mismatch between user count and estimated usage count");

        for (uint256 i = 0; i < _users.length; i++) {
            address user = _users[i];
            uint256 estimatedUsage = _estimatedUsages[i];

            require(optedInEvents[user].length > 0, "User has not opted into any event");
            require(optedInEvents[user][0].eventId == _eventId, "User has not opted into this event");
            require(optedInEvents[user][0].estimatedEnergyUsage == 0, "Estimated usage already assigned");

            optedInEvents[user][0].estimatedEnergyUsage = estimatedUsage;
        }
    }

    function addActualEnergyUsage(uint256 _eventId, address[] calldata _users, uint256[] calldata _actualUsages) external onlyAdmin {
        require(_eventId <= eventId, "Invalid event ID");
        require(events[_eventId].endTimestamp < block.timestamp, "Event has not ended yet");
        require(_users.length == _actualUsages.length, "Mismatch between user count and actual usage count");

        for (uint256 i = 0; i < _users.length; i++) {
            address user = _users[i];
            uint256 actualUsage = _actualUsages[i];

            require(optedInEvents[user].length > 0, "User has not opted into any event");
            require(optedInEvents[user][0].eventId == _eventId, "User has not opted into this event");
            require(optedInEvents[user][0].actualEnergyUsage == 0, "Actual usage already added");

            optedInEvents[user][0].actualEnergyUsage = actualUsage;
            optedInEvents[user][0].energySaving = optedInEvents[user][0].estimatedEnergyUsage - actualUsage;

            if (optedInEvents[user][0].energySaving > 0) {
                uint256 tokensToAward = optedInEvents[user][0].energySaving * 100;
                powerAmpToken.transfer(user, tokensToAward);
            }
        }
    }

    function getOptedInEvents() external view returns (OptedInEvent[] memory) {
        return optedInEvents[msg.sender];
    }
}