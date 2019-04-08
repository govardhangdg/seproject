pragma solidity 0.4.25;

contract Service {
    
    // address public payable provider;
    address public provider;
    bool public working;
    bool public tracking;
    uint256 public endTrackingTime;

    event trackingEvent (
        bool active,
        uint256 endTrackingTime
    );

    event workingEvent (
        bool active
    );

    constructor() payable public {
        provider = msg.sender;
        tracking = false;
        working = false;
        endTrackingTime = 0;
    }
    
    function startTracking(uint8 _time) public payable {
        require(tracking == false && working == false,"conditions for startTracking not met");
        require(msg.value == 5 * _time * 1e18,"proper ether value not sent");
        provider.transfer(msg.value);
        tracking = true;
        endTrackingTime = block.timestamp + (_time * 3600);
        emit trackingEvent(tracking,endTrackingTime);
    }
    
    function startWorking() public payable {
        require(working == false && tracking == true,"conditions for startWorking not met");
        require(block.timestamp < endTrackingTime,"endTrackingTime already passed");
        require(msg.value == 4 * 1e18,"proper ether value not sent");
        provider.transfer(msg.value);
        working = true;
        emit workingEvent(working);
    }
    
    function stopWorking() public {
        require(working == true && tracking == true,"conditions for stopWorking not met");
        working = false;
        emit workingEvent(working);
    }
    
    function stopTracking() public {
        require(tracking == true,"conditions for stopTracking not met");
        working = false;
        tracking = false;
        endTrackingTime = 0;
        emit trackingEvent(tracking,endTrackingTime);
    }
}