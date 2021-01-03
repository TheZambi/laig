# User's Manual
## How to run
1) Open sicstus prolog and consult the file server.pl inside TP3/src/prolog.  
2) Invoke the predicate 'server.'.  
3) Create a local server in the folder TP3.  
4) Open the localhost in a browser that supports webGL.  

## Game's rules
The ultimate goal of the game is to win 2 of the 3 available colors.  
To win a color, it is necessary to connect 1 color from one side of the board to the other using that color and/or its allied color, or block the opponent, that is, use the color that is neither allied nor its own so that it is impossible to make a path.  
For example, assuming that player 1 has green as orange's ally and player 2 has purple as orange's ally. For player 1 to get orange, he can make an uninterrupted path of orange and / or green pieces, or else "cut" the board with green pieces, which would make player 2 unable to join the 2 orange edges of the board , since the green color is neither orange nor an ally of orange for him.  
Allied colors are defined at the beginning of the game and vary between players.  
There are 42 pieces of each color (orange, green and purple) that are shared between the 2 players.  
Each player takes a turn making a move which consists of placing a piece of any color in any empty tile.  

The game's rules can be found here: [link.](https://nestorgames.com/rulebooks/ALLIANCES_EN.pdf)  
The game's page can be found here: [aqui.](https://nestorgames.com/#alliances_detail)

## User's instructions

### Score board

1) Each player has a score board with the three colors.  
2) When a color is won a piece is placed on top of it. If the color is lost a grey piece is placed instead.  
3) On the score board are also two colors connecting a color. These colors correspond to the color to win and it's allie.  

### Starting a game

1) Select a game mode to play.  
2) If you have select a game mode with an AI also select it's difficulty.  
3) Press the 'Start' button.  

### Resetting a game

1) If the game is still underway press the 'Reset Game' button.  
2) If the game is over, you can either press the 'Reset Game' button or simply the 'Start' button to start a new game.  

### Playing the game movie

1) Press the button 'Play Game Movie' anytime during a player's turn or after the game is over.  
2) A sequence of moves will be made to recreate all moves done up to that point.  
3) The movie can be finished sooner by pressing the button 'Stop Game Movie'.  

### Undoing a move

1) To undo a move press the button 'Undo' in the interface.  
2) If the game mode is 'Player vs Player' one move will be undone.  
3) If in a mode versus an AI, two moves will be undone to also undo the AI's move.  

### Making a move

1) If a game is underway you can select a color by clicking on a box that contains pieces of the desired color.  
2) If a color has been picked the move can be completed by selecting an empty tile (empty tiles are highlighted by a green hexagon).  
3) The player's have a limited time to make a move depending on the bot's difficulty/gamemode.  
4) If the turn's player is a bot, a move will be done automatically without user interference.  

### Finishing a game

1) The game ends when a player has won two or more colors.  
2) When the game is over, the winner will be displayed.  

### Bot difficulty

1) Changing the bot difficulty reduces the maximum time a player has to make a move.  
2) The bot only makes random moves, however it's possible to change that but it was decided to make it like this, because of the time it would take to make the request (analyzing the board in order to make a good move would take at least around 15 seconds).  
3) It's possible to change the difficulty of the AI by changing the value '1' to 'this.bot1Copy' in the function 'makeBotMove' in 'MyGameOrchestrator' when calling the function 'requestBotMove'.  
4) If the user does what's stated above, it might be needed to increase the maximum time per turn. It's possible to do this by changing the array 'turnTimers' in 'MyGameOrchestrator'.  