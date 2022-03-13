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

    address payable[] solvers;
    address payable[] writers;
    address payable[] quizWinners;
    address payable[] bestQuizWinners;

    using Counters for Counters.Counter;
    Counters.Counter private _trackIdCounter;

    // initialize
    string public title;
    string public description;
    address owner;
    uint trackId;
    uint public quizEntryPrize = 1;
    uint public quizWinPrize = 100;
    uint public quizStartTime;
    uint public quizEndTime;
    uint public quizCreateEntryStartTime;
    uint public quizCreateEntryEndTime;
    
    QuizNFT[] public quizs;
    QuizNFT[] public selectedQuiz;

    mapping(address => uint[]) answers;
    mapping(address => uint) earnAmount;
    mapping(address => uint) answerTimes;
    mapping(address => bool) hasEntryQuiz;
    mapping(address => bool) hasQuizPrizeClaimed;
    mapping(address => bool) hasBestQuizPrizeClaimed;
    
    constructor() {}

    function initialize(string memory _title, string memory _description) public initializer { 
        title = _title;
        description = _description;
        owner = msg.sender;
        trackId = _trackIdCounter.current();
        _trackIdCounter.increment();
        quizCreateEntryStartTime = block.timestamp;
        quizCreateEntryEndTime = block.timestamp + 30 seconds;
        quizStartTime =  block.timestamp + 60 seconds;
        quizEndTime = block.timestamp + 120 seconds;
    }

    //-------------------------------------------------------------------------
    // PUBLIC FUNC
    //-------------------------------------------------------------------------

      function createQuiz(string memory _question, string[4] memory _choices, uint _correctIndex) public {
         QuizNFT newQuiz = new QuizNFT(quizs.length, _question, _choices, _correctIndex);
         quizs.push(newQuiz);
      }

     function answerQuestion(uint[] memory _choiceIndexs, uint time) public {
        require(block.timestamp > quizStartTime, "Quiz not starts yet");
        require(block.timestamp < quizEndTime, "Already quiz ended");
        require(_choiceIndexs.length == quizs.length, "Answer Index Count and Quiz count is not same");
        require(lac.balanceOf(address(this)) >= quizEntryPrize, "not enought token balanace");
        require(owner != msg.sender, "Owner can't entry the quiz");

        solvers.push(payable(msg.sender));
        answers[msg.sender] = _choiceIndexs;
        answerTimes[msg.sender] = time;

        earnAmount[msg.sender] += quizEntryPrize;
     }

     function withdraw() public payable {
         lac.transfer(msg.sender, earnAmount[msg.sender]);
     }

     function getNFTofWinQuiz(uint _tokenId) public {
         animal.transfer(owner, msg.sender, _tokenId);
     }

    //-------------------------------------------------------------------------
    // OWNER FUNC
    //-------------------------------------------------------------------------

      function selectWinnerForQuiz() public {

         require(owner == msg.sender, "Only Owner can execute");
         require(block.timestamp > quizEndTime, "Select winner can call when event end");

         for(uint i = 0 ; i <solvers.length; i++) {
            bool allCorrect = true;
            uint[] memory userAnswers = answers[solvers[i]];

            for(uint j = 0; j < quizs.length; j++) {
               
               if(userAnswers[j] != quizs[j].getCorrectIndex()) {
                  allCorrect = false;
               }
            }

            if(allCorrect == true) {
               hasQuizPrizeClaimed[solvers[i]] = false;
               quizWinners.push(solvers[i]);
               earnAmount[solvers[i]] += quizWinPrize;
            } 
         }
      }

      function selectQuestionQuiz() public {

         require(owner == msg.sender, "Only Owner can execute");

         uint questionCount = 5;
         if(quizs.length < questionCount) {
            questionCount = quizs.length;
         }

         for(uint i = 0; i < questionCount; i++) {
            uint randomIndex = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, quizs.length)));
            selectedQuiz.push(quizs[randomIndex]);
            bestQuizWinners.push(payable(quizs[randomIndex].getOwner()));
         }
      }

    //-------------------------------------------------------------------------
    // VIEW FUNCTIONS
    //-------------------------------------------------------------------------

     function getSelectedQuizzes(uint _questionIndex) public view returns(string memory, string[] memory) {
        string memory question = quizs[_questionIndex].getQuestion();
        string[] memory choices = quizs[_questionIndex].getChoices();
        return (question, choices);
     }

     function getQuizzes() public view returns(QuizNFT[] memory) {
        return quizs;
     }
    
     function checkQuizPrize() public view returns(bool) { 
        bool hasPrize = false;
        for(uint i = 0; i < quizWinners.length; i++) {
           if(quizWinners[i] == msg.sender) {
              hasPrize = true;
           }
        }
        return hasPrize;
      }

      function checkBestQuizPrize() public view returns(bool) { 
        bool hasPrize = false;
        for(uint i = 0; i < bestQuizWinners.length; i++) {

           if(bestQuizWinners[i] == msg.sender) {
              hasPrize = true;
           }
        }
        return hasPrize;
      }

      function getTrackResult() public view returns(uint, uint, bool, bool) {
         uint correctCount = 0;
         uint[] memory userAnswers = answers[msg.sender];
         for(uint i = 0; i < quizs.length; i++) {
            if(userAnswers[i] == quizs[i].getCorrectIndex()) {
               correctCount++;
            }
         }

         return(earnAmount[msg.sender], correctCount, checkQuizPrize(), checkBestQuizPrize());
      }

      function isEndTrack() public view returns (bool) {
         return block.timestamp > quizEndTime;
      }
}