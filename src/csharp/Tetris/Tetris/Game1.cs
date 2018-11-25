using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Tetris
{
    public enum GameState
    {
        Start,
        Playing,
        Gameover
    }
    public struct Piece
    {
        public Color BlockColor;
        public Texture2D Block;
        public Color BorderColor;

        public Piece(Color blkc, Texture2D b, Color bc)
        {
            BlockColor = blkc;
            Block = b;
            BorderColor = bc;

            Color[] data = new Color[32 * 32]; // unique
            for (int i = 0; i < data.Length; ++i) data[i] = blkc;
            Block.SetData(data); // unique
        }
    }

    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game1 : Game
    {
        private const int Height = 22;
        private const int Width = 14;
        private const int BlockSize = 32;

        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        Rectangle blockRect;
        Texture2D pixel;
        Piece[] pieces;
        Texture2D borderBlock;
        Color borderBlockColor;
        int shape;
        int previewShape;
        int rotation;
        int xPos = 6;
        int yPos;
        private KeyboardState oldState;
        int score;
        int level;
        int lines;
        int levelLines;
        double moveDownCounter;
        double moveDownTime;
        double moveDownDecrement;
        double movementCounter;
        double movementTime;
        public RNGCryptoServiceProvider RandomNumberProvider;
        byte[] randomNumberBytes;
        private int[,] gameBoard;
        int[,,,] shapeArray;
        bool collideDown;
        private SpriteFont font;
        private GameState currentGameState;
        private string title;
        private string[] description;
        bool isGameOver;
        bool isPaused;

        public Game1()
        {
            graphics = new GraphicsDeviceManager(this);
            RandomNumberProvider = new RNGCryptoServiceProvider();
            randomNumberBytes = new byte[4];
            graphics.PreferredBackBufferHeight = 800;
            graphics.PreferredBackBufferWidth = 600;
            graphics.ApplyChanges();
            Content.RootDirectory = "Content";
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);
            font = Content.Load<SpriteFont>("TextFont"); // Use the name of your sprite font file here instead of 'Score'.
            // Somewhere in your LoadContent() method:
            pixel = new Texture2D(GraphicsDevice, 1, 1, false, SurfaceFormat.Color);
            pixel.SetData(new[] { Color.White }); // so that we can draw whatever color we want on top of it
            pieces = new Piece[8];

            title = "My Tetris Clone: csharp Edition";
            description = new string[9];
            description[0] = "My Tetris Clone: csharp Edition is part of a";
            description[1] = "project to implement Tetris in different";
            description[2] = "programming languages and frameworks. This";
            description[3] = "implementation is in C#, .NET, and MonoGame.";
            description[4] = "To see the complete list or contribute to the";
            description[5] = "project, visit the GitHub repository at the";
            description[6] = "link below. Thanks for playing.";
            description[7] = "https://github.com/cwl157/mytetrisclones";
            description[8] = "Press Enter to Play";

            borderBlock = new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize); // unique?
            Color[] data = new Color[32 * 32]; // unique
            for (int i = 0; i < data.Length; ++i) data[i] = new Color(192, 192, 192);
            borderBlock.SetData(data); // unique
            blockRect = new Rectangle(0, 0, BlockSize, BlockSize); // Reuse for entire board
            borderBlockColor = new Color(128, 128, 128); // specific
            currentGameState = GameState.Start;
            // i
            pieces[0] = new Piece(new Color(255, 102, 0), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(168, 84, 0));
            // t
            pieces[1] = new Piece(new Color(0, 255, 255), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(0, 128, 128));
            // Square
            pieces[2] = new Piece(new Color(0, 255, 0), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(0, 128, 0));
            // Backward L
            pieces[3] = new Piece(new Color(255, 0, 0), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(128, 0, 0));
            // ZigZagLeft
            pieces[4] = new Piece(new Color(255, 0, 255), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(128, 0, 128));
            // ZigZagRight
            pieces[5] = new Piece(new Color(255, 128, 64), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(128, 64, 0));
            // L
            pieces[6] = new Piece(new Color(255, 255, 0), new Texture2D(graphics.GraphicsDevice, BlockSize, BlockSize), new Color(128, 128, 0));

            gameBoard = new int[Height, Width]
                               {{0, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8,0},
                                {0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},

                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0, 8, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,0},
                                {0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0},
                                {0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0},
                                {0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0},
                                {0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0},
                                {0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0},
                                {0,8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 8,0},
                                {0,8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,0},
                               };

            shapeArray = new int[7, 4, 4, 4]
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

            score = 0;
            level = 0;
            lines = 0;
            levelLines = 0;
            moveDownCounter = 0f;
            moveDownTime = 1f;
            moveDownDecrement = 0.1f;
            movementCounter = 0.0f;
            movementTime = 0.1f;
            RandomNumberProvider.GetBytes(randomNumberBytes);
            int randomInteger = BitConverter.ToInt32(randomNumberBytes, 0);
            randomInteger = Math.Abs(randomInteger);
            shape = randomInteger % 7;
            RandomNumberProvider.GetBytes(randomNumberBytes);
            randomInteger = BitConverter.ToInt32(randomNumberBytes, 0);
            randomInteger = Math.Abs(randomInteger);
            previewShape = randomInteger % 7;
            collideDown = false;
            isGameOver = false;
            rotation = 0;
            xPos = 6;
            yPos = 0;
            isPaused = false;
        }
    
    
        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// game-specific content.
        /// </summary>
        protected override void UnloadContent()
        {
            RandomNumberProvider.Dispose();
        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {
            KeyboardState newState = Keyboard.GetState();
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
                Exit();

            if (currentGameState == GameState.Start)
            {
                if (oldState.IsKeyUp(Keys.Enter) && newState.IsKeyDown(Keys.Enter))
                {
                    resetGame();
                    currentGameState = GameState.Playing;
                }
                oldState = newState;
            }
            else if (currentGameState == GameState.Playing)
            {
                if (!isPaused)
                {
                    moveDownCounter += gameTime.ElapsedGameTime.TotalSeconds;
                    movementCounter += gameTime.ElapsedGameTime.TotalSeconds;
                    removePieceFromBoard();
                    if (moveDownCounter > moveDownTime)
                    {
                        tryToMoveDown();
                        moveDownCounter = 0f;
                    }
                    else if (movementCounter > movementTime && newState.IsKeyDown(Keys.Down))
                    {
                        tryToMoveDown();
                        movementCounter = 0;
                    }
                    else if (movementCounter > movementTime && newState.IsKeyDown(Keys.Left))
                    {
                        tryToMoveLeft();
                        movementCounter = 0;
                    }
                    else if (movementCounter > movementTime && newState.IsKeyDown(Keys.Right))
                    {
                        tryToMoveRight();
                        movementCounter = 0;
                    }
                    else if (oldState.IsKeyUp(Keys.Up) && newState.IsKeyDown(Keys.Up))
                    {
                        tryToRotate();
                    }
                    else if (oldState.IsKeyUp(Keys.Space) && newState.IsKeyDown(Keys.Space))
                    {
                        while (!collideDown)
                        {
                            tryToMoveDown();
                        }
                    }
                    else if (oldState.IsKeyUp(Keys.P) && newState.IsKeyDown(Keys.P))
                    {
                        isPaused = true;
                    }
                    // Cheats, hit a key to change the next block to whatever you need!
                    else if (oldState.IsKeyUp(Keys.I) && newState.IsKeyDown(Keys.I))
                    {
                        previewShape = 0;
                    }
                    else if (oldState.IsKeyUp(Keys.T) && newState.IsKeyDown(Keys.T))
                    {
                        previewShape = 1;
                    }
                    else if (oldState.IsKeyUp(Keys.B) && newState.IsKeyDown(Keys.B))
                    {
                        previewShape = 2;
                    }
                    else if (oldState.IsKeyUp(Keys.J) && newState.IsKeyDown(Keys.J))
                    {
                        previewShape = 3;
                    }
                    else if (oldState.IsKeyUp(Keys.Z) && newState.IsKeyDown(Keys.Z))
                    {
                        previewShape = 4;
                    }
                    else if (oldState.IsKeyUp(Keys.S) && newState.IsKeyDown(Keys.S))
                    {
                        previewShape = 5;
                    }
                    else if (oldState.IsKeyUp(Keys.L) && newState.IsKeyDown(Keys.L))
                    {
                        previewShape = 6;
                    }

                    oldState = newState;

                    putPieceOnBoard();

                    if (collideDown)
                    {
                        arrangeRows();
                        nextShape();
                        collideDown = false;
                    } // end if

                    if (isGameOver)
                    {
                        currentGameState = GameState.Gameover;
                    } // end if
                } // end is not paused
                else
                {
                    if (oldState.IsKeyUp(Keys.P) && newState.IsKeyDown(Keys.P))
                    {
                        isPaused = false;
                    }
                    oldState = newState;
                }
            } // end playing state
            else if (currentGameState == GameState.Gameover)
            {
                if (oldState.IsKeyUp(Keys.Enter) && newState.IsKeyDown(Keys.Enter))
                {
                    currentGameState = GameState.Start;
                }
                oldState = newState;
            }
            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            if (currentGameState == GameState.Start)
            {
                GraphicsDevice.Clear(Color.Black);
                spriteBatch.Begin();
                spriteBatch.DrawString(font, title, new Vector2(32, 32), Color.White);
                spriteBatch.DrawString(font, description[0], new Vector2(32, 128), Color.White);
                spriteBatch.DrawString(font, description[1], new Vector2(32, 160), Color.White);
                spriteBatch.DrawString(font, description[2], new Vector2(32, 192), Color.White);
                spriteBatch.DrawString(font, description[3], new Vector2(32, 224), Color.White);
                spriteBatch.DrawString(font, description[4], new Vector2(32, 256), Color.White);
                spriteBatch.DrawString(font, description[5], new Vector2(32, 288), Color.White);
                spriteBatch.DrawString(font, description[6], new Vector2(32, 320), Color.White);
                spriteBatch.DrawString(font, description[7], new Vector2(32, 352), Color.White);
                spriteBatch.DrawString(font, description[8], new Vector2(300, 600), Color.White);
                spriteBatch.DrawString(font, "Press ESC to Exit", new Vector2(32, 600), Color.White);
                spriteBatch.End();
            }
            else if (currentGameState == GameState.Playing)
            {
                GraphicsDevice.Clear(Color.Black);
                spriteBatch.Begin();
                displayPreviewPiece();
                displayGameBoard();
                spriteBatch.DrawString(font, $"Score: {score}", new Vector2(420, 32), Color.White);
                spriteBatch.DrawString(font, $"Level: {level}", new Vector2(420, 64), Color.White);
                spriteBatch.DrawString(font, $"Lines: {lines}", new Vector2(420, 96), Color.White);
                spriteBatch.DrawString(font, "My Tetris Clone", new Vector2(32, 732), Color.White);
                spriteBatch.DrawString(font, "Press P to Pause Game", new Vector2(256, 732), Color.White);
                spriteBatch.DrawString(font, "Press ESC to Exit", new Vector2(256, 764), Color.White);
                if (isPaused)
                {
                    spriteBatch.DrawString(font, "Paused", new Vector2(420, 160), Color.White);
                }
                spriteBatch.End();
            }
            else if (currentGameState == GameState.Gameover)
            {
                GraphicsDevice.Clear(Color.Black);
                spriteBatch.Begin();
                spriteBatch.DrawString(font, "My Tetris Clone: csharp Edition", new Vector2(100, 32), Color.White);
                spriteBatch.DrawString(font, "Thanks for Playing!", new Vector2(100, 64), Color.White);
                spriteBatch.DrawString(font, $"Score: {score}", new Vector2(100, 96), Color.White);
                spriteBatch.DrawString(font, $"Level: {level}", new Vector2(100, 128), Color.White);
                spriteBatch.DrawString(font, $"Lines: {lines}", new Vector2(100, 160), Color.White);
                spriteBatch.DrawString(font, "Visit us on GitHub", new Vector2(100, 192), Color.White);
                spriteBatch.DrawString(font, "https://github.com/cwl157/mytetrisclones", new Vector2(100, 224), Color.White);
                spriteBatch.DrawString(font, "Press Enter to Play Again", new Vector2(256, 288), Color.White);
                spriteBatch.DrawString(font, "Press ESC to Exit", new Vector2(32, 288), Color.White);
                spriteBatch.End();
            }

            base.Draw(gameTime);
        }

        bool isRowFull(int row)
        {
            int rowFull = 0;
            for (int col = 1; col < Width-1; col++)
            {
                if (gameBoard[row,col] != 0)
                {
                    rowFull++;
                } // end if
            } // end for
            if (rowFull == Width-2)
                return true;
            else
                return false;
        } // end isRowFull

        void arrangeRows()
        {
            for (int row = 1; row < Height - 1; row++)
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

        void increaseLevel()
        {
            if (levelLines == 10)
            {
                level = level + 1;
                // we don't want it reaching 0
                moveDownTime -= moveDownDecrement;
                if (moveDownTime < moveDownDecrement)
                {
                    moveDownTime = moveDownDecrement;
                }
                levelLines = 0;
            } // end if
        } // end increaseLevel

        void resetGameBoard()
        {
            for (int row = 1; row < Height - 1; row++)
            {
                for (int col = 2; col < Width - 2; col++)
                    gameBoard[row,col] = 0;
            } // end for
            gameBoard[0, 0] = 0;
            gameBoard[0, 1] = 8;
            gameBoard[0, 2] = 8;
            gameBoard[0, 3] = 8;
            gameBoard[0, 4] = 8;
            gameBoard[0, 5] = 8;
            gameBoard[0, 6] = 8;
            gameBoard[0, 7] = 0;
            gameBoard[0, 8] = 0;
            gameBoard[0, 9] = 8;
            gameBoard[0, 10] = 8;
            gameBoard[0, 11] = 8;
            gameBoard[0, 12] = 8;
            gameBoard[0, 13] = 0;
        }

        // put the piece on the gameBoard
        void putPieceOnBoard()
        {
            //displayPreviewPiece();
            for (int r = 0; r < 4; ++r)
                for (int c = 0; c < 4; ++c)
                    if (shapeArray[shape,rotation,r,c] != 0)
                        gameBoard[yPos + r,xPos + c] = shape + 1;
        } // end putPieceOnBoard

        void removePieceFromBoard()
        {
            for (int r = 0; r < 4; ++r)
                for (int c = 0; c < 4; ++c)
                    if (shapeArray[shape,rotation,r,c] != 0)
                        gameBoard[yPos + r,xPos + c] = 0;
        } // end removePieceFromBoard

        // check if there is a collision
        bool checkCollision()
        {
            for (int r = 0; r < 4; r++)
                for (int c = 0; c < 4; c++)
                {
                    if (r + yPos < Height && c + xPos < Width && (gameBoard[r + yPos,c + xPos] != 0) && (shapeArray[shape,rotation,r,c] != 0))
                        // There's overlap
                        return true;
                } // end for

            return false;
        } // end checkCollision

        // unfill 1 row
        void unFillOneRow(int row)
        {
            for (int col = 2; col < Width - 2; col++)
                gameBoard[row,col] = 0;
        } // end unFillOneRow

        void moveRowsDown(int n)
        {
            int row;
            for (row = n; row > 1; row--)
            {
                for (int col = 2; col < Width - 2; col++)
                {
                    gameBoard[row,col] = gameBoard[row - 1,col];
                } // end for
            } // end for
              // this sets the first row to 0's
            unFillOneRow(1);
        } // end moveRowsDown



        // gets the next piece, sets rotation and x and y cordinates
        void nextShape()
        {
            shape = previewShape;
            RandomNumberProvider.GetBytes(randomNumberBytes);
            int randomInteger = BitConverter.ToInt32(randomNumberBytes, 0);
            randomInteger = Math.Abs(randomInteger);
            previewShape = randomInteger % 7;
            rotation = 0;
            xPos = 6; //or wherever the middle of your board is
            yPos = 0;
            if (gameBoard[yPos, xPos] != 0 && checkCollision())
            {
                isGameOver = true;
            }
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
            if (xPos < 0) xPos = 0;
           if (checkCollision())
                ++xPos;
        } // end tryToMoveLeft

        // try to move right, move back if you can't
        void tryToMoveRight()
        {
            xPos = (xPos + 1) % (Width);
            if (checkCollision())
                --xPos;
        } // end tryToMoveRight

        // try to move down, move back if you can't
        void tryToMoveDown()
        {
            yPos = (yPos + 1) % Height;
            
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

        void displayPreviewPiece()
        {
            for (int r = 0; r < 4; ++r)
            {
                for (int c = 0; c < 4; ++c)
                {
                    blockRect.X = c * BlockSize + 400;
                    blockRect.Y = r * BlockSize + 400;
                    if (shapeArray[previewShape,0,r,c] == 1)
                    {
                        spriteBatch.Draw(pieces[0].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[0].BorderColor);
                    }
                    else if (shapeArray[previewShape,0,r,c] == 2)
                    {
                        spriteBatch.Draw(pieces[1].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[1].BorderColor);
                    }
                    else if (shapeArray[previewShape,0,r,c] == 3)
                    {
                        spriteBatch.Draw(pieces[2].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[2].BorderColor);
                    }
                    else if (shapeArray[previewShape,0,r,c] == 4)
                    {
                        spriteBatch.Draw(pieces[3].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[3].BorderColor);
                    }
                    if (shapeArray[previewShape,0,r,c] == 5)
                    {
                        spriteBatch.Draw(pieces[4].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[4].BorderColor);

                    }
                    if (shapeArray[previewShape,0,r,c] == 6)
                    {
                        spriteBatch.Draw(pieces[5].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[5].BorderColor);
                    }
                    if (shapeArray[previewShape,0,r,c] == 7)
                    {
                        spriteBatch.Draw(pieces[6].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[6].BorderColor);
                    }
                    if (shapeArray[previewShape,0,r,c] == 8)
                    {
                        spriteBatch.Draw(borderBlock, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, new Color(128, 128, 128));
                    }
                } // end for
            } // end for
        } // end displayPreviewPiece

        void displayGameBoard()
        {
            for (int row = 0; row < Height; row++)
            {
                for (int col = 0; col < Width; col++)
                {
                    blockRect.X = col * BlockSize;
                    blockRect.Y = row * BlockSize;
                    if (gameBoard[row,col] == 1)
                    {
                        spriteBatch.Draw(pieces[0].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[0].BorderColor);
                    }   
                    else if (gameBoard[row,col] == 2)
                    {
                        spriteBatch.Draw(pieces[1].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[1].BorderColor);
                    }
                        
                    else if (gameBoard[row,col] == 3)
                    {
                        spriteBatch.Draw(pieces[2].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[2].BorderColor);
                    }
                    else if (gameBoard[row,col] == 4)
                    {
                        spriteBatch.Draw(pieces[3].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[3].BorderColor);
                    }
                    else if (gameBoard[row,col] == 5)
                    {
                        spriteBatch.Draw(pieces[4].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[4].BorderColor);
                    }
                    else if (gameBoard[row,col] == 6)
                    {
                        spriteBatch.Draw(pieces[5].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[5].BorderColor);
                    }else if (gameBoard[row,col] == 7)
                    {
                        spriteBatch.Draw(pieces[6].Block, blockRect, Color.White);
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, pieces[6].BorderColor);
                    }
                    if (gameBoard[row, col] == 8)
                    {
                        spriteBatch.Draw(borderBlock, blockRect, Color.White);   
                        DrawBorder(blockRect.X, blockRect.Y, blockRect.Width, blockRect.Height, 3, new Color(128, 128, 128));
                    }
                } // end for
            } // end for
        } // end displayGameBoard

        private void resetGame()
        {
            resetGameBoard();
            score = 0;
            level = 0;
            lines = 0;
            levelLines = 0;
            moveDownCounter = 0f;
            moveDownTime = 1f;
            moveDownDecrement = 0.1f;
            movementCounter = 0.0f;
            movementTime = 0.1f;
            RandomNumberProvider.GetBytes(randomNumberBytes);
            int randomInteger = BitConverter.ToInt32(randomNumberBytes, 0);
            randomInteger = Math.Abs(randomInteger);
            shape = randomInteger % 7;
            RandomNumberProvider.GetBytes(randomNumberBytes);
            randomInteger = BitConverter.ToInt32(randomNumberBytes, 0);
            randomInteger = Math.Abs(randomInteger);
            previewShape = randomInteger % 7;
            collideDown = false;
            isGameOver = false;
            rotation = 0;
            xPos = 6;
            yPos = 0;
            isPaused = false;
        }

        private void DrawBorder(int x, int y, int width, int height, int borderSize, Color color)
        {
            // Top
            spriteBatch.Draw(pixel, new Rectangle(x, y, width, borderSize), color);

            // Left
            spriteBatch.Draw(pixel, new Rectangle(x, y, borderSize, height), color);

            // Right
            spriteBatch.Draw(pixel, new Rectangle((x + width - borderSize),
                                            y,
                                            borderSize,
                                            height), color);
            // Bottom
            spriteBatch.Draw(pixel, new Rectangle(x,
                                            y + height - borderSize,
                                            width,
                                            borderSize), color);
        }
    }
}
