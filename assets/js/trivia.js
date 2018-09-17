const questions = [ "How many pokemon are there total as of Ultra Sun/Moon?",
    "How many pokemon were there in the original Generation I games (Red/Blue/Yellow)?]",
    "How many different ways can you evolve Eevee?",
    "What HM became a TM starting in Ruby/Sapphire?",
    "Who is the name of the Player's Rival in Generation I who eventually became Viridian City's Gym Leader?",
    "What was the signature ability of Machop's evolutionary line?",
    "What was the only core series of games where both parents of the player character was present?",
    "What two pokemon adorned the box art for Pokemon X/Y?"];

const multipleChoiceArr = [
    ["721", "807", "506", "802", "812"],
    ["150", "251", "151", "250", "386"],
    ["3", "8", "7", "5", "6"],
    ["Cut", "Fly", "Surf", "Strength", "Flash"],
    ["Red", "Blue", "Green", "Leaf", "Gary"],
    ["Guts", "No Guard", "Anger Point", "Steadfast", "Vital Spirit"],
    ["Gold/Silver/Crystal" , "Ruby/Sapphire/Emerald", "Diamond/Pearl/Platinum", "Black/White", "Red/Blue/Yellow"],
    ["Xerneas/Yveltal", "Groudon/Kyogre", "Lugia/Ho-oh", "Reshiram/Zekrom", "Solgaleo/Lunala"]]; 

const correctAnswer = ["807", "151", "8", "Flash", "Blue", "No Guard", "Ruby/Sapphire/Emerald", "Xerneas/Yveltal"];

const answerImg = ["","","","assets/gif/Flash_HGSS_OW.png","","","","",""]


var multipleChoice;  // Array of the multiple choice answers for the current question
var answer;    // The correct answer to the current question
var timer;     // todo

// Player counters
var right = 0;
var wrong = 0;
var timedOut = 0;

var alreadyAsked = [];  // Questions already answered by index


// function

    // the index of the random question
    var questionIndex;

    do 
        questionIndex = Math.floor(Math.random() * questions.length);
    while (alreadyAsked.includes(questionIndex));  // makes sure question chosen is new

    // Displays question string taken from the questions array randomly
    $('#question').html(questions[questionIndex]);
    // Get the array of multiple choice responses for the question and shuffles
    multipleChoice = shuffle(multipleChoiceArr[questionIndex]);
    // Get correct answer to the chosen question as a string
    answer = correctAnswer[questionIndex];

    // Display multiple choices in html
    for (var i = 0; i < multipleChoice.length; i++) {
        $('#answers').append("<li class = 'multipleChoice p-1'>"+multipleChoice[i]+"</li>");
    }

    $('#answers').on("click", ".multipleChoice", function(){
        if ($(this).text() === answer) {
            $('#result').append("Correct!")
            right++;
        }
        else {
            $('#result').append("Incorrect")
            wrong++;
        }
        $('#answers').html("");
    });


// This method of shuffling goes through each index of the array once and randomly swaps it with another.  Returns the same 
function shuffle(arr) {
    var index = arr.length;
    var temp; 
    var randomIndex;
  
    // While there remain elements to shuffle...
    while (index !== 0) { 
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * index);
      index--;
  
      // And swap it with the current element.
      temp = arr[index];
      arr[index] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
    return arr;
}