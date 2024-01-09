let globalFeatures = {
    zcr: 0,
    // Initialize other features you will use
    spectralRolloff: 0,
    energy: 0,
    spectralCentroid: 0,
    spectralFlatness: 0,
    spectralSpread: 0,
    spectralKurtosis: 0
};

var zcrThreshold = 10;

var audioClip;

let playStopButton;
let speechRecButton;
let sliderVolume;
let sliderRate;
let sliderPan;

var analyzer;
var movement;

var backgroundColour;
var figure;

var figure_1_colour;
var figure_1_size;

var figure_2_colour;
var figure_2_size;

var figure_3_colour;
var figure_3_size;

var figure_4_colour;
var figure_4_size;

var figure_5_colour;
var figure_5_size;

var figure_6_colour;
var figure_6_size;

let micPermissionButton;
let isMicEnabled = false;

var speechRec
speechRec.continuous 
speechRec.interimResults 



function preload() {
    soundFormats('mp3', 'wav');
    audioClip = loadSound('./sounds/Kalte_Ohren_(_Remix_).mp3')
}
function polygon(x, y, npoints,radius ) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx *2, sy*2);
    }
    endShape(CLOSE);
}

function setup() {
    createCanvas(700, 500);
    background(60);
    backgroundColour = [60,60,60];
    angleMode(DEGREES);
    rectMode(CENTER);
    
    figure="square";
    figure_1_size = 0;
    figure_2_size = 0;
    figure_3_size = 0;
    figure_4_size = 0;
    figure_5_size = 0;
    figure_6_size = 0;
    
    playStopButton = createButton('play');
    playStopButton.position(300, 20);
    playStopButton.mousePressed(playStopSound);



    // New button for microphone permission
    micPermissionButton = createButton('Enable Microphone');
    micPermissionButton.position(500, 20); // Adjust position as needed
    micPermissionButton.mousePressed(toggleMicPermission);
    micPermissionButton.style("background-color", "red"); // Start with red button

    
    // Check if the Meyda library is defined
    if (typeof Meyda === "undefined") {
        // If Meyda is not found, log a message to the console
        console.log("Meyda could not be found");
    } else {
        // If Meyda is available, create a Meyda analyzer with specific configurations
        analyzer = Meyda.createMeydaAnalyzer({
            "audioContext": getAudioContext(), // Get and use the current audio context
            "source": audioClip,              // Set the source of the audio to be analyzed
            "bufferSize": 512,                // Define the buffer size for the analyzer
            "featureExtractors": [            // Specify the audio features to be extracted
                "zcr", "spectralRolloff", "energy", 
                "spectralCentroid", "spectralFlatness", 
                "spectralSpread", "spectralKurtosis"
            ],
            "callback": features => {         // Define a callback function to handle the extracted features
                globalFeatures.zcr = features.zcr; // Update the Zero Crossing Rate (ZCR) in global features
                // Uncomment the next line to log the updated ZCR value to the console
                // console.log("ZCR Updated:", globalFeatures.zcr);

                // Update the sizes of various figures based on the extracted audio features
                figure_1_size = features.spectralRolloff * 0.01; 
                figure_2_size = features.spectralCentroid * 2; 
                figure_3_size = features.spectralFlatness * 1000; 
                figure_4_size = features.energy * 10; 
                figure_5_size = features.spectralSpread * 5;
                 figure_6_size = features.spectralKurtosis * 1; 
                
                movement = features.zcr; // Update the movement variable based on the ZCR feature
            }
        });
    }
}

function draw() {
    background(backgroundColour[0],backgroundColour[1], backgroundColour[2]);
    drawfigure(figure, frameCount); // This will draw other figures based on the 'figure' variable
}


function toggleMicPermission() {
    if (!isMicEnabled) {
        // If the microphone is not already enabled:

        // Initialize the speech recognition each time it's enabled.
        // p5.SpeechRec is used for speech recognition, set to English ('en-US') and 
        // parseResult function is set to handle the recognition results.
        speechRec = new p5.SpeechRec('en-US', parseResult);

        // Set the speech recognition to continuously listen
        speechRec.continuous = true;

        // Enable interim results which may change as more of the speech is recognized
        speechRec.interimResults = true;

        // Start the speech recognition service
        speechRec.start();

        // Change the button text to 'Disable Microphone', indicating the microphone can be turned off
        micPermissionButton.html('Disable Microphone');

        // Change the background color of the button to green, indicating the microphone is active
        micPermissionButton.style("background-color", "green");

        // Set the flag to true, indicating the microphone is now enabled
        isMicEnabled = true;
    } else {
        // If the microphone is already enabled:

        // Change the button text to 'Enable Microphone', allowing it to be turned back on
        micPermissionButton.html('Enable Microphone');

        // Change the background color of the button to red, indicating the microphone is not active
        micPermissionButton.style("background-color", "red");

        // Set the flag to false, indicating the microphone is now disabled
        // Note: This does not stop the speechRec from listening, it just means we will ignore its results
        isMicEnabled = false;
    }
}


function parseResult()
{
    // Check if the microphone is enabled
    if (!isMicEnabled) {
        return; // If the microphone is not enabled, exit the function
    }

    // Extract the most recent word from the speech recognition results and convert it to lower case
    var mostRecentWord = speechRec.resultString.split(' ').pop().toLowerCase();
    // Check for "black" word and adjust colors if ZCR is above threshold

    // Check for "green" word and adjust colors
    if (mostRecentWord.indexOf("green") !== -1) { 
        // Set colors for green theme        
        backgroundColour = [0, 255, 0]; // Green background
        figure_1_colour = [240, 10, 240];  // Magenta
        figure_2_colour = [255, 255, 0];   // Yellow
        figure_3_colour = [240, 10, 240];  // Magenta (repeated)
        figure_4_colour = [255, 255, 0];   // Yellow (repeated)
        figure_5_colour = [0, 0, 255];     // Blue
        figure_6_colour = [0, 0, 255];     // Blue (repeated)
        
    }
    if (mostRecentWord.indexOf("white") !== -1) { 
        // Set colors for white theme
        backgroundColour = [255, 255, 255]; // White background
        figure_1_colour = [0, 0, 0];  // Black
        figure_2_colour = [255, 87, 34]; // Bright Orange
        figure_3_colour = [0, 0, 0];  // Black (repeated)
        figure_4_colour = [255, 87, 34]; // Bright Orange (repeated)
        figure_5_colour = [33, 150, 243];  // Blue
        figure_6_colour = [33, 150, 243];  // Blue (repeated)
        
        
    }
    // Check for "blue" word and adjust colors
    if (mostRecentWord.indexOf("blue") !== -1) { 
        // Set colors for blue theme        
        backgroundColour = [0, 123, 255]; // Medium Blue
        figure_1_colour = [108, 92, 231];  // Pastel Purple
        figure_2_colour = [253, 121, 168]; // Pink
        figure_3_colour = [108, 92, 231];  // Pastel Purple (repeated)
        figure_4_colour = [253, 121, 168]; // Pink (repeated)
        figure_5_colour = [255, 183, 77];   // Turquoise
        figure_6_colour = [255, 183, 77];   // Turquoise (repeated)
        
    }
    // Check for "red" word and adjust colors
    if (mostRecentWord.indexOf("red") !== -1) { 
        // Set colors for red theme        
        backgroundColour = [255, 0, 0]; // Red background
        figure_1_colour = [255, 255, 255]; // White
        figure_2_colour = [255, 255, 0];   // Yellow
        figure_3_colour = [255, 255, 255]; // White (repeated)
        figure_4_colour = [255, 255, 0];   // Yellow (repeated)
        figure_5_colour = [10, 240, 240];  // Teal
        figure_6_colour = [10, 240, 240];  // Teal (repeated)
        
        
    }
    if (mostRecentWord.indexOf("black") !== -1 ) { 
        // Set colors for black theme
        backgroundColour=[0,0,0];
        figure_1_colour = [240, 240, 240];
        figure_2_colour = [255, 0, 0];
        figure_3_colour = [255, 0, 0];// middle
        figure_4_colour = [255, 215, 0]; 
        figure_5_colour = [255, 215, 0];
        figure_6_colour = [240, 240, 240];// lats one
    }


    // Change the figure based on specific words like "square", "triangle", "circle", "pentagon"
    // The following conditions check for these words and set the figure accordingly

    if(mostRecentWord.indexOf("pentagon")!==-1) { 
        figure = "pentagon"
    }
    if(mostRecentWord.indexOf("triangle")!==-1) { 
        figure = "triangle"
    }
    if(mostRecentWord.indexOf("circle")!==-1) { 
        figure = "circle"
    }
    if(mostRecentWord.indexOf("square")!==-1) { 
        figure = "square"
    }
    
    console.log(mostRecentWord);
}

function playStopSound() {
    // Check if the audio clip is currently playing
    if (audioClip.isPlaying()) {
        // If the audio is playing, pause it
        audioClip.pause();
        // Stop the audio analyzer
        analyzer.stop();
        // Change the button text to 'play', indicating that audio can be played
        playStopButton.html('play');
    } else {
        // If the audio is not playing, start playing it
        audioClip.play();
        // Start the audio analyzer
        analyzer.start();
        // Change the button text to 'stop', indicating that audio can be stopped
        playStopButton.html('stop');
    }
}



function spectralRollofffigure(figure) {
    push(); // Save the current drawing state
    translate(50, 250); // Move the origin to a new position
    rotate(frameCount); // Rotate the figure based on the frame count for animation
    translate(movement, 0); // Move the figure horizontally based on the 'movement' variable
    fill(figure_1_colour, 30, 255); // Set the color for the figure

    // Draw the specified figure based on the 'figure' parameter
    if(figure == "pentagon") polygon(0, 0, 5, 100);
    if(figure == "triangle") triangle(0, 0, figure_1_size/2, -figure_1_size, figure_1_size, 0);
    if(figure == "circle") circle(0, 0, figure_1_size);
    if(figure == "square") square(0, 0, figure_1_size);

    pop(); // Restore the original drawing state
}


function perceptualCentroidfigure(figure) {
    push(); // Save the current drawing state
    translate(150, 250); // Move the origin to a new position
    rotate(-frameCount); // Rotate the figure based on the negative frame count for opposite animation
    translate(movement, 0); // Move the figure horizontally based on the 'movement' variable
    fill(figure_2_colour, 30, 255); // Set the color for the figure

    // Draw the specified figure based on the 'figure' parameter
    
    if(figure == "pentagon") polygon(0, 0, 5 , 100);
    if(figure == "triangle") triangle(0, 0, figure_2_size/2, -figure_2_size, figure_2_size, 0);
    if(figure == "circle") circle(0, 0, figure_2_size);
    if(figure == "square") square(0, 0, figure_2_size); 


    pop(); // Restore the original drawing state
}


function spectralSpreadfigure(figure) {
    push(); // Save the current drawing state
    translate(500, 250); // Move the origin to a new position
    rotate(-frameCount-180); // Rotate the figure based on a modified frame count for different animation
    translate(movement, 0); // Move the figure horizontally based on the 'movement' variable
    fill(figure_3_colour, 30, 255); // Set the color for the figure

    // Draw the specified figure based on the 'figure' parameter
    if(figure == "pentagon") polygon(0, 0, 5, 100);
    if(figure == "triangle") triangle(0, 0, figure_5_size/2, -figure_5_size, figure_5_size, 0);
    if(figure == "circle") circle(0, 0, figure_5_size);
    if(figure == "square") square(0, 0, figure_5_size); 

    pop(); // Restore the original drawing state
}


function spectralKurtosisfigure(figure) {
    push(); // Save the current drawing state
    translate(350, 300); // Move the origin to a new position
    rotate(frameCount-180); // Rotate the figure based on a modified frame count for another animation style
    translate(movement, 0); // Move the figure horizontally based on the 'movement' variable
    fill(figure_4_colour, 30, 255); // Set the color for the figure

    // Draw the specified figure based on the 'figure' parameter
    if(figure == "triangle") triangle(0, 0, figure_6_size/2, -figure_6_size, figure_6_size, 0);
    if(figure == "pentagon") polygon(0, 0, 5, 100);
    if(figure == "circle") circle(0, 0, figure_6_size);
    if(figure == "square") square(0, 0, figure_6_size); 


    pop(); // Restore the original drawing state
}
    

function drawfigure(figure, frameCount) {


    // Check if the specified figure is a circle
    if (figure == "circle") {
        // Call functions to handle spectral rolloff and perceptual centroid for a circle
        spectralRollofffigure("circle");
        perceptualCentroidfigure("circle");

        // Set fill color and opacity for the circle representing spectral flatness, then draw it
        fill(figure_5_colour, 30, 255);
        circle(650, 250, figure_3_size * 3);
        
        // Set fill color and opacity for the circle representing energy, then draw it
        fill(figure_6_colour, 30, 255);
        circle(350, 250, figure_4_size);

        // Call functions to handle spectral spread and kurtosis for a circle
        spectralSpreadfigure("circle");
        spectralKurtosisfigure("circle");
    }



    // Check if the specified figure is a pentagon
    if (figure == "pentagon") {
        // Draw a pentagon with figure_1_size as its size parameter
        polygon(width / 2, height / 2, 5, figure_1_size);

        // Call functions to handle spectral rolloff and perceptual centroid for a pentagon
        spectralRollofffigure("pentagon");
        perceptualCentroidfigure("pentagon");

        // Set fill color and opacity, then draw two pentagons with different sizes
        fill(figure_3_colour, 30, 255);
        polygon(0, 0, 5, 100);
        polygon(0, 0, 5, 2000);

        // Set fill color for another pentagon and draw it
        fill(figure_4_colour, 30, 255);
        polygon(0, 0, 5, 10000);        

        // Call functions to handle spectral spread and kurtosis for a pentagon
        spectralSpreadfigure("pentagon");
        spectralKurtosisfigure("pentagon");
    }
    // Check if the specified figure is a triangle
    if (figure == "triangle") {
        // Call functions to handle spectral rolloff and perceptual centroid for a triangle
        spectralRollofffigure("triangle");
        perceptualCentroidfigure("triangle");

        // Set fill color and opacity for the first triangle, then draw it
        fill(figure_5_colour, 30, 255);
        triangle(350, 100, 350 + figure_3_size / 2, 100 - figure_3_size, 350 + figure_3_size, 100);
        
        // Set fill color and opacity for the second triangle, then draw it
        fill(figure_6_colour, 30, 255);
        triangle(350, 250, 350 + figure_4_size / 2, 250 - figure_4_size, 350 + figure_4_size, 250);

        // Call functions to handle spectral spread and kurtosis for a triangle
        spectralSpreadfigure("triangle");
        spectralKurtosisfigure("triangle");
    }
    // Check if the specified figure is a square
    if (figure == "square") {
        // Call functions to handle spectral rolloff and perceptual centroid for a square
        spectralRollofffigure("square");
        perceptualCentroidfigure("square");

        // Set fill color and opacity for the first square, then draw it
        fill(figure_5_colour, 30, 255);
        square(260, 250, figure_3_size * 4);

        // Set fill color and opacity for the second square, then draw it
        fill(figure_6_colour, 30, 255);
        square(650, 250, figure_4_size * 5);

        // Call functions to handle spectral spread and kurtosis for a square
        spectralSpreadfigure("square");
        spectralKurtosisfigure("square");
    }
}



