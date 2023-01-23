// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Devote {
    uint256 internal noOfcandidate = 0;
    address private votingOrganizer;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Candidate {
        address candidateAddress;
        string name;
        string age;
        string image;
        string description;
        uint256 voteCount;
    }

    struct Voter {
        address voterAddress;
        uint256 voterAllowed;
        uint256 voterVote;
        bool voterVoted;
    }

    mapping(uint256 => Candidate) public candidates;

    mapping(address => Voter) public voters;

    address[] public votersAddress;

    constructor() {
        votingOrganizer = msg.sender;
    }

    /**
     * @dev allow users to add a new candidate to the campaign
     * @param  _address is the address of the candidate
     * @param _name is the name of the candidate
     * @param _age is the age of the candidate
     * @param _description is the description of the candidate
     */
    function addCandidate(
        address _address,
        string calldata _name,
        string calldata _age,
        string calldata _image,
        string calldata _description
    ) public {
        require(bytes(_name).length > 0, "String is invalid");
        require(bytes(_age).length > 0, "String is invalid");
        require(bytes(_image).length > 0, "String is invalid");
        require(bytes(_description).length > 0, "String is invalid");
        require(
            msg.sender == votingOrganizer,
            "Oly Organizer can set Candidate"
        );
        Candidate storage candidate = candidates[noOfcandidate];

        candidate.candidateAddress = _address;
        candidate.name = _name;
        candidate.age = _age;
        candidate.image = _image;
        candidate.description = _description;
        candidate.voteCount = 0;

        noOfcandidate++;
    }

    //return Candidate data
    function getCandidate(
        uint256 _index
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        return (
            candidates[_index].candidateAddress,
            candidates[_index].name,
            candidates[_index].age,
            candidates[_index].image,
            candidates[_index].description,
            candidates[_index].voteCount
        );
    }

    /**
     * @dev allow organizers to give voting right to voter
     */

    function giveVotingRight(address _address) external {
        require (_address != address(0), "Address not valid");
        require(
            msg.sender == votingOrganizer,
            "Only organizer can give right to vote"
        );
        Voter storage voter = voters[_address];
        require(voter.voterAllowed == 0);

        voter.voterAddress = _address;
        voter.voterAllowed = 1;
        voter.voterVote = 1000; // the 1000 is just a place holder the real value will be updated when the voter cast his vote
        voter.voterVoted = false;

        votersAddress.push(_address);
    }

    function removeVotingRight(address _address) external {
        require(
            msg.sender == votingOrganizer,
            "Only organizer can give right to vote"
        );
        Voter storage voter = voters[_address];
        require(voter.voterAllowed == 1);

        voter.voterAllowed = 0;

    }

    /**
     * @dev allow users to cast their vote
     * @notice only users that has the right to vote can vote.
     */
    function vote(uint256 candidateId, uint256 _ammount) public payable {
        Voter storage voter = voters[msg.sender];
        require(!voter.voterVoted, "You have already voted");
        require(voter.voterAllowed != 0, "You have no right to vote");
        require(
            candidates[candidateId].candidateAddress != msg.sender,
            "You cannot vote for your self"
        );
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                candidates[candidateId].candidateAddress,
                _ammount
            ),
            "Transfer failed."
        );

        voter.voterVoted = true;
        voter.voterVote = candidateId;

        candidates[candidateId].voteCount += voter.voterAllowed;
    }


    // returns the length of candidates in the mapping
    function getCandidateLength() public view returns (uint256) {
        return (noOfcandidate);
    }

    // returns a list of voters address
    function getVotersList() public view returns (address[] memory) {
        return votersAddress;
    }

    // returns the length of addresses that has the right to vote
    function getVoterLength() public view returns (uint256) {
        return votersAddress.length;
    }
}
