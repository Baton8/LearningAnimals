// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../contracts/QuizNFT.sol";
import {AnimalNFT} from "../contracts/AnimalNFT.sol";

contract Track is Initializable {

    address TokenAddress = 0x91769c8fDDc589306ba16d0b367a26E035bF5bDA;
    AnimalNFT animal;
    IERC20 public lac = ERC20(TokenAddress);

    using Counters for Counters.Counter;
    Counters.Counter private _trackIdCounter;

    // initialize
    string public title;
    string public description;
    address owner;
    uint trackId;
    uint public quizEntryPrize = 1 * 10**18;
    uint public quizWinPrize = 100 * 10**18;
    uint public quizStartTime;
    uint public quizEndTime;
    uint public quizCreateEntryStartTime;
    uint public quizCreateEntryEndTime;
    
    QuizNFT[] public quizzes;
    QuizNFT[] public selectedQuizzes;

    mapping(address => uint) public earnAmountOf;
    mapping(QuizNFT => uint) trackIdOf;
    
    constructor() {}

    function restartTrack(string memory _title, string memory _description) public  { 
        title = _title;
        description = _description;
        owner = msg.sender;
        trackId = _trackIdCounter.current();
        _trackIdCounter.increment();
        quizCreateEntryStartTime = block.timestamp;
        quizCreateEntryEndTime = block.timestamp + 300 seconds;
        quizStartTime =  block.timestamp + 300 seconds;
        quizEndTime = block.timestamp + 600 seconds;
    }

    //-------------------------------------------------------------------------
    // PUBLIC FUNC
    //-------------------------------------------------------------------------

      function createQuiz(string memory _question, string[4] memory _choices, uint _correctIndex) public {
        uint newQuizId = quizzes.length;
         QuizNFT newQuiz = new QuizNFT(newQuizId, _question, _choices, _correctIndex);
         quizzes.push(newQuiz);
         trackIdOf[newQuiz] = trackId;
      }

     function answerQuestion(uint[] memory _choosedIndices, uint _playTime) public {
        require(block.timestamp > quizStartTime, "Quiz not starts yet");
        require(block.timestamp < quizEndTime, "Already quiz ended");
        require(lac.balanceOf(address(this)) >= quizEntryPrize, "not enough token balanace");
        require(owner != msg.sender, "Owner can't entry the quiz");

        earnAmountOf[msg.sender] += quizEntryPrize;

        uint _correctAnswerCount = 0;
        for(uint i = 0; i < 5; i++) { 
            if (_choosedIndices[i] == selectedQuizzes[i].getCorrectIndex()) {
                _correctAnswerCount++;
            }
        }
        
        if (_correctAnswerCount == 5) {
            earnAmountOf[msg.sender] += quizWinPrize;
        }
        if (_playTime == _playTime) {}
     }

     function withdraw() public payable {
         lac.transfer(msg.sender, earnAmountOf[msg.sender]);
     }

     function getNFTofWinQuiz(uint _tokenId) public {
         animal.transfer(owner, msg.sender, _tokenId);
     }

     function startQuiz() public {
        if (selectedQuizzes.length == 0) {
             selectedQuizzes.push(quizzes[0]);
             selectedQuizzes.push(quizzes[1]);
             selectedQuizzes.push(quizzes[2]);
             selectedQuizzes.push(quizzes[3]);
             selectedQuizzes.push(quizzes[4]);
         }
     }


    //-------------------------------------------------------------------------
    // VIEW FUNCTIONS
    //-------------------------------------------------------------------------

     function getSelectedQuizzes(uint _questionIndex) public view returns(string memory, string[] memory) {
        string memory question = selectedQuizzes[_questionIndex].getQuestion();
        string[] memory choices = selectedQuizzes[_questionIndex].getChoices();
        return (question, choices);
     }

     function getQuizzes() public view returns(QuizNFT[] memory) {
        return quizzes;
     }

      function isEndTrack() public view returns (bool) {
         return block.timestamp > quizEndTime;
      }
}