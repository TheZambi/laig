%starting player
player(0).

% Allied colors according to the player.
allied(0,orange,green).
allied(1,orange,purple).

allied(0,green,purple).
allied(1,green,orange).

allied(0,purple,orange).
allied(1,purple,green).

% Colores boarder coordenates.
at_border(orange, 18, 12).
at_border(orange, 19, 12).
at_border(orange, 20, 12).
at_border(orange, 21, 12).
at_border(orange, 22, 12).

at_border(purple, 0, 1).
at_border(purple, 1, 2).
at_border(purple, 2, 3).
at_border(purple, 3, 4).
at_border(purple, 4, 5).

at_border(green, 7, 7).
at_border(green, 9, 8).
at_border(green, 11, 9).
at_border(green, 13, 10).
at_border(green, 15, 11).

% Updates the current player.
update_player(Player, NewPlayer):-
    NewPlayer is mod(Player+1,2).

% Gets the value of a tile (it's color or empty).
getValue(Board,RowNumber,Diagonal,Color):-
    nth0(RowNumber,Board,Row),
    diagonal_index(RowNumber,DiagonalStart),
    DiagonalDiff is Diagonal-DiagonalStart,
    nth0(DiagonalDiff,Row,Color).


% replaces a value in a list
replace_val([_|T], 0, Value, [Value|T]).
replace_val([H|T], DiagonalNum, Value, [H|NextValue]):- 
  DiagonalNum > 0, 
  NewDiagonalNum is DiagonalNum-1, 
  replace_val(T, NewDiagonalNum, Value, NextValue).

% Gets a desired row of the board.
getRow([Row|T],0,[NewRow|T],[InitialRow|V]):-
    [Diagonal|R] = V,
    diagonal_index(InitialRow,X),
    Replace is Diagonal-X,
    [Color|_] = R,
    replace_val(Row,Replace,Color,NewRow).

getRow([H|T],RowNumber,[H|NewBoard],Move):-
    RowNumber > 0,
    NewRowNumber is RowNumber-1,
    getRow(T,NewRowNumber,NewBoard,Move).

% Used to make the player's move.
move([Board | T ], Move, NewGameState):-
    [RowNumber|_] = Move,
    getRow(Board,RowNumber,NewBoard,Move),
    NewGameState = [NewBoard|T].

% Counts how many occurences of X are in a list (used to get the number of colors won by each player).
count_occurrences(List, X, Count) :- aggregate_all(count, member(X, List), Count).

% If a player has alreay captured two colors he is the winner.
game_over([ _ , ColorsWon | _ ], Winner):-
    count_occurrences(ColorsWon,0,CountOfZero),
    count_occurrences(ColorsWon,1,CountOfOne),
    (CountOfZero < 2 ; Winner is 0),
    (CountOfOne < 2 ; Winner is 1).

% Checks if the line is valid 
valid_line(Line):-
    number(Line),
    between(0,22,Line).
  
% Checks if the diagonal is valid 
valid_diagonal(Diagonal, D1, D2):-
    number(Diagonal),
    between(D1,D2,Diagonal).
    
% Returns the neighbours of a piece.
getNeighbours(Row,Diagonal,Neighbours):-
    validMove(Row,Diagonal),
    LastRow is Row-1,
    LastLastRow is Row-2,
    NextRow is Row+1,
    NextNextRow is Row+2,
    LastDiagonal is Diagonal-1,
    NextDiagonal is Diagonal+1,
    Neighbours = [
                    [LastRow,Diagonal],[NextRow,NextDiagonal],[LastLastRow,LastDiagonal],
                    [NextNextRow,NextDiagonal],[LastRow,LastDiagonal],[NextRow,Diagonal]
                ].
    




% Used to check if the color orange has been captured using funtions created on the file "bot.pl".
checkOrange(0,_,_,0,_).
checkOrange(1,_,_,1,_).
checkOrange(_,Player,Board,NewOrangeWon,Orange1Length):-
    getOrangePathLength(Player,Board,Orange1Length),
    getNewWon(Player,Orange1Length,NewOrangeWon).

% Used to check if the color purple has been captured using funtions created on the file "bot.pl".
checkPurple(0,_,_,0,_).
checkPurple(1,_,_,1,_).
checkPurple(_,Player,Board,NewPurpleWon,Purple1Length):-
    getPurplePathLength(Player,Board,Purple1Length),
    getNewWon(Player,Purple1Length,NewPurpleWon).


% Used to check if the color green has been captured using funtions created on the file "bot.pl".
checkGreen(0,_,_,0,_).
checkGreen(1,_,_,1,_).
checkGreen(_,Player,Board,NewGreenWon,Green1Length):-
    getGreenPathLength(Player,Board,Green1Length),
    getNewWon(Player,Green1Length,NewGreenWon).

% Updates the player that won a color
getNewWon(Player,-1,NewPlayer):-
    NewPlayer is mod(Player+1,2).
getNewWon(Player,0,Player).
getNewWon(_,_,-1).

% Used to validate a move.
validMove(Row,Diagonal):-
    valid_line(Row),
    diagonal_index(Row,D1),
    diagonal_index_end(Row,D2),
    valid_diagonal(Diagonal,D1,D2).

% Funtion that calls every funtion needed to update the colors the players have won and parses the values,
% the 0 means that both the players board state is evaluated.
updateColorsWon([Board, [OrangeWon, PurpleWon, GreenWon | _ ] | _ ],NewColorsWon, Player, 0, Length1, Length2):-
    NewP is mod(Player+1,2),

    checkOrange(OrangeWon,Player,Board,NewOrangeWon,Orange1Length),
    checkPurple(PurpleWon,Player,Board,NewPurpleWon,Purple1Length),
    checkGreen(GreenWon,Player,Board,NewGreenWon,Green1Length),
    Length1 = [Orange1Length,Purple1Length,Green1Length],

    checkOrange(NewOrangeWon,NewP,Board,FinalOrangeWon,Orange2Length),
    checkPurple(NewPurpleWon,NewP,Board,FinalPurpleWon,Purple2Length),
    checkGreen(NewGreenWon,NewP,Board,FinalGreenWon,Green2Length),
    Length2 = [Orange2Length,Purple2Length,Green2Length],

    NewColorsWon = [FinalOrangeWon,FinalPurpleWon,FinalGreenWon].

updateColorsWon([Board, [OrangeWon, PurpleWon, GreenWon | _ ] | _ ],NewColorsWon, Player, 1, Length1, Length2):-
    checkOrange(OrangeWon,Player,Board,NewOrangeWon,Orange1Length),
    checkPurple(PurpleWon,Player,Board,NewPurpleWon,Purple1Length),
    checkGreen(GreenWon,Player,Board,NewGreenWon,Green1Length),
    Length1 = [Orange1Length,Purple1Length,Green1Length],
    Length2 = [0,0,0],

    NewColorsWon = [NewOrangeWon,NewPurpleWon,NewGreenWon].

% Records the use of a piece (removes from the count).
usePiece(orange,[Orange,Purple,Green | _] ,[NewOrange,Purple,Green]):-
    NewOrange is Orange-1.
usePiece(purple,[Orange,Purple,Green | _] ,[Orange,NewPurple,Green]):-
    NewPurple is Purple-1.
usePiece(green,[Orange,Purple,Green | _] ,[Orange,Purple,NewGreen]):-
    NewGreen is Green-1.

% When a piece is place this function updates the remaining pieces of that color.
updateNPieces([_,_,Color|_], NPieces ,NewNPieces):-
    usePiece(Color,NPieces, NewNPieces).

% Checks if a winner was found
checkForWinner(GameState,Player,Winner,_,_,_):-
    number(Winner),
    display_game(GameState,Player), 
    nl.

checkForWinner([NewBoard,NewColorsWon,NewNPieces],NewPlayer,Winner,GameMode,Bot1Diff,Bot2Diff):-
    game_loop([NewBoard,NewColorsWon,NewNPieces],NewPlayer,Winner,GameMode,Bot1Diff,Bot2Diff).


% Used to decide how the next move is from (Player or AI) according to game mode and AI difficulty.
getNextMove(GameState,_,_,_,Move,1):-
    [Board | T] = GameState,
    [_ , NPieces | _] = T,
    get_move(Move,Board,NPieces).
getNextMove(GameState,Player,_,_,Move,2):-
    [Board | T] = GameState,
    [_ , NPieces | _] = T,
    Player =:= 0,
    get_move(Move,Board,NPieces).
getNextMove(GameState,Player,Level1,_,Move,2):-
    Player =:= 1,
    choose_move(GameState,Player,Level1,Move).

getNextMove(GameState,Player,_,_,Move,3):-
    [Board | T] = GameState,
    [_ , NPieces | _] = T,
    Player =:= 1,
    get_move(Move,Board,NPieces).
getNextMove(GameState,Player,Level1,_,Move,3):-
    Player =:= 0,
    choose_move(GameState,Player,Level1,Move).

getNextMove(GameState,Player,_,Level2,Move,4):-
    Player =:= 1,
    choose_move(GameState,Player,Level2,Move).
getNextMove(GameState,Player,Level1,_,Move,4):-
    Player =:= 0,
    choose_move(GameState,Player,Level1,Move).


% Game's main loops
game_loop(GameState,Player,Winner,GameMode,Level1,Level2):-
    [_ | T] = GameState,
    [ColorsWon , NPieces | _] = T,
    display_game(GameState,Player),
    getNextMove(GameState,Player,Level1,Level2,Move,GameMode),
    updateNPieces(Move,NPieces,NewNPieces),
    move(GameState, Move, NewGameState),
    [NewBoard | _] = NewGameState,
    updateColorsWon([NewBoard, ColorsWon],NewColorsWon, Player,0, _, _),
    !,
    game_over([NewBoard,NewColorsWon,NewNPieces],Winner),
    update_player(Player, NewPlayer),
    checkForWinner([NewBoard,NewColorsWon,NewNPieces],NewPlayer,Winner,GameMode,Level1,Level2).

% Starting predicate that initializes every variable needed to start.
play :-
    prompt(_,''),
    display_name,
    display_mode(Mode),
    get_bot_dificulty(Mode, Difficulty1, Difficulty2),
    player(Player),
    initial(Board),
    game_loop([Board,[-1,-1,-1],[42,42,42]], Player, Winner, Mode, Difficulty1, Difficulty2),
    display_winner(Winner).

