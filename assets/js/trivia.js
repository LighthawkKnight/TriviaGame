const questions = [ "How many pokemon are there total as of Ultra Sun/Moon?",
    "How many pokemon were there in the original Generation I games (Red/Blue/Yellow)?",
    "How many different ways can you evolve Eevee as of Generation VII (Sun/Moon)?",
    "What HM became a TM starting in Ruby/Sapphire?",
    "Who is the name of the Player's Rival in Generation I (Red/Blue/Yellow) who eventually became Viridian City's Gym Leader?",
    "What was the signature ability of Machop's evolutionary line?",
    "What was the only core series of games where both parents of the player character was present?",
    "What two pokemon adorned the box art for Pokemon X/Y?",
    "When a Rowlet evolves into a Decidueye, what new type does it gain and what does it replace?"];
    "What pokemon nature increases Speed but decreases Special Attack?"

// Multiple choice options indexed by the same order as questions[]
const multipleChoiceArr = [
    ["721", "807", "506", "802", "812"],
    ["150", "251", "151", "250", "386"],
    ["3", "8", "7", "5", "6"],
    ["Cut", "Fly", "Surf", "Strength", "Flash"],
    ["Red", "Blue", "Green", "Leaf", "Gary"],
    ["Guts", "No Guard", "Anger Point", "Steadfast", "Vital Spirit"],
    ["Gold/Silver/Crystal" , "Ruby/Sapphire/Emerald", "Diamond/Pearl/Platinum", "Black/White", "Red/Blue/Yellow"],
    ["Xerneas/Yveltal", "Groudon/Kyogre", "Ho-oh/Lugia", "Reshiram/Zekrom", "Solgaleo/Lunala"],
    ["Ghost replaces Grass", "Ghost replaces Flying", "Flying replaces Ghost", "Flying replaces Grass", "Grass replaces Flying"],
    ["Jolly", "Sassy", "Hasty", "Naive", "Timid"]]; 

// The correct answer indexed by the same order as above
const correctAnswer = ["807", "151", "8", "Flash", "Blue", "No Guard", "Ruby/Sapphire/Emerald", "Xerneas/Yveltal", "Ghost replaces Flying", "Jolly"];
// Some trivia to go along with the correct answer, indexed
const trivia = ["It's going to break 4 digits soon enough.  Can you name them all?",
                "If you counted 150, I hope you didn't forget cute little Mew.",
                "That's a lot of potential in one cute little pokemon!",
                "A great change too!  Since there were only a few it was so useless in-battle.",
                "The rival's canon name, since that is his name when you finally meet up with him in G/S/E 3 years later",
                "Their attacks couldn't miss, in return for not being able to dodge.  As you can see, wasn't a problem most of the time.",
                "In every other game, only your Mom is present, who always sees you off on your journey at the start.",
                "Xerneas/Yveltal were the legendary exclusives for X/Y respectively, both of whom were pivotal to the main story.",
                "Hard to believe the swift ninja-like Decidueye evolves from this super cute little Rowlet.",
                "Jolly, Hasty, and Naive increased your speed as well, but sacrificed other stats."]
// Image accompanying answer indexed by the same order as above
const p = "assets/img/"  // Image path
const correctImg = [p+"807pokemon.gif", p+"mew.gif",p+"eeveelutions.gif",p+"hm05flash.png",p+"gary.gif",p+"machamp.gif",
                    p+"delia.gif",p+"xylegendaries.gif",p+"rowlet.gif", p+"totodile.gif"];

// Trivia question vars
var multipleChoice =  [];  // Array of the multiple choice answers for the current question
var answer = "";    // The correct answer to the current question
var answerImg = "";     // The image to show on the result screen related to the correct answer
var answerTrivia = "";  // The trivia snippet for the correct answer
var alreadyAsked = [];  // Questions already answered by index

// Player counter vars
var right = 0;
var wrong = 0;
var timedOut = 0;

// Timer vars
var blinkId;        // holds the setInterval for blinking colon
var intervalId;     // holds the setInterval for timer
var timer = {

    time: 60,
    clockRunning: false,
    isResultPage: false,     // isResultPage is true if the program is in the transition between questions
   
    reset: function(startTime = 30, isResultPage = false) {  
        timer.time = startTime;
        timer.isResultPage = isResultPage;
        $('#seconds').html(startTime);  
    },
   
    start: function() {
        if (!timer.clockRunning) {
            intervalId = setInterval(timer.count, 1000);
            blink();
            timer.clockRunning = true;
        } 
    },

    stop: function() {
        clearInterval(intervalId);
        timer.clockRunning = false;
        stopBlink();
    },

    count: function() { 
        timer.time--;
        $('#seconds').html(timer.timeConverter(timer.time));
        if (timer.time === 0) {
            timer.stop();
            if (!timer.isResultPage) {
                timedOut++;
                displayResult("Time expired!");
            }
            else
                newQuestion();
        }
    },
   
    timeConverter: function(seconds) {
        if (seconds < 10)
            return "0" + seconds;
        return seconds;
    },
};


function newQuestion()
{
    // the index of the random question
    var questionIndex;


    if (alreadyAsked.length === questions.length) {
        // Game Over
    }


    // Get index of a random question that hasn't been asked yet
    do 
        questionIndex = Math.floor(Math.random() * questions.length);
    while (alreadyAsked.includes(questionIndex));
    alreadyAsked.push(questionIndex);
    
    $('#question').html(questions[questionIndex]);

    // Get the array of multiple choice responses for the question and shuffles
    multipleChoice = shuffle(multipleChoiceArr[questionIndex]);
    // Get correct answer+pic to the chosen question as a string
    answer = correctAnswer[questionIndex];
    answerImg = correctImg[questionIndex];
    answerTrivia = trivia[questionIndex];

    // Display multiple choices in html
    $('#answers').empty();
    for (var i = 0; i < multipleChoice.length; i++) {
        $('#answers').append("<li class = 'multipleChoice p-1'>"+multipleChoice[i]+"</li>");
    }

    $('#result').hide();
    $('#auto').hide();
    $('#question').show();
    $('#answers').show();
    timer.reset();
    timer.start();

    // Handler for answer clicked by user
    $('#answers').on("click", ".multipleChoice", function(){
        if ($(this).text() === answer) {
            right++;
            displayResult("Correct!");
        }
        else {
            wrong++;
            displayResult("Incorrect.");
        }
    });
}

function displayResult(message) {
    $('#question').hide();
    $('#answers').hide();
    $('#resultTxt').html(message);
    if (message !== "Correct!")
        $('#resultTxt').append("  The correct answer was " + answer + ".");
    $('#resultImg').attr('src', answerImg);
    $('#resultImg').attr('alt', answer);
    $('#trivia').html(answerTrivia);
    $('#result').show();
    $('#auto').show();
    timer.reset(10, true);
    timer.start();   
}

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
  
      // And swap it with the current element
      temp = arr[index];
      arr[index] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
    return arr;
}

function blink() {    // Blinking colon
    var toggle = true;
    blinkId = setInterval(function(){
        $("#colon").css({ visibility: toggle?"visible":"hidden"});
        toggle = !toggle;
    },500);
}

function stopBlink(){
    clearInterval(blinkId);
}

newQuestion();