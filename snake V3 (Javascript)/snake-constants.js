// main constants
var outputRate = 20;
var tps = 60;

// input handler constants
var keyMapper = {38:[0,-1],40:[0,1],37:[-1,0],39:[1,0],65:[-1,0],83:[0,1],68:[1,0],87:[0,-1]};

// keys
var keys1 = ["←","↓","→","↑"];
var keys2 = ["a","s","d","w"];
var keys3 = ["j","k","l","i"];
var keys4 = ["v","b","n","g"];


// display constants
var borderWidth = 2;
var cameraPanSpeed = 1;
var endExpandSpeed = 0.75;

var startFadeSpeed = 0.2;
var menuSwapSpeed = 0.5;

//snake control
var snakeColors = ["#000000", "#78d140", "#cc30c6", "#d8970a", "#eff230", "#2e5bfc" ]

var snakeWidth = 1.5;
var snakeSpeed = 15/tps;
var initialLength = 40;
// how much assistanse should the player get when turning
var snapThreshhold = 0.3;
var deathZoom = 10;

// food control
var foodWidth = snakeWidth;
var foodWidthDeviation = 0;
var lengthIncrease = 25;
var sizeIncrease = 0;
var speedIncrease = 0;

var dangerousFood = false;
var movingFood = false;
var foodSpeed = 10/tps;
var foodCount = 1;

// debugger for whatever
var debug_key = 49;
var debuger = false;

var settings = [
	new Settings( "Classic", null),
	new Settings( "Classic:Hard", {"snapThreshhold" : 0,"snakeSpeed":25, "speedIncrease":1, "snakeWidth":1.75, "foodWidth": 1}),
	new Settings( "Ecosystem", { "snakeWidth": 0.2, "foodWidthDeviation": 0.2, "initialLength": 10, "lengthIncrease": 15, "foodWidth":0.3, "sizeIncrease":0.1, "foodCount": 20}),
	new Settings( "Mon's Special", {"movingFood":true, "dangerousFood":true, "foodCount": 45}),
	new Settings( "Don't die", {"movingFood":true, "dangerousFood":true, "foodCount": 45}),
	new Settings( "FASTER!!!", {"snakeSpeed":35, "initialLength": 20, "speedIncrease": 3}),
	new Settings( "Needle Snake", {"snakeWidth":0.25, "foodWidth": 0.5,"snapThreshhold":0, "snakeSpeed":20}),
	new Settings( "Needle Heaven", {"snakeWidth":0.15, "tps": 120, "snapThreshhold":0, "foodWidth": 0.3, "lengthIncrease": 30, "foodCount": 20, "snakeSpeed":20}),
	new Settings( "Fat Snake", { "sizeIncrease": 0.2, "snakeWidth":3})
];

// resources
var hideIconUrl = "src/minnimize.png";
var unHideIconUrl = "src/expand.png"
var logoUrl = "src/Ouroboros.png";
var rightArrowUrl = "src/right-arrow.png";
var upArrowUrl = "src/up-arrow.png";
var leftArrowUrl = "src/left-arrow.png";
var downArrowUrl = "src/down-arrow.png";
var leftShiftUrl = "src/left-shift.png";
var rightShiftUrl = "src/right-shift.png";
var closeUrl = "src/close.png";
var keyUrl = "src/key.png";

function applyChange ( name, value){
	switch( name ){
		case "snakeWidth":
			snakeWidth = value;
			break;
		case "snakeSpeed":
			snakeSpeed = value/tps;
			break;
		case "initialLength":
			initialLength = value;
			break;
		case "foodWidth":
			foodWidth = value;
			break;
		case "lengthIncrease":
			lengthIncrease = value;
			break;
		case "sizeIncrease":
			sizeIncrease = value;
			break;
		case "dangerousFood":
			dangerousFood = value;
			break;
		case "movingFood":
			movingFood = value;
			break;
		case "foodCount":
			foodCount = value;
			break;
		case "speedIncrease":
			speedIncrease = value/tps;
			break;
		case "snapThreshhold":
			snapThreshhold = value;
			break;
		case "foodWidthDeviation":
			foodWidthDeviation = value;
			break;
		case "tps":
			tps = value;
			break;
		default:
			console.error( name + " is not considered a valid setting");
	}
}

function resetSettings(){
	tps = 60;
	snakeWidth = 1.5;
	snakeSpeed = 15/tps;
	initialLength = 40;
	foodWidth = snakeWidth;
	lengthIncrease = 25;
	sizeIncrease = 0;
	dangerousFood = false;
	movingFood = false;
	foodSpeed = 10/tps;
	foodCount = 1;
	speedIncrease = 0;
	snapThreshhold = 0.3;
	foodWidthDeviation = 0;
}