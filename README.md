# Oddert Chess game

A platform for playing chess locally or with a live oponent over the internet. Features a custom chess engine built from scratch.

Front end built with React / Redux, backend built with express, MongoDB / Mongoose for storage, Socket.io for websocket implamentation.

## Installation
```
$ git clone https://github.com/Oddert/chess-game.git
$ cd chess-game/client
$ npm i
$ cd ..
$ npm i
```
### For development
```
$ npm run dev
```
### For a production build
```
$ npm run build
$ npm start
```

## Development To Do's:
- Review all socket functionality, test for holes, create inventory of things before moving on

- Add check detection to move validation system
- Add check mate detection ontop
- Add pawn swap capability for board traversal
- Add castle move
- Add [that move where a pawn jumps over a piece]

- Notifications - Add 'read' mechanism
- Notifications - Add 'action' mechanism
  * Open a new game state
  * Open a notification to read (will require further actionables)
  * Contain a request

- Get multiple auth options working
- Add callback for creating a request (check)
- Ability to destroy games
- Change existing save function to check auth

- DM chat?

- Add pawn promotion mechanic (will involve looking at PGN and move functionalities to accommodate piece's having a before and after state)

- Add score tracking to user profile
  * Win condition
  * Forfeit condition

- Router / location history?

- Add dynamic error events to socket
  * Disconnect notification
  * Opponent visibility indicator
  * Leave room failsafe in 'move piece' event (server side)

### Optional / Do Later
- Synchronise local and database game structure
- Initialising games, notifications and requests does not overide data causing duplicates
- (1.) Each item gets own data on timer?

### Bugs
- Authentication does not auth on socket-passport (must reload)




### Done / Solved:
- Figure out how to have secure 2ppl socket connection
- Decide how to arrange the boards
- Socket io can do db work ??
- Complete socket example suits
- Check the save 'lastMove' functionality is working
- Add name change and display functionality
- Implement move history notation
- Chat function

- Add ~~proper~~ authentication
- Investigate how socket.io fits into passport auth <-yaaaaaasssss lad
- Add request functionality

- Figgure out why non auth users cant interact with sockets <- keep an eye on this
- Ability to modify or delete requests
