var FPS = 30;

var SOURCE_I_IMAGE = "./img/i_1.png";
var SOURCE_J_IMAGE = "./img/j_1.png";
var SOURCE_L_IMAGE = "./img/l_1.png";
var SOURCE_O_IMAGE = "./img/o_1.png";
var SOURCE_S_IMAGE = "./img/s_1.png";
var SOURCE_T_IMAGE = "./img/t_1.png";
var SOURCE_Z_IMAGE = "./img/z_1.png";
var SOURCE_BUTTON_BACK_DOWN = "./img/button_back_downstate.png";
var SOURCE_BUTTON_BACK_UP = "./img/button_back_upstate.png";
var SOURCE_BUTTON_END_DOWN = "./img/button_end_downstate.png";
var SOURCE_BUTTON_END_UP = "./img/button_end_upstate.png";
var SOURCE_BUTTON_PLAYGAME_DOWN = "./img/button_playgame_downstate.png";
var SOURCE_BUTTON_PLAYGAME_UP = "./img/button_playgame_upstate.png";

var GAME_STATE_START = 0;
var GAME_STATE_PLAYING = 1;
var GAME_STATE_END = 2;

var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;
var PLAYING_WIDTH = 320;
var PLAYING_HEIGHT = 576;
var TOTAL_ROWS = 19;
var TOTAL_COLS = 10;
var MIDDLE_COL = 3;

var STARTING_DOWN_DELAY = 33;
var DECREASE_DOWN_DELAY = 3;
var MIN_DOWN_DELAY = 2;
var DYING_VALUE = 12;

var canvas = null;
var context2D = null;

var i_image = null;
var j_image = null;
var l_image = null;
var o_image = null;
var s_image = null;
var t_image = null;
var z_image = null;

var gameBoard = null;

var tetrominos = null;
var previewShape = 0;
var currentShape = previewShape;
var currentRotation = 0;

var posX = MIDDLE_COL;
var posY = 0;
var collideDown = false;

var isLeftPressed = false;
var isRightPressed = false;
var isDownPressed = false;
var isUpPressed = false;
var isSpaceBarPressed = false;
var wasFindFullRowsCalled = false;

var moveDownCounter = 0;
var moveDownDelay = STARTING_DOWN_DELAY;

var score = 0;
var lines = 0;
var levelLines = 0;
var level = 1;

var fullRows = null;
var hasFullRow = false;
var dyingBlockSize = BLOCK_WIDTH;

var gameState = GAME_STATE_START;

var button_Back = null
var button_BackDownStateImage = null;
var button_BackUpStateImage = null;
var button_End = null;
var button_EndDownStateImage = null;
var button_EndUpStateImage = null;
var button_PlayGame = null;
var button_PlayGameDownStateImage = null;
var button_PlayGameUpStateImage = null;

var mpressed = false;
var prev_mpressed = false;

var intervalId = -1; // used to control if there is already an interval set or not.

var keys = new Array();

var utilities = gameUtilities();

document.addEventListener('keydown',keyDown,true);
document.addEventListener('keyup',keyUp,true);
function keyDown(evt){
 keys[evt.keyCode] = true;
 getInput();
 evt.returnValue = false;
}
function keyUp(evt){
 keys[evt.keyCode] = false;
 getInput();
 evt.returnValue = false;
}

window.onload = loadGame;

document.addEventListener('mousemove', mouseMoved, true);
document.addEventListener('mouseup', clicked, true);
document.addEventListener('mousedown', onMouseDown, true);
var mouseX = 0;
var mouseY = 0;

function mouseMoved(e)
{ 
	if (e.pageX || e.pageY)
	{ 
		mouseX = e.pageX;
		mouseY = e.pageY;
	}
	else
	{ 
		mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	mouseX -= canvas.offsetLeft;
	mouseY -= canvas.offsetTop;
} // end mouseMoved

function onMouseDown(e)
{
	prev_mpressed = mpressed;
	mpressed = true;
} // end onMouseDown

function clicked(e)
{
	prev_mpressed = mpressed;
    mpressed = false;
} // end clicked

function Shape()
{
	this.rotation = new Array(4);
	for (var i = 0; i < 4; i++)
	{
		this.rotation[i] = new Array(4);
	}
} // end object Shape

function loadShapes()
{
	tetrominos = new Array(7);
	for (var i = 0; i < 7; i++)
	{
		tetrominos[i] = new Array(4);
	}
	
	for (var i = 0; i < 7; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			tetrominos[i][j] = new Shape();
		}
	}
	
	// Define I Tetromino
	// Rotation 0
	tetrominos[0][0].rotation[0] = [1, 1, 1, 1];
	tetrominos[0][0].rotation[1] = [0, 0, 0, 0],
	tetrominos[0][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[0][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[0][1].rotation[0] = [0, 1, 0, 0];
	tetrominos[0][1].rotation[1] = [0, 1, 0, 0];
	tetrominos[0][1].rotation[2] = [0, 1, 0, 0];
	tetrominos[0][1].rotation[3] = [0, 1, 0, 0];
	
	// Rotation 2
	tetrominos[0][2].rotation[0] = [1, 1, 1, 1];
	tetrominos[0][2].rotation[1] = [0, 0, 0, 0];
    tetrominos[0][2].rotation[2] = [0, 0, 0, 0];
	tetrominos[0][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[0][3].rotation[0] = [0, 1, 0, 0];
	tetrominos[0][3].rotation[1] = [0, 1, 0, 0];
	tetrominos[0][3].rotation[2] = [0, 1, 0, 0];
	tetrominos[0][3].rotation[3] = [0, 1, 0, 0];
	// End I Shape
	
	// Define J Shape
	// Rotation 0
	tetrominos[1][0].rotation[0] = [2, 2, 2, 0];
	tetrominos[1][0].rotation[1] = [0, 0, 2, 0];
	tetrominos[1][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[1][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[1][1].rotation[0] = [0, 2, 0, 0];
	tetrominos[1][1].rotation[1] = [0, 2, 0, 0];
	tetrominos[1][1].rotation[2] = [2, 2, 0, 0];
	tetrominos[1][1].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 2
	tetrominos[1][2].rotation[0] = [0, 0, 0, 0];
	tetrominos[1][2].rotation[1] = [2, 0, 0, 0];
    tetrominos[1][2].rotation[2] = [2, 2, 2, 0];
	tetrominos[1][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[1][3].rotation[0] = [0, 2, 2, 0];
	tetrominos[1][3].rotation[1] = [0, 2, 0, 0];
	tetrominos[1][3].rotation[2] = [0, 2, 0, 0];
	tetrominos[1][3].rotation[3] = [0, 0, 0, 0];
	// End J Shape
	
	// Define L Shape
	// Rotation 0
	tetrominos[2][0].rotation[0] = [3, 3, 3, 0];
	tetrominos[2][0].rotation[1] = [3, 0, 0, 0];
	tetrominos[2][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[2][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[2][1].rotation[0] = [3, 3, 0, 0];
	tetrominos[2][1].rotation[1] = [0, 3, 0, 0];
	tetrominos[2][1].rotation[2] = [0, 3, 0, 0];
	tetrominos[2][1].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 2
	tetrominos[2][2].rotation[0] = [0, 0, 0, 0];
	tetrominos[2][2].rotation[1] = [0, 0, 3, 0];
    tetrominos[2][2].rotation[2] = [3, 3, 3, 0];
	tetrominos[2][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[2][3].rotation[0] = [0, 3, 0, 0];
	tetrominos[2][3].rotation[1] = [0, 3, 0, 0];
	tetrominos[2][3].rotation[2] = [0, 3, 3, 0];
	tetrominos[2][3].rotation[3] = [0, 0, 0, 0];
	// End L Shape
	
	// Define O Shape
	// Rotation 0
	tetrominos[3][0].rotation[0] = [0, 4, 4, 0];
	tetrominos[3][0].rotation[1] = [0, 4, 4, 0];
	tetrominos[3][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[3][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[3][1].rotation[0] = [0, 4, 4, 0];
	tetrominos[3][1].rotation[1] = [0, 4, 4, 0];
	tetrominos[3][1].rotation[2] = [0, 0, 0, 0];
	tetrominos[3][1].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 2
	tetrominos[3][2].rotation[0] = [0, 4, 4, 0];
	tetrominos[3][2].rotation[1] = [0, 4, 4, 0];
    tetrominos[3][2].rotation[2] = [0, 0, 0, 0];
	tetrominos[3][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[3][3].rotation[0] = [0, 4, 4, 0];
	tetrominos[3][3].rotation[1] = [0, 4, 4, 0];
	tetrominos[3][3].rotation[2] = [0, 0, 0, 0];
	tetrominos[3][3].rotation[3] = [0, 0, 0, 0];
	// End O Shape
	
	// Define S Shape
	// Rotation 0
	tetrominos[4][0].rotation[0] = [0, 5, 5, 0];
	tetrominos[4][0].rotation[1] = [5, 5, 0, 0];
	tetrominos[4][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[4][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[4][1].rotation[0] = [0, 5, 0, 0];
	tetrominos[4][1].rotation[1] = [0, 5, 5, 0];
	tetrominos[4][1].rotation[2] = [0, 0, 5, 0];
	tetrominos[4][1].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 2
	tetrominos[4][2].rotation[0] = [0, 5, 5, 0];
	tetrominos[4][2].rotation[1] = [5, 5, 0, 0];
    tetrominos[4][2].rotation[2] = [0, 0, 0, 0];
	tetrominos[4][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[4][3].rotation[0] = [0, 5, 0, 0];
	tetrominos[4][3].rotation[1] = [0, 5, 5, 0];
	tetrominos[4][3].rotation[2] = [0, 0, 5, 0];
	tetrominos[4][3].rotation[3] = [0, 0, 0, 0];
	// End S Shape
	
	// Define T Shape
	// Rotation 0
	tetrominos[5][0].rotation[0] = [0, 6, 6, 6];
	tetrominos[5][0].rotation[1] = [0, 0, 6, 0];
	tetrominos[5][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[5][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[5][1].rotation[0] = [0, 6, 0, 0];
	tetrominos[5][1].rotation[1] = [0, 6, 6, 0];
	tetrominos[5][1].rotation[2] = [0, 6, 0, 0];
	tetrominos[5][1].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 2
	tetrominos[5][2].rotation[0] = [0, 0, 0, 0];
	tetrominos[5][2].rotation[1] = [0, 6, 0, 0];
    tetrominos[5][2].rotation[2] = [6, 6, 6, 0];
	tetrominos[5][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[5][3].rotation[0] = [0, 0, 6, 0];
	tetrominos[5][3].rotation[1] = [0, 6, 6, 0];
	tetrominos[5][3].rotation[2] = [0, 0, 6, 0];
	tetrominos[5][3].rotation[3] = [0, 0, 0, 0];
	// End T Shape
	
	// Define Z Shape
	// Rotation 0
	tetrominos[6][0].rotation[0] = [7, 7, 0, 0];
	tetrominos[6][0].rotation[1] = [0, 7, 7, 0];
	tetrominos[6][0].rotation[2] = [0, 0, 0, 0];
	tetrominos[6][0].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 1
	tetrominos[6][1].rotation[0] = [0, 0, 7, 0];
	tetrominos[6][1].rotation[1] = [0, 7, 7, 0];
	tetrominos[6][1].rotation[2] = [0, 7, 0, 0];
	tetrominos[6][1].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 2
	tetrominos[6][2].rotation[0] = [7, 7, 0, 0];
	tetrominos[6][2].rotation[1] = [0, 7, 7, 0];
    tetrominos[6][2].rotation[2] = [0, 0, 0, 0];
	tetrominos[6][2].rotation[3] = [0, 0, 0, 0];
	
	// Rotation 3
	tetrominos[6][3].rotation[0] = [0, 0, 7, 0];
	tetrominos[6][3].rotation[1] = [0, 7, 7, 0];
	tetrominos[6][3].rotation[2] = [0, 7, 0, 0];
	tetrominos[6][3].rotation[3] = [0, 0, 0, 0];
	// End Z Shape
} // end loadShapes

function loadGameValues()
{
	currentShape = utilities.randomFromTo(0,6);
	previewShape = utilities.randomFromTo(0,6);
	currentRotation = 0;

	posX = MIDDLE_COL;
	posY = 0;
	collideDown = false;

	isLeftPressed = false;
	isRightPressed = false;
	isDownPressed = false;
	isUpPressed = false;
	isSpaceBarPressed = false;
	wasFindFullRowsCalled = false;

	moveDownCounter = 0;
	moveDownDelay = STARTING_DOWN_DELAY;

	score = 0;
	lines = 0;
	levelLines = 0;
	level = 1;

	hasFullRow = false;
	dyingBlockSize = BLOCK_WIDTH;
	resetFullRows();
	
	resetGameBoard();
} // end loadGameValues

function loadGame()
{
	canvas = document.getElementById('gameBoard');
	context2D = canvas.getContext('2d');
	
	i_image = new Image();
	i_image.src = SOURCE_I_IMAGE;
	
	j_image = new Image();
	j_image.src = SOURCE_J_IMAGE;
	
	l_image = new Image();
	l_image.src = SOURCE_L_IMAGE;
	
	o_image = new Image();
	o_image.src = SOURCE_O_IMAGE;
	
	s_image = new Image();
	s_image.src = SOURCE_S_IMAGE;
	
	t_image = new Image();
	t_image.src = SOURCE_T_IMAGE;
	
	z_image = new Image();
	z_image.src = SOURCE_Z_IMAGE;
	
	gameBoard = new Array();
	for (var i = 0; i < TOTAL_ROWS; i++)
	{
		gameBoard[i] = new Array(TOTAL_COLS);
	}
	
	loadShapes();
	
	fullRows = new Array(4);
	for (var i = 0; i < 4; i++)
	{
		fullRows[i] = -1;
	}
	
	button_BackDownStateImage = new Image();
	button_BackDownStateImage.src = SOURCE_BUTTON_BACK_DOWN;
	button_BackUpStateImage = new Image();
	button_BackUpStateImage.src = SOURCE_BUTTON_BACK_UP;
	button_EndDownStateImage = new Image();
	button_EndDownStateImage.src = SOURCE_BUTTON_END_DOWN;
	button_EndUpStateImage = new Image();
	button_EndUpStateImage.src = SOURCE_BUTTON_END_UP;
	button_PlayGameDownStateImage = new Image();
	button_PlayGameDownStateImage.src = SOURCE_BUTTON_PLAYGAME_DOWN;
	button_PlayGameUpStateImage = new Image();
	button_PlayGameUpStateImage.src = SOURCE_BUTTON_PLAYGAME_UP;
	
	button_Back = new Button(50, 150, 200, 50, button_BackUpStateImage, button_BackDownStateImage, false, true, STATE_UP);
	button_End = new Button(50, 380, 200, 50, button_EndUpStateImage, button_EndDownStateImage, false, true, STATE_UP);
	button_PlayGame = new Button(50, 280, 200, 50, button_PlayGameUpStateImage, button_PlayGameDownStateImage, false, true, STATE_UP);
	
	loadGameValues();    

	if (intervalId != -1) // This means an interval has been set
		clearInterval(intervalId);
		
	intervalId = setInterval(mainLoop, 1000 / FPS);
	gameState = GAME_STATE_START;
} // end loadGame

function resetGameBoard()
{
	for (var i = 0; i < TOTAL_ROWS-1; i++)
	{
		for (var j = 0; j < TOTAL_COLS; j++)
		{
			gameBoard[i][j] = 0;
		}
	}
	gameBoard[TOTAL_ROWS-1] = [8,8,8,8,8,8,8,8,8,8];
} // end resetGameBoard

function mainLoop()
{

		drawHeading();
	if (gameState == GAME_STATE_START)
	{
		button_PlayGame.update(mouseX, mouseY, mpressed, prev_mpressed);
		
		if (button_PlayGame.isPressed == true)
		{
			gameState = GAME_STATE_PLAYING;
			button_PlayGame.isPressed = false;
		}
		
		drawStartScreen();
	} // end game state start

	else if (gameState == GAME_STATE_PLAYING)
	{
		if (!hasFullRow)
		{
			removePieceFromBoard();
			tryToMoveTetromino();
			if (moveDownCounter > moveDownDelay)
			{
				tryToMoveDown();
				moveDownCounter = 0;
			}
			else
				moveDownCounter++;
		
			putPieceOnBoard();
		}
	
		drawBoard();
		drawPreviewTetromino();
	
		if (collideDown)
		{
			if (wasFindFullRowsCalled == false)
				findFullRows();
			
			if (hasFullRow)
			{
				updateDyingSize();
			}
			if (!hasFullRow) // can't be else here because we don't want it going through the entire loop again if "dying" stops.
			{
				arrangeRows();
				nextTetromino();
				collideDown = false;
				wasFindFullRowsCalled = false;
			}
		}
	} // end game state playing
	
	else if (gameState == GAME_STATE_END)
	{
		button_End.update(mouseX, mouseY, mpressed, prev_mpressed);
		
		if (button_End.isPressed == true)
		{
			loadGameValues();
			gameState = GAME_STATE_START;
			button_End.isPressed = false;
		}
	
		drawGameOverScreen();
		drawHeading();
	} // end game state end
} // end mainLoop

function getInput()
{
	if ((37 in keys && keys[37]) || (65 in keys && keys[65]))
	{
		isLeftPressed = true;
	} // end left is pressed
	else
		isLeftPressed = false;
	
	if ((39 in keys && keys[39]) || (68 in keys && keys[68]))
	{
		isRightPressed = true;
	} // end right is pressed
	else
		isRightPressed = false;
	
	if ((40 in keys && keys[40]) || (83 in keys && keys[83]))
	{
		isDownPressed = true;
	} // end down is pressed
	else
		isDownPressed = false;
		
	if ((38 in keys && keys[38]) || (87 in keys && keys[87]))
	{
		isUpPressed = true;
	} // end up is pressed
	else
		isUpPressed = false;
	
	if (32 in keys && keys[32] == true)
	{
		isSpaceBarPressed = true;
	} // end spacebar is pressed
	else
		isSpaceBarPressed = false;
} // end getInput

// check if there is a collision
function checkCollision()
{
    for (var r = 0; r < 4; ++r)
	{
        for (var c = 0; c < 4; ++c)
        {
            if ( (gameBoard[r+posY][c+posX] != 0) && (tetrominos[currentShape][currentRotation].rotation[r][c] != 0) )
			{
				var tempBoardR = gameBoard[r+posY][c+posX];
				var tempBoardRow = r+posY;
				var tempBoardCol = c+posX;
				// There's overlap
                return true;
			}
        } // end for
	}

    return false;
} // end checkCollision

// put the piece on the game board
function putPieceOnBoard()
{
    for (var r = 0; r < 4; ++r)
	{
		for (var c = 0; c < 4; ++c)
		{
            if (tetrominos[currentShape][currentRotation].rotation[r][c] != 0)
                gameBoard[posY+r][posX+c] = currentShape+1;
		}
	}
} // end putPieceOnBoard

function removePieceFromBoard()
{
    for (var r = 0; r < 4; ++r)
        for (var c = 0; c < 4; ++c)
            if (tetrominos[currentShape][currentRotation].rotation[r][c] != 0)
                gameBoard[posY+r][posX+c] = 0;
} // end removePieceFromBoard

// return true if the row is full and needs to be deleted, false otherwise
function isRowFull(row)
{
   var rowFull = 0;
   for (var col = 0; col < TOTAL_COLS; col++)
   {
      if (gameBoard[row][col] != 0)
      {
          rowFull++;
       } // end if
   } // end for
   if (rowFull == TOTAL_COLS)
       return true;
   else
      return false;
} // end isRowFull

function moveRowsDown(n)
{
   var row;
   for (row = n; row > 0; row--)
   {
       for (var col = 0; col < TOTAL_COLS; col++)
       {
           gameBoard[row][col] = gameBoard[row-1][col];
       } // end for
   } // end for
   // this sets the first row to 0's
   unFillOneRow(0);
} // end moveRowsDown

// 0's out 1 row
function unFillOneRow(row)
{
    for (var col = 0; col < TOTAL_COLS; col++)
        gameBoard[row][col] = 0;
} // end unFillOneRow

function findFullRows()
{
	var fullRowIndex = 0;
	for (var row = 0; row < TOTAL_ROWS-1; row++)
    {
		if (isRowFull(row))
        {
			// add the full row number to the fullRows array
			fullRows[fullRowIndex] = row;
			fullRowIndex++;
			hasFullRow = true;
		}
	}
	wasFindFullRowsCalled = true;
} // end findFullRows

// move all the rows down when one is detected to be full
function arrangeRows()
{
	var fullRowIndex = 0;
   for (var row = 0; row < TOTAL_ROWS-1; row++)
   {
       if (isRowFull(row))
       {
            moveRowsDown(row);
            lines = lines + 1;
						score += 10;
			//bases++;
            levelLines = levelLines+1;
            increaseLevel();
       } // end if
   } // end for
} // end arrangeRows

// increment level if it needs to be
function increaseLevel()
{
   if (levelLines == 10)
   {
      level = level + 1;
	  moveDownDelay -= DECREASE_DOWN_DELAY;
      // Don't let the drop time get below MIN_DOWN_DELAY
      if (moveDownDelay < MIN_DOWN_DELAY)
		moveDownDelay = MIN_DOWN_DELAY;
      levelLines = 0;
   } // end if
} // end increaseLevel

// gets the next piece, sets rotation and x and y cordinates
function nextTetromino()
{
	currentShape = previewShape;
	previewShape = utilities.randomFromTo(0,6);
    currentRotation = 0;
    posX = MIDDLE_COL;
    posY = 0;
    if (checkCollision())
    {
       gameState = GAME_STATE_END;
    } // end if
} // end nextPiece

// try to move, move back if you can't
function tryToMoveTetromino()
{
	if (isLeftPressed)
	{
		--posX;
		if (checkCollision())
			++posX;
	
		isLeftPressed = false;
	}
	
	else if (isRightPressed)
	{
		++posX;
		if (checkCollision())
			--posX;
	
		isRightPressed = false;
	}
	
	else if (isDownPressed)
	{
		++posY;
		if (checkCollision())
		{
			--posY;
			collideDown = true;
		} // end if
	}
	
	else if (isSpaceBarPressed)
	{
		while (collideDown == false)
		{
			++posY;
			if (checkCollision())
			{
				--posY;
				collideDown = true;
			} // end if
		} // end while
		isSpaceBarPressed = false;
	} // end space bar is pressed
	
	if (isUpPressed)
	{
		var oldRotation = currentRotation;
		currentRotation = (currentRotation + 1) & 3;
	
		if (checkCollision())
		{
			currentRotation = oldRotation;
		} // end if
		
		isUpPressed = false;
	} // end is up pressed
} // end tryToMoveTetromino

// try to move down, move back if you can't
function tryToMoveDown()
{
	++posY;
	if (checkCollision())
	{
		--posY;
		 collideDown = true;
	} // end if
} // end tryToMoveDown

// Returns true if the row is in the array of full rows, false otherwise.
function isRowInFullRows(row)
{
	for (var i = 0; i < fullRows.length; i++)
	{
		if (fullRows[i] == row)
			return true;
	}
	
	return false;
} // end isRowInFullRows

function resetFullRows()
{
	for (var i = 0; i < fullRows.length; i++)
	{
		fullRows[i] = -1;
	}
} // end resetFullRows

function updateDyingSize()
{
	dyingBlockSize -= DYING_VALUE;
	if (dyingBlockSize <= 0) // Blocks are removed, so reset everything for dying rows and continue game.
	{
		hasFullRow = false;
		resetFullRows();
		dyingBlockSize = BLOCK_WIDTH;
	}
} // end updateDyingSize

// This is the preview of the next piece that will drop
function drawPreviewTetromino()
{
	context2D.fillStyle="grey";
	context2D.fillRect(340, 350, 100, 100); // was 220
	context2D.fillStyle="white";
	context2D.fillRect(338, 350, 2, 100); // Left
	context2D.fillRect(338, 450, 102, 2); // Bottom // was 320
	context2D.fillRect(440, 350, 2, 102); // Right
	context2D.fillRect(338, 350, 102, 2); // Up
   for (var r = 0; r < 4; ++r)
   {
        for (var c = 0; c < 4; ++c)
        {
            if (tetrominos[previewShape][0].rotation[r][c] == 1)
              context2D.drawImage(i_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10); // was 250
			 
            else if (tetrominos[previewShape][0].rotation[r][c] == 2)
              context2D.drawImage(j_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10);
			 
			else if (tetrominos[previewShape][0].rotation[r][c] == 3)
              context2D.drawImage(l_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10);
			
            else if (tetrominos[previewShape][0].rotation[r][c] == 4)
              context2D.drawImage(o_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10);
			  
			else if (tetrominos[previewShape][0].rotation[r][c] == 5)
              context2D.drawImage(s_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10);
			  
			else if (tetrominos[previewShape][0].rotation[r][c] == 6)
              context2D.drawImage(t_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10);
			 
			else if (tetrominos[previewShape][0].rotation[r][c] == 7)
              context2D.drawImage(z_image, c*(BLOCK_WIDTH-10)+345, r*(BLOCK_HEIGHT-10)+380, BLOCK_WIDTH-10, BLOCK_HEIGHT-10); 
        } // end for
   } // end for
} // end drawPreviewTetromino

function drawBoard()
{
	context2D.fillStyle="grey";
	context2D.fillRect(1, 2, 320, 576);
	
	for (var row = 0; row < TOTAL_ROWS; row++)
    {
		for (var col = 0; col < TOTAL_COLS; col++)
		{
			if (gameBoard[row][col] == 1)
			{
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(i_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(i_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
			
			else if (gameBoard[row][col] == 2)
			{
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(j_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(j_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
			
			else if (gameBoard[row][col] == 3)
			{
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(l_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(l_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
            	
			else if (gameBoard[row][col] == 4)
			{
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(o_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(o_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
		
			else if (gameBoard[row][col] == 5)
            {
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(s_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(s_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
			
			else if (gameBoard[row][col] == 6)
			{
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(t_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(t_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
		
			else if (gameBoard[row][col] == 7)
			{
				if (hasFullRow && isRowInFullRows(row)) // if there is a full row and the current row is one of those full rows, draw for "dying" row
				{
					context2D.drawImage(z_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, dyingBlockSize, dyingBlockSize);
				}
				else // else draw regular
					context2D.drawImage(z_image, col*BLOCK_WIDTH, row*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
       } // end for
    } // end for
} // end drawBoard

function drawStartScreen()
{
	context2D.fillStyle="grey";
	context2D.fillRect(1, 2, 320, 576);
	context2D.fillStyle="white";
	context2D.fillRect(1, 2, 2, PLAYING_HEIGHT); // Left
	context2D.fillRect(1, PLAYING_HEIGHT, PLAYING_WIDTH, 2); // Bottom
	context2D.fillRect(PLAYING_WIDTH, 2, 2, PLAYING_HEIGHT); // Right
	utilities.drawCanvasText(context2D, "My Tetris Clone:", 20, 50, "lime", "34px Tahoma");
	utilities.drawCanvasText(context2D, "Javascript Edition", 20, 100, "lime", "34px Tahoma");
	utilities.drawCanvasText(context2D, "My Tetris Clone: Javascript Edition is part of a project", 20, 120, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "to implement Tetris using different programming", 20, 140, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "languages and frameworks. This implementation", 20, 160, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "is in Javascript using Electron to run on the desktop.", 20, 180, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "To see the complete list or contribute to the project,", 20, 200, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "visit the GitHub repository at the link below.", 20, 220, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "Thanks for playing.", 20, 240, "lime", "12px Tahoma");
	utilities.drawCanvasText(context2D, "https://github.com/cwl157/mytetrisclones", 20, 260, "lime", "12px Tahoma");
	button_PlayGame.draw(context2D);
} // end drawStartScreen

function drawGameOverScreen()
{
	context2D.fillStyle="grey";
	context2D.fillRect(1, 2, 320, 576);
	context2D.fillStyle="white";
	context2D.fillRect(1, 2, 2, PLAYING_HEIGHT); // Left
	context2D.fillRect(1, PLAYING_HEIGHT, PLAYING_WIDTH, 2); // Bottom
	context2D.fillRect(PLAYING_WIDTH, 2, 2, PLAYING_HEIGHT); // Right
	
	context2D.fillStyle="black";
	context2D.fillRect(322, 0, 130, canvas.height);
	
	utilities.drawCanvasText(context2D, "Thanks for Playing!", 20, 200, "lime", "34px Tahoma");
	button_End.draw(context2D);
} // end drawGameOverScreen

function drawHeading()
{
	context2D.fillStyle="white";
	context2D.fillRect(1, 2, 2, PLAYING_HEIGHT); // Left
	context2D.fillRect(1, PLAYING_HEIGHT, PLAYING_WIDTH, 2); // Bottom
	context2D.fillRect(PLAYING_WIDTH, 2, 2, PLAYING_HEIGHT); // Right
	
	context2D.fillStyle="black";
	context2D.fillRect(322, 0, 130, canvas.height);
	
	utilities.drawCanvasText(context2D, "My Tetris Clone", 335, 30, "lime", "22px Tahoma");
	utilities.drawCanvasText(context2D, "Total Lines: "+lines, 325, 70, "white", "16px Tahoma");
	utilities.drawCanvasText(context2D, "Level: "+level, 325, 100, "white", "16px Tahoma");
	utilities.drawCanvasText(context2D, "Score: "+score, 325, 130, "white", "16px Tahoma");
	utilities.drawCanvasText(context2D, "Preview:", 325, 340, "white", "16px Tahoma");
} // end drawHeading()