ChainShotCNV
============

An implementation of ChainShots puzzle game using CreateJS & HTML5 Canvas

CreateJS is a JavaScript library that adds a lot of the same native functionality as Flash's ActionScript.  It has support for tweening as well as sprite animation and your basic transforms.

I decided to use this library to recreate my SameGame/ChainShots project for the browser, with a full graphical UI.  

I call the game, BlockShots.  

The premise of the game is simple, you have stacks of blocks arranged in a grid.  In easy mode, if there is a group of 2 or more blocks connected in a Von Neumann pattern, then you can click on those blocks and remove them.  The blocks above will fall down.  When an entire column is removed, the columns on the right slide over to butt up against those on the left.  

That's it.

In hard mode, you must remove 3 or more blocks at a time.

Scoring is done exponentially so that (n + 1 - minBlockNum)^2 is the score you get for each removal.
