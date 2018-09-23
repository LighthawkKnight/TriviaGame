const gameQuestions = [ "How many pokemon are there total as of Ultra Sun/Moon?",
    "How many pokemon were there in the original Generation I games (Red/Blue/Yellow)?",
    "How many different ways can you evolve Eevee as of Generation VII (Sun/Moon)?",
    "What HM became a TM starting in Ruby/Sapphire?",
    "Who is the name of the Player's Rival in Generation I (Red/Blue/Yellow) who eventually became Viridian City's Gym Leader?",
    "What was the signature ability of Machop's evolutionary line?",
    "What was the only core series of games where both parents of the player character was present?",
    "What two pokemon adorned the box art for Pokemon X/Y?",
    "When a Rowlet evolves into a Decidueye, what new type does it gain and what does it replace?",
    "What pokemon nature increases Speed but decreases Special Attack?"];

const animeQuestions = ["What was Pikachu's first Z-Move?",
                        "In Pikachu language, what is Ash's name?"]

// Multiple choice options indexed by the same order as the questions
const gameMultipleChoiceArr = [
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

const animeMultipleChoiceArr = [
    ["Gigavolt Havoc", "Breakneck Blitz", "10,000,000 Volt Thunderbolt", "Catastropika", "Stoked Sparksurfer"],
    ["Pikachu-Pi", "PikaPika", "PikaPi", "Pi-Pikachu", "PikaPika"],
    [""]
    ]
]

// The correct answer indexed by the same order as above
const gameCorrectAnswer = ["807", "151", "8", "Flash", "Blue", "No Guard", "Ruby/Sapphire/Emerald", "Xerneas/Yveltal", "Ghost replaces Flying", "Jolly"];
// Some trivia to go along with the correct answer, indexed
const gameTrivia = ["It's going to break 4 digits soon enough.  Can you name them all?",
                "If you counted 150, I hope you didn't forget cute little Mew!",
                "Another generation, another eeveelution.  So much potential for such a small pokemon!",
                "A great change too, since there were only a few dark places to light up coupled with the difficulty in unlearning HM moves.",
                "Blue is the rival's canon name; since that is his name when you finally meet up with him in G/S/E 3 years later",
                "Their attacks couldn't miss, in return for not being able to dodge.  The benefits outweighed the disadvantages for the most part.",
                "In every other game, only your Mom is present, who always sees you off on your journey at the start.",
                "Xerneas/Yveltal were the legendary exclusives for X/Y respectively, both of whom were pivotal to the main story.",
                "Hard to believe the swift ninja-like Decidueye evolves from this cute little owl pokemon.",
                "Timid, Hasty, and Naive increased your speed as well, but sacrificed other stats."]
// Image accompanying answer indexed by the same order as above
const p = "assets/img/"  // Image path
const gameCorrectImg = [p+"807pokemon.gif", p+"mew.gif",p+"eeveelutions.gif",p+"hm05flash.png",p+"gary.gif",p+"machamp.gif",
                    p+"delia.gif",p+"xylegendaries.gif",p+"rowlet.gif", p+"totodile.gif"];
// Time limits
const questionTime = 25;
const resultTime = 3;

// Game type array vars
var questions = [];
var multipleChoiceArr = [];
var correctAnswer = [];
var trivia = [];
var correctImg = [];

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

    time: questionTime,
    clockRunning: false,
    isResultPage: false,     // isResultPage is true if the program is in the transition between questions
   
    reset: function(startTime = questionTime, isResultPage = false) {  
        timer.time = startTime;
        timer.isResultPage = isResultPage;
        $('#seconds').html(timer.timeConverter(startTime));  
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
        // $('timerText').html(timer.time);
        // When time runs out
        if (timer.time === 0) {
            timer.stop();
            // If we're in the middle of answering a question, user ran out of time
            if (!timer.isResultPage) {
                timedOut++;
                displayResult("Time expired!");
            }
            // If we're in the result page, and every question is answered already
            else if (alreadyAsked.length === questions.length)
                gameOver();
            // If we're in the result page, and there are still questions left
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


function start(){
    $('#gameOver').hide();
    $('#mainGame').hide();
    console.log(questions.length);
    console.log(multipleChoiceArr.length);
    console.log(correctAnswer.length);
    console.log(trivia.length);
    console.log(correctImg.length);
    //jQuery fade:  'fast' = 200ms, 'slow' = 600ms, blank = 400ms
    $('#startScreen').on("click", 'button', function(){
        var choice = $(this).attr('id');
        if (choice === "gameQuiz") {
            questions = gameQuestions;
            multipleChoiceArr = gameMultipleChoiceArr;
            correctAnswer = gameCorrectAnswer;
            trivia = gameTrivia;
            correctImg = gameCorrectImg;
            $('#animeQuiz').fadeOut('fast');
        }
        else if (choice === "animeQuiz") {
            questions = gameQuestions;
            multipleChoiceArr = gameMultipleChoiceArr;
            correctAnswer = gameCorrectAnswer;
            trivia = gameTrivia;
            correctImg = gameCorrectImg;
            $('#gameQuiz').fadeOut('fast');
        }


        setTimeout(function(){
            console.log('to3');
            newQuestion();
        },900);

        setTimeout(function(){
            console.log("to2");
            $('#startScreen').hide();
            $('html').fadeIn('slow');
        },850);

        setTimeout(function(){
            console.log("to1");
            $('html').fadeOut('slow');
        },200);





        
        $('#startScreen').off("click");
    });

    // newQuestion();
}

function newQuestion()
{
    // the index of the random question
    var questionIndex;
    console.log("called newQuestion");
    // Get index of a random question that hasn't been asked yet
    do 
        questionIndex = Math.floor(Math.random() * questions.length);
    while (alreadyAsked.includes(questionIndex));
    alreadyAsked.push(questionIndex);
    console.log(alreadyAsked);
    
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
    $('#resultImg').empty();
    $('#resultTxt').empty();
    $('#trivia').empty();
    $('#mainGame').show();
    $('#question').show();
    $('#answers').show();
    timer.reset();
    timer.start();

    // Handler for answer clicked by user
    $('#answers').on("click", ".multipleChoice", function(){
        timer.stop();
        if ($(this).text() === answer) {
            right++;
            displayResult("Correct!");
        }
        else {
            wrong++;
            displayResult("Incorrect.");
        }
        $('#answers').off('click');
        console.log(right + " " + wrong + " " + timedOut);
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
    timer.reset(resultTime, true);
    timer.start();   
}

function gameOver() {
    $('#timer').hide();
    $('#result').hide();
    $('#auto').hide();
    $('#gameOver').show();
    $('#right').html(" " + right);
    $('#wrong').html(" " + wrong);
    $('#unaswered').html(" " + timedOut)
}

// This method of shuffling goes through each index of the array once and randomly swaps it with another.  Returns the same array passed in, except shuffled
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

function fadeOut(element) {
    var opacity = 1;  // initial opacity, 1 = fully visible w/ no fade
    var timer = setInterval(function () {
        if (opacity <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = opacity;
        // element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
        opacity -= opacity * 0.1;
    }, 50);
}

start();