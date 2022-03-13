// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract QuizNFT {

    uint id;
    address owner;
    address[] favoritoAddress;

    string public question;
    string[] public choices;

    uint public favorite;
    uint public correctIndex;

    constructor(uint _id, string memory _question, string[4] memory _choices, uint _correctIndex) {
        id = _id;
        question = _question;
        choices = _choices;
        favorite = 0;
        correctIndex = _correctIndex;
    }

    function addFavorite(uint amount, address sender) public {
        favorite += amount;
        favoritoAddress.push(sender);
    }

    function getQuiz() public view returns(string memory, string[] memory, uint){
        return (question, choices, correctIndex);
    }

    function getQuestion() public view returns(string memory) {
        return question;
    }

    function getChoices() public view returns(string[] memory) {
        return choices;
    }

    function getCorrectIndex () public view  returns(uint) {
        return correctIndex;
    }

    function getOwner() public view returns(address) {
        return owner;
    }
}