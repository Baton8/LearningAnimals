// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../contracts/QuizNFT.sol";
import {AnimalNFT} from "../contracts/AnimalNFT.sol";

contract Track is Initializable {

    address TokenAddress = 0xeCb06A68aF039A044586328Ab73059f0b297922f;
    AnimalNFT animal;
    IERC20 public lac = ERC20(TokenAddress);

    using Counters for Counters.Counter;
    Counters.Counter private _trackIdCounter;

    // init
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
    uint[] public prizeNftIds;
    uint internal correctAllQuizzesPlayerCount;
    
    // perma
    QuizNFT[] public quizzes;
    mapping(address => uint) public earnAmountOf; // earn amount of an adress
    mapping(address => uint[]) public earnNftTokenIdsOf; // earn nft token IDs of an adress
    mapping(QuizNFT => uint) trackIdOf; // track ID of quiz
    mapping(uint => QuizNFT[]) selectedQuizzesOf; // selected quizzes of a track
    mapping(uint => uint) numberOfQuizOf; // number of quizzes of a track
    
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

        // for play prize
        prizeNftIds.push(animal.mint(address(this), trackId));
        prizeNftIds.push(animal.mint(address(this), trackId));
        prizeNftIds.push(animal.mint(address(this), trackId));
        // for create quiz prize
        prizeNftIds.push(animal.mint(address(this), trackId));
        prizeNftIds.push(animal.mint(address(this), trackId));
        prizeNftIds.push(animal.mint(address(this), trackId));
        prizeNftIds.push(animal.mint(address(this), trackId));
        prizeNftIds.push(animal.mint(address(this), trackId));
    }

    //-------------------------------------------------------------------------
    // PUBLIC FUNCTIONS
    //-------------------------------------------------------------------------

      function createQuiz(string memory _question, string[4] memory _choices, uint _correctIndex) public {
        uint newQuizId = quizzes.length;
         QuizNFT newQuiz = new QuizNFT(newQuizId, _question, _choices, _correctIndex);
         quizzes.push(newQuiz);
         trackIdOf[newQuiz] = trackId;
         numberOfQuizOf[trackId] += 1;
      }

     function answerQuestion(uint[] memory _choosedIndices, uint _playTime) public {
        require(block.timestamp > quizStartTime, "Quiz not starts yet");
        require(block.timestamp < quizEndTime, "Already quiz ended");
        require(lac.balanceOf(address(this)) >= quizEntryPrize, "not enough token balanace");
        require(owner != msg.sender, "Owner can't entry the quiz");

        earnAmountOf[msg.sender] += quizEntryPrize;

        uint _correctAnswerCount = 0;
        for(uint i = 0; i < 5; i++) { 
            if (_choosedIndices[i] == selectedQuizzesOf[trackId][i].getCorrectIndex()) {
                _correctAnswerCount++;
            }
        }
        
        if (_correctAnswerCount == 5) {
            correctAllQuizzesPlayerCount += 1;
            if (correctAllQuizzesPlayerCount == 1) {
                earnNftTokenIdsOf[msg.sender].push(prizeNftIds[0]);
            }
            if (correctAllQuizzesPlayerCount == 2) {
                earnNftTokenIdsOf[msg.sender].push(prizeNftIds[1]);
            }
            if (correctAllQuizzesPlayerCount == 3) {
                earnNftTokenIdsOf[msg.sender].push(prizeNftIds[2]);
            }
            earnAmountOf[msg.sender] += quizWinPrize;
        }

        if (_playTime == _playTime) {
            // unused
        }
     }

     function withdraw() public payable {
         lac.transfer(msg.sender, earnAmountOf[msg.sender]);
         earnAmountOf[msg.sender] = 0;
     }

     function transferNft() public payable {
         for(uint i = 0; i < earnNftTokenIdsOf[msg.sender].length; i++) { 
             animal.transfer(address(this), msg.sender, earnNftTokenIdsOf[msg.sender][i]);
         }
     }

     function startQuiz() public {
        if (selectedQuizzesOf[trackId].length == 0) {
             selectedQuizzesOf[trackId].push(quizzes[0]);
             selectedQuizzesOf[trackId].push(quizzes[1]);
             selectedQuizzesOf[trackId].push(quizzes[2]);
             selectedQuizzesOf[trackId].push(quizzes[3]);
             selectedQuizzesOf[trackId].push(quizzes[4]);
         }
     }

    //-------------------------------------------------------------------------
    // VIEW FUNCTIONS
    //-------------------------------------------------------------------------

     function getSelectedQuizzes(uint _questionIndex) public view returns(string memory, string[] memory) {
        string memory question = selectedQuizzesOf[trackId][_questionIndex].getQuestion();
        string[] memory choices = selectedQuizzesOf[trackId][_questionIndex].getChoices();
        return (question, choices);
     }

     function getQuizzes() public view returns(QuizNFT[] memory) {
        QuizNFT[] memory quizzesInCurrectTrack = new QuizNFT[](numberOfQuizOf[trackId]);
        uint j = 0;
        for(uint i = 0; i < quizzes.length; i++) { 
            if (trackIdOf[quizzes[i]] == trackId) {
                quizzesInCurrectTrack[j] = quizzes[i];
                j ++;
            }
        }
        return quizzesInCurrectTrack;
     }

      function isEndTrack() public view returns (bool) {
         return block.timestamp > quizEndTime;
      }

      function earnNfts() public view returns (string[] memory) {
         string[] memory urls = new string[](earnNftTokenIdsOf[msg.sender].length);
         for(uint i = 0; i < earnNftTokenIdsOf[msg.sender].length; i++) { 
             urls[i] = animal.tokenURI(earnNftTokenIdsOf[msg.sender][i]);
         }
         return urls;
      }
}