# LAIG 2020/2021

## Group T03G10
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Diogo Rosário    | 201806582 | up201806582@fe.up.pt |
| Henrique Ribeiro | 201806529 | up201806529@fe.up.pt |

----

## Projects

### [TP1 - Scene Graph](TP1)

- Parsing verification.
- Makes use of multiple textures and materials.
- Uses all primitive object.
- Multiple cameras and lights.

- Scene
  - A field of grass with a small farm on top.
  - [Scene](./TP1/scenes/LAIG_TP1_XML_T3_G10_v01.xml)

-----

### [TP2 - Animations](TP2)
- Possibility to create various animations.
- Small animation for the tractor.
- Can create text spirites and sprite animations.
- Can use nurbs (plane, barrel and patch)

- Scene
  - A field of grass with a small farm on top and a moving tractor.
  - [Scene](./TP2/scenes/LAIG_TP2_XML_T3_G10_v01.xml)

----

### [TP3 - ...](TP3)
- All requested functionalities are working.
- Two scenes: A farm with a picnic towel and gameboard on top of it and a room with a lamp and the gameboard on top of a table.
- Animations between all cameras.
- Possibility to view game movie in every player turn and end game movie. While playing the movie, every move is made with a delay of 1 second.
- Possibility to change bot difficulty and gamemode. Due to the time needed to calculate a move in harder difficulties we decided to make the game faster and for that reason difficulties only change the time a player has to make a move. If the time expires, the player instantly loses the game.
- Undo does different things depending on the gamemode. In Player vs Player, this command backtracks 1 move. When playing Player vs AI or AI vs player it backtracks 2 moves, so that the player can redo his move. When playing AI vs AI undo is disabled.
- Game score is done by a marker with all 3 colors in it, near the board. Timer and winner are displayed on a small "TV" near the board.
- Pieces are animated using interpolation and easing functions.
- There is an option to reset the game during a player turn, which resets the board state.

