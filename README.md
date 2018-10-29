# Oddert Chess game

## To Do's:
- Review all socket functionality, test for holes, create inventory of things before moving on

- ADD GLOBAL NOTIFICATION SYSTEM

- Get multiple auth options working
- Add callback for creating a request
- Clean up cascading mongoose queries
- Synchronise local and database game structure
- Ability to destroy games
- Change existing save function to check auth

- DM chat?

- Add pawn promotion mechanic (will involve looking at PGN and move functionalities to accommodate piece's having a before and after state)

- Add score tracking to user profile
  * Win condition
  * Forfeit condition

- Router history?

- Add dynamic error events to socket
  * Disconnect notification
  * opponent visibility indicator
  * Leave room failsafe in 'move piece' event (server side)

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
