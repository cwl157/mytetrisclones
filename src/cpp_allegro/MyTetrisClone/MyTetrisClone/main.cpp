#include <stdio.h>
#include <allegro5/allegro.h>
#include <allegro5/allegro_font.h>
#include <allegro5/allegro_primitives.h>

#define KEY_SEEN     1
#define KEY_RELEASED 2

void displayPreviewPiece();
void increaseLevel();
void drawBorder(int x, int y, int width, int height, int borderSize, ALLEGRO_COLOR color);

const int SCREEN_WIDTH = 600;
const int SREEN_HEIGHT = 800;
const int BOARD_WIDTH =  14;
const int BOARD_HEIGHT = 22;
const int BLOCK_SIZE = 32;
const int GAME_STATE_START = 1;
const int GAME_STATE_PLAYING = 2;
const int GAME_STATE_END = 3;

typedef struct {
	ALLEGRO_COLOR BlockColor;
	ALLEGRO_COLOR BorderColor;
} PIECE;

PIECE pieces[8];
int gameBoard[BOARD_HEIGHT][BOARD_WIDTH] =
  { {0, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 0},
	{ 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0, 8, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0 },
	{ 0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0 },
	{ 0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0 },
	{ 0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0 },
	{ 0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0 },
	{ 0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0 },
	{ 0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0 },
	{ 0,8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,0 },
};

int shapeArray[7][4][4][4]
{
	{
		{
			{ 0, 0, 1, 0},
			{ 0, 0, 1, 0},
			{ 0, 0, 1, 0},
			{ 0, 0, 1, 0}
		},
		{
			{ 0, 0, 0, 0},
			{ 0, 0, 0, 0},
			{ 1, 1, 1, 1},
			{ 0, 0, 0, 0}
		},
		{
			{ 0, 1, 0, 0},
			{ 0, 1, 0, 0},
			{ 0, 1, 0, 0},
			{ 0, 1, 0, 0}
		},
		{
			{ 0, 0, 0, 0},
			{ 1, 1, 1, 1},
			{ 0, 0, 0, 0},
			{ 0, 0, 0, 0}
		}
	},
	{
{
	{0, 0, 0, 0},
	{0, 2, 2, 2},
	{0, 0, 2, 0},
	{0, 0, 0, 0}
},
{
	{0, 0, 2, 0},
	{0, 2, 2, 0},
	{0, 0, 2, 0},
	{0, 0, 0, 0}
},
{
	{0, 0, 2, 0},
	{0, 2, 2, 2},
	{0, 0, 0, 0},
	{0, 0, 0, 0}
},
{
	{0, 0, 2, 0},
	{0, 0, 2, 2},
	{0, 0, 2, 0},
	{0, 0, 0, 0}
}
}
,
{
	{
		{0, 3, 3, 0},
		{0, 3, 3, 0},
		{0, 0, 0, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 3, 3, 0},
		{0, 3, 3, 0},
		{0, 0, 0, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 3, 3, 0},
		{0, 3, 3, 0},
		{0, 0, 0, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 3, 3, 0},
		{0, 3, 3, 0},
		{0, 0, 0, 0},
		{0, 0, 0, 0}
	}
}
,
{
	{
		{0, 0, 0, 0},
		{0, 4, 4, 4},
		{0, 0, 0, 4},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 4, 0},
		{0, 0, 4, 0},
		{0, 4, 4, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 4, 0, 0},
		{0, 4, 4, 4},
		{0, 0, 0, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 4, 4},
		{0, 0, 4, 0},
		{0, 0, 4, 0},
		{0, 0, 0, 0}
	}
}
,
{
	{
		{0, 0, 0, 0},
		{0, 5, 5, 0},
		{0, 0, 5, 5},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 0, 0},
		{0, 0, 5, 0},
		{0, 5, 5, 0},
		{0, 5, 0, 0}
	},
	{
		{0, 0, 0, 0},
		{5, 5, 0, 0},
		{0, 5, 5, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 5, 0},
		{0, 5, 5, 0},
		{0, 5, 0, 0},
		{0, 0, 0, 0}
	}
}
,
{
	{
		{0, 0, 0, 0},
		{0, 0, 6, 6},
		{0, 6, 6, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 0, 0},
		{0, 6, 0, 0},
		{0, 6, 6, 0},
		{0, 0, 6, 0}
	},
	{
		{0, 0, 0, 0},
		{0, 6, 6, 0},
		{6, 6, 0, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 0, 0},
		{0, 6, 0, 0},
		{0, 6, 6, 0},
		{0, 0, 6, 0}
	}
}
,
{
	{
		{0, 0, 0, 0},
		{0, 7, 7, 7},
		{0, 7, 0, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 0, 0, 0},
		{0, 7, 7, 0},
		{0, 0, 7, 0},
		{0, 0, 7, 0}
	},
	{
		{0, 0, 0, 0},
		{0, 0, 7, 0},
		{7, 7, 7, 0},
		{0, 0, 0, 0}
	},
	{
		{0, 7, 0, 0},
		{0, 7, 0, 0},
		{0, 7, 7, 0},
		{0, 0, 0, 0}
	}
 }
};

int shape = rand() % 7;
int previewShape = rand() % 7;
int rotation;
int xPos = 6;
int yPos;
int score;
int level;
int lines;
int levelLines;
bool gameOver = false;
bool gamePaused = false;
bool collideDown = false;
bool quit = false;
int gameState = GAME_STATE_START;
int moveDownCounter = 0;
int moveDownTime = 20;
const int moveDownDecrement = 1;
int keyDelayCounter = 0;
const int keyDelay = 2;
char scoreText[255];
char levelText[255];
char linesText[255];
char titleText[255] = "My Tetris Clone: cpp Allegro Edition";
char pauseText[255] = "Paused";
char exitText[255] = "Press ESC to Exit";
char playText[255] = "Press Enter to Play";
char descriptionText[7][512] = { { "My Tetris Clone: cpp Allegro Edition" },
								 { "My Tetris Clone: cpp Allegro Edition is part of a project to implement" },
								 { "Tetris using different programming languages and frameworks." },
								 { "This implementation is in C++ using the Allegro game programming" },
								 { "library. To see the complete list or contribute to the project," },
								 { "visit the GitHub repository at the link below. Thanks for playing." },
								 { "https://github.com/cwl157/mytetrisclones" }
                               };

void initAllegroComponent(bool initResult, const char *description)
{
	if (initResult) return;

	printf("couldn't initialize %s\n", description);
	exit(1);
}

void initPieces() {
	// i
	pieces[0].BlockColor = al_map_rgb(255, 102, 0);
	pieces[0].BorderColor = al_map_rgb(168, 84, 0);

	// t
	pieces[1].BlockColor = al_map_rgb(0, 255, 255);
	pieces[1].BorderColor = al_map_rgb(0, 128, 128);

	// Square
	pieces[2].BlockColor = al_map_rgb(0, 255, 0);
	pieces[2].BorderColor = al_map_rgb(0, 128, 0);

	// Backward L
	pieces[3].BlockColor = al_map_rgb(255, 0, 0);
	pieces[3].BorderColor = al_map_rgb(128, 0, 0);

	// ZigZagLeft
	pieces[4].BlockColor = al_map_rgb(255, 0, 255);
	pieces[4].BorderColor = al_map_rgb(128, 0, 128);

	// ZigZagRight
	pieces[5].BlockColor = al_map_rgb(155, 128, 64);
	pieces[5].BorderColor = al_map_rgb(128, 64, 0);

	// L
	pieces[6].BlockColor = al_map_rgb(255, 255, 0);
	pieces[6].BorderColor = al_map_rgb(128, 128, 0);

	// Border block
	pieces[7].BlockColor = al_map_rgb(192, 192, 192);
	pieces[7].BorderColor = al_map_rgb(128, 128, 128);

}

void resetGameBoard()
{
	for (int row = 1; row < BOARD_HEIGHT - 1; row++)
	{
		for (int col = 2; col < BOARD_WIDTH - 2; col++)
			gameBoard[row][col] = 0;
	} // end for
	gameBoard[0][0] = 0;
	gameBoard[0][1] = 8;
	gameBoard[0][2] = 8;
	gameBoard[0][3] = 8;
	gameBoard[0][4] = 8;
	gameBoard[0][5] = 8;
	gameBoard[0][6] = 8;
	gameBoard[0][7] = 0;
	gameBoard[0][8] = 0;
	gameBoard[0][9] = 8;
	gameBoard[0][10] = 8;
	gameBoard[0][11] = 8;
	gameBoard[0][12] = 8;
	gameBoard[0][13] = 0;
}

void resetGame()
{
	resetGameBoard();
	score = 0;
	level = 0;
	lines = 0;
	levelLines = 0;
	moveDownCounter = 0;
	moveDownTime = 20;
	keyDelayCounter = 0;
	shape = rand() % 7;
	previewShape =  rand() % 7;
	collideDown = false;
	gameOver = false;
	rotation = 0;
	xPos = 6;
	yPos = 0;
	gamePaused = false;
}

// put the piece on the gameBoard
void putPieceOnBoard()
{
	//displayPreviewPiece();
	for (int r = 0; r < 4; ++r)
		for (int c = 0; c < 4; ++c)
			if (shapeArray[shape][rotation][r][c] != 0)
				gameBoard[yPos + r][xPos + c] = shape + 1;
} // end putPieceOnBoard

void removePieceFromBoard()
{
	for (int r = 0; r < 4; ++r)
		for (int c = 0; c < 4; ++c)
			if (shapeArray[shape][rotation][r][c] != 0)
				gameBoard[yPos + r][xPos + c] = 0;
} // end removePieceFromBoard

// check if there is a collision
bool checkCollision()
{
	for (int r = 0; r < 4; ++r)
		for (int c = 0; c < 4; ++c)
		{
			if ((gameBoard[r + yPos][c + xPos] != 0) && (shapeArray[shape][rotation][r][c] != 0))
				// There's overlap
				return true;
		} // end for

	return false;
} // end checkCollision

// gets the next piece, sets rotation and x and y cordinates
void nextShape()
{
	shape = previewShape;
	previewShape = rand() % 7;
	rotation = 0;
	xPos = 6; //or wherever the middle of your board is
	yPos = 0;
	if (checkCollision())
	{
		gameOver = true;
	} // end if
} // end nextPiece


// this returns the next rotation
// it sets the rotation to either a 0, 1, 2, or 3
void rotate()
{
	rotation = (rotation + 1) & 3;
	if (checkCollision())
		rotation = (rotation - 1) & 3;
} // end rotate

// try to move left, move back if you can't
void tryToMoveLeft()
{
	--xPos;
	if (checkCollision())
		++xPos;
} // end tryToMoveLeft

// try to move right, move back if you can't
void tryToMoveRight()
{
	++xPos;
	if (checkCollision())
		--xPos;
} // end tryToMoveRight

// try to move down, move back if you can't
void tryToMoveDown()
{
	++yPos;
	if (checkCollision())
	{
		--yPos;
		collideDown = true;
	} // end if
} // end tryToMoveDown

// rotate if you can, if you can't go back to old rotation
void tryToRotate()
{
	int oldRotation = rotation;
	rotation = (rotation + 1) & 3;
	if (checkCollision())
	{
		rotation = oldRotation;
	} // end if
	//cout << "the rotation inside the function is " << rotation << endl;
} // tryToRotate

// return true if the row is full and needs to be deleted, false otherwise
bool isRowFull(int row)
{
	int rowFull = 0;
	for (int col = 1; col < BOARD_WIDTH-1; col++)
	{
		if (gameBoard[row][col] != 0)
		{
			rowFull++;
		} // end if
	} // end for
	if (rowFull == BOARD_WIDTH-2)
		return true;
	else
		return false;
} // end isRowFull

// test the row full function fill up a row with 1's and see if it returns true;
void fillRow(int row)
{
	for (int col = 1; col < BOARD_WIDTH - 1; col++)
	{
		gameBoard[row][col] = 1;
	} // end for
} // end fillRow

// unfill 1 row
void unFillOneRow(int row)
{
	for (int col = 2; col < BOARD_WIDTH - 2; col++)
		gameBoard[row][col] = 0;
} // end unFillOneRow

void moveRowsDown(int n)
{
	int row;
	for (row = n; row > 1; row--)
	{
		for (int col = 2; col < BOARD_WIDTH - 2; col++)
		{
			gameBoard[row][col] = gameBoard[row - 1][col];
		} // end for
	} // end for
	// this sets the first row to 0's
	unFillOneRow(1);
} // end moveRowsDown

// move all the rows down when one is detected to be full
void arrangeRows()
{
	for (int row = 1; row < BOARD_HEIGHT - 1; row++)
	{
		if (isRowFull(row))
		{
			moveRowsDown(row);
			lines = lines + 1;
			levelLines = levelLines + 1;
			increaseLevel();
			score = score + 10;
		} // end if
	} // end for
} // end arrangeRows

// increment level if it needs to be
void increaseLevel()
{
	if (levelLines == 10)
	{
		level = level + 1;
		// we don't want it reaching 0
		if (moveDownTime > moveDownDecrement)
		{
			moveDownTime -= moveDownDecrement;
		}
		levelLines = 0;
	} // end if
} // end increaseLevel

void displayPreviewPiece()
{
	ALLEGRO_COLOR blockColor = al_map_rgb(0, 0, 0);
	ALLEGRO_COLOR borderColor = al_map_rgb(0, 0, 0);
	for (int r = 0; r < 4; ++r)
	{
		for (int c = 0; c < 4; ++c)
		{
			int x = c * BLOCK_SIZE + 400;
			int y = r * BLOCK_SIZE + 400;
			if (shapeArray[previewShape][0][r][c] == 1)
			{
				blockColor = pieces[0].BlockColor;
				borderColor = pieces[0].BorderColor;
			}
			else if (shapeArray[previewShape][0][r][c] == 2)
			{
				blockColor = pieces[1].BlockColor;
				borderColor = pieces[1].BorderColor;
			}
			else if (shapeArray[previewShape][0][r][c] == 3)
			{
				blockColor = pieces[2].BlockColor;
				borderColor = pieces[2].BorderColor;
			}
			else if (shapeArray[previewShape][0][r][c] == 4)
			{
				blockColor = pieces[3].BlockColor;
				borderColor = pieces[3].BorderColor;
			}
			if (shapeArray[previewShape][0][r][c] == 5)
			{
				blockColor = pieces[4].BlockColor;
				borderColor = pieces[4].BorderColor;

			}
			if (shapeArray[previewShape][0][r][c] == 6)
			{
				blockColor = pieces[5].BlockColor;
				borderColor = pieces[5].BorderColor;
			}
			if (shapeArray[previewShape][0][r][c] == 7)
			{
				blockColor = pieces[6].BlockColor;
				borderColor = pieces[6].BorderColor;
			}
			if (shapeArray[previewShape][0][r][c] == 8)
			{
				blockColor = pieces[7].BlockColor;
				borderColor = pieces[7].BorderColor;
			}
			if (shapeArray[previewShape][0][r][c] > 0)
			{
				al_draw_filled_rectangle(x, y, x + BLOCK_SIZE, y + BLOCK_SIZE, blockColor);
				drawBorder(x, y, BLOCK_SIZE, BLOCK_SIZE, 3, borderColor);
			}
		} // end for
	} // end for
} // end displayPreviewPiece

void drawBorder(int x, int y, int width, int height, int borderSize, ALLEGRO_COLOR color)
{
	// Top
	al_draw_filled_rectangle(x, y, x+width, y+borderSize, color);
	// Left
	al_draw_filled_rectangle(x, y, x+borderSize, y+height, color);
	// Right
	al_draw_filled_rectangle((x + width - borderSize), y, (x + width), y+height, color);
	// Bottom
	al_draw_filled_rectangle(x, y + height - borderSize, x+width, y+height, color);
}

void drawGameBoard()
{
	ALLEGRO_COLOR blockColor = al_map_rgb(0, 0, 0);
	ALLEGRO_COLOR borderColor = al_map_rgb(0, 0, 0);

	for (int row = 0; row < BOARD_HEIGHT; row++)
	{
		for (int col = 0; col < BOARD_WIDTH; col++)
		{	
			int x = col * BLOCK_SIZE;
			int y = row * BLOCK_SIZE;
			if (gameBoard[row][col] == 1)
			{
				blockColor = pieces[0].BlockColor;
				borderColor = pieces[0].BorderColor;
			}
			else if (gameBoard[row][col] == 2)
			{
				blockColor = pieces[1].BlockColor;
				borderColor = pieces[1].BorderColor;
			}

			else if (gameBoard[row][col] == 3)
			{
				blockColor = pieces[2].BlockColor;
				borderColor = pieces[2].BorderColor;
			}
			else if (gameBoard[row][col] == 4)
			{
				blockColor = pieces[3].BlockColor;
				borderColor = pieces[3].BorderColor;
			}
			else if (gameBoard[row][col] == 5)
			{
				blockColor = pieces[4].BlockColor;
				borderColor = pieces[4].BorderColor;
			}
			else if (gameBoard[row][col] == 6)
			{
				blockColor = pieces[5].BlockColor;
				borderColor = pieces[5].BorderColor;
			}
			else if (gameBoard[row][col] == 7)
			{
				blockColor = pieces[6].BlockColor;
				borderColor = pieces[6].BorderColor;
			}
			if (gameBoard[row][col] == 8)
			{
				blockColor = pieces[7].BlockColor;
				borderColor = pieces[7].BorderColor;
			}
			if (gameBoard[row][col] > 0)
			{
				al_draw_filled_rectangle(x, y, x + BLOCK_SIZE, y + BLOCK_SIZE, blockColor);
				drawBorder(x, y, BLOCK_SIZE, BLOCK_SIZE, 3, borderColor);
			}

		} // end for
	} // end for
} // end displayGameBoard

int main()
{
	double FPS = 30.0;

	initAllegroComponent(al_init(), "allegro");
	initAllegroComponent(al_install_keyboard(), "keyboard");
	initAllegroComponent(al_init_primitives_addon(), "primitives");

	ALLEGRO_TIMER* timer = al_create_timer(1.0 / FPS);
	initAllegroComponent(timer, "timer");

	ALLEGRO_EVENT_QUEUE* queue = al_create_event_queue();
	initAllegroComponent(queue, "event queue");

	ALLEGRO_DISPLAY* disp = al_create_display(SCREEN_WIDTH, SREEN_HEIGHT);
	initAllegroComponent(disp, "display");

	ALLEGRO_FONT* font = al_create_builtin_font();
	initAllegroComponent(font, "font");

	al_register_event_source(queue, al_get_keyboard_event_source());
	al_register_event_source(queue, al_get_display_event_source(disp));
	al_register_event_source(queue, al_get_timer_event_source(timer));

	bool done = false;
	bool redraw = true;
	ALLEGRO_EVENT event;

	initPieces();
	resetGameBoard();

	unsigned char key[ALLEGRO_KEY_MAX];
	memset(key, 0, sizeof(key));

	al_start_timer(timer);
	while (1)
	{
		al_wait_for_event(queue, &event);

		switch (event.type)
		{
			case ALLEGRO_EVENT_TIMER:
				if (gameState == GAME_STATE_START)
				{
					if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_ENTER])
					{
						resetGame();
						keyDelayCounter = 0;
						gameState = GAME_STATE_PLAYING;
					}
				}
				else if (gameState == GAME_STATE_PLAYING)
				{
					if (!gamePaused)
					{
						removePieceFromBoard();
						if (moveDownCounter > moveDownTime)
						{
							tryToMoveDown();
							moveDownCounter = 0;
						}

						if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_UP])
						{
							tryToRotate();
							keyDelayCounter = 0;
						}
						if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_DOWN])
						{
							tryToMoveDown();
							keyDelayCounter = 0;
						}
						if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_LEFT])
						{
							tryToMoveLeft();
							keyDelayCounter = 0;
						}
						if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_RIGHT])
						{
							tryToMoveRight();
							keyDelayCounter = 0;
						}
					}
					if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_P])
					{
						keyDelayCounter = 0;
						if (gamePaused)
						{
							gamePaused = false;
						}
						else
							gamePaused = true;
					}
					putPieceOnBoard();

					if (collideDown)
					{
						arrangeRows();
						nextShape();
						collideDown = false;
					} // end if
					
					if (!gamePaused)
					{
						moveDownCounter++;
					}
					sprintf_s(scoreText, "Score: %d", score);
					sprintf_s(levelText, "Level: %d", level);
					sprintf_s(linesText, "Lines: %d", lines);

					if (gameOver)
					{
						gameState = GAME_STATE_END;
					}
				} // end game state playing

				else if (gameState == GAME_STATE_END)
				{
					if (keyDelayCounter > keyDelay && key[ALLEGRO_KEY_ENTER])
					{
						keyDelayCounter = 0;
						gameState = GAME_STATE_START;
					}
				}

				if (key[ALLEGRO_KEY_ESCAPE])
					done = true;

				for (int i = 0; i < ALLEGRO_KEY_MAX; i++)
					key[i] &= KEY_SEEN;
				keyDelayCounter++;
				redraw = true;
				break;
			case ALLEGRO_EVENT_KEY_DOWN:
				key[event.keyboard.keycode] = KEY_SEEN | KEY_RELEASED;
				break;
			case ALLEGRO_EVENT_KEY_UP:
				key[event.keyboard.keycode] &= KEY_RELEASED;
				break;
			case ALLEGRO_EVENT_DISPLAY_CLOSE:
				done = true;
				break;
		}

		if (done)
			break;

		if (redraw && al_is_event_queue_empty(queue))
		{
			al_clear_to_color(al_map_rgb(0, 0, 0));
			if (gameState == GAME_STATE_START)
			{
				for (int i = 0; i < 7; i++)
				{
					al_draw_text(font, al_map_rgb(255, 255, 255), 32, i * 20 + 32, 0, descriptionText[i]);
				}
				al_draw_text(font, al_map_rgb(255, 255, 255), 32, 300, 0, exitText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 300, 300, 0, playText);
			}
			else if (gameState == GAME_STATE_PLAYING)
			{
				al_draw_text(font, al_map_rgb(255, 255, 255), 420, 32, 0, scoreText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 420, 52, 0, levelText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 420, 72, 0, linesText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 32, 732, 0, titleText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 256, 732, 0, "Press P to Pause Game");
				al_draw_text(font, al_map_rgb(255, 255, 255), 256, 764, 0, exitText);
				if (gamePaused)
				{
					al_draw_text(font, al_map_rgb(255, 255, 255), 420, 160, 0, pauseText);
				}
				drawGameBoard();
				displayPreviewPiece();
			}
			else if (gameState == GAME_STATE_END)
			{
				al_draw_text(font, al_map_rgb(255, 255, 255), 100, 32, 0, titleText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 100, 64, 0, "Thanks for Playing!");
				al_draw_text(font, al_map_rgb(255, 255, 255), 100, 96, 0, scoreText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 100, 128, 0, levelText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 100, 160, 0, linesText);
				al_draw_text(font, al_map_rgb(255, 255, 255), 100, 192, 0, "Visit Us On Github: https://github.com/cwl157/mytetrisclones");
				al_draw_text(font, al_map_rgb(255, 255, 255), 256, 288, 0, "Press Enter to Play Again");
				al_draw_text(font, al_map_rgb(255, 255, 255), 32, 288, 0, exitText);
			}
			al_flip_display();

			redraw = false;
		}
	}

	al_destroy_font(font);
	al_destroy_display(disp);
	al_destroy_timer(timer);
	al_destroy_event_queue(queue);

	return 0;
}