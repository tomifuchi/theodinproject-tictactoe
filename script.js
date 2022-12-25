/* 
    * Layout for the tictactoe board itself should be a 3x3 grid with divs.
    Playing character is svg images.
    * When start the player can input their name
    * A display with player's name on the left, opponent on the right
    with the score on top of them. Indicating player's turn by
    highlighting the player name.
    * A tictactoe board with player's symbol as X or O, the opponent is
    the remaining symbol.
    * Initially, a coin is flipped to see who would go first. Then the players take
    turn to place their symbol on to the board. Goal is to achieve a certain pattern
    on the board to win. Or a draw where winning pattern is no longer viable.
    * The game continues for 3 rounds. Then the final winner is decided. Then replay 
    button is display. If pressed the whole thing will reset again. 

    Single player only, AI will move randomly not anything radical. Then
    if the AI is easy enough we will try to implement the simpliest AI we know.
    * This is optional, if you don't want to it's okay. Also, try to implement
    the game completely then use the API of the unplayable character ie. Opponent then
    use the algorithm on that one, DO NOT TIE THE ALGORITHM INTO THE MAIN PROGRAM. Only
    interact through the interface you left it. Should this be done right, you can take the
    program on and off, or easily switch between random move and Simple AI.
    This would mean makes the 2nd player playable.


    Note: Use Factory function, module and composition when designing shit
    Here's a reference 
    https://www.youtube.com/watch?v=wfMtDGfHWpA

    And you should know factory and module but for composition here's an example
    In simple term, make a factory function that returns what that thing can do or what it
    its then stick to the Data structure we are creating. If it doesn't make sense, then
    don't assign anything to it that's all.

    No inheritance anything here. You can use Object.assign to get the methods to anywhere you like. But...Tuck
    them in prototype to separate with properties seems like a good place for the methods.

    Now since compositions arent inheriting, it needed an Object catogorized them by their purpose.
    Like display, control, binding events, etc,.... Atleast that's an idea

    More of a doer instead of what they are.

    If you are not familiar arrow function returning an object will have syntax like this for a reason.
    const thisReturnsObject = () => ({name: 'John'});
    Why wraped it in parenthesis ? If not it will mistakenly by the compiler as a curly braces for the arrow function content.
    wraped it in () return an epxression, inside an object so it returns an object.
    Read it more here
    https://ultimatecourses.com/blog/return-object-arrow-function

    const CompMethods = {
        sayHi: (state) => ({sayHi: () => `${state.name} says hi`}),
        sleep: (state) => ({sleep: () => 'ZZZZzzzz'}),
        shootLaser: (state) => ({shootLaser: () => `{state.name} shoots laser!!!`}),
    };

    const Robot = function (name) {
        let state = {
            name
        };

        //Either this or store the methods in prototype so that we can have method/properties separation
        //return Object.assign({}, CompMethods.sayHi(state), CompMethods.shootLaser(state));
        return Object.create(Object.assign({}, CompMethods.sayHi(state), CompMethods.shootLaser(state)));
    }

    const Human = function (name) {
        let state = {
            name
        };

        //return Object.assign({}, CompMethods.sayHi(state), CompMethods.sleep(state));
        return Object.create(Object.assign({}, CompMethods.sayHi(state), CompMethods.sleep(state)));
    }
    
    const john = Human('John');
    console.log(john);
    const alex = Robot('Alex');
    console.log(alex);

    //Specifically to this game.
What you can do in the API ? 
    * Start the game
    * Reset the game
    * Make a move (Playable character only)
    * Replay the game
What you can't do in the API
    * Control the display, the display
reflects what's going on, by giving the power to control them will break the damn thing. Renders the display to not work
properly.
    * Control the wiring, displaying or the flow of the game. Or in short the GEC(Game event controller) object will be
not accessable to the user.

Some idea on how to deal with this shit.

	* Any DOM related wiring, we should
have it in Display then try to design it such that we should have as little DOM thing in others as possbile, preferably
interact through the display module
	* As for the gameboard and player movement
We should have:
		+ multidimensional array of objects, each objects is with domElement: Display.domCache(thisElement), then isTick: PlayerId
If a user click or make a move on the gameboard that domELement will have a data-isTick=PlayerId on it and the element isTick is now occupied
with a player ID otherwise both it and the dom element is empty. This way ensures 1 player can make a move on a specific cell.
	* GEC should also have control of how many player.
	* Player object should have playerID, name, score and move array, it consist of an array of small 2 elements array that each element represents
played position on the board, once a round is finished, we should clear this array.
	* If done right we should be able to move and play game entire through the console if we wanted to. Besure to toggle both in the object of that specific
cell that either interact through the DOM or api, it will still toggle BOTH.

*Pro tip: Move fast, break things, but don't overly abstract the logic, makes it easy to read and understand is key here.

Idea on the pattern checking algorithm
Check after everymove a player is made. Check the current player's position array for positions taken.
Then use this algorithm to check for winning pattern.

Tic tac toe works like this. For each move
    For each direction (Check a particular vector in a direction)
    Addition the current postion with a vector in a particular direction
    then look in the position is it there ? If it's not then stop checking
    If it it's do the same then look if it's in the position. If atleast
    3 is reach then stop. This is a winner.
    Stop the game

    Each direction vector is this starts at 0deg add 45 deg then
    [1,0] [1, -1] [0, -1] [-1,-1] [-1, 0] [-1, 1] [0, 1]

If no winning pattern is found then continue the game as usual
*/

//Ultilizing methods
const utilMethods = {
}

//GameEventController or GEC object
const GEC = (function () {
    //Control the flow of the game along with the display to reflect it's own state
})();

//Display should be tuck away
const Display = (function () {

    const domCache = cacheDom(
        'player1-name','player2-name', 'scoreboard', 'playing-area'
    );

    //Returns an object with each entry is ID: cached ID dom Element
    function cacheDom(...selectorIDs){
        return Object.fromEntries(
            selectorIDs.map((elem) => [elem, document.getElementById(elem)])
        );
    }

    //Add elelement to DOM cache
    function addToDomCache(elm){
        Object.assign(domCache, elm);
    }

    //Push to DOM
    function pushToDOM(selector, elem) {
        domCache[selector].appendChild(elem);
    }

    //Since it's text based, we are going to need alot of textContent displaying to dom
    //Maysubject to change
    function updateDOMText(elem, data) {
        elem.textContent = data;
    }

    function toggleClass(elem, style_class) {
        elem.classList.toggle(style_class);
    }


    return Object.assign(
        Object.create({updateDOMText, cacheDom, toggleClass, pushToDOM, addToDomCache}),
        {domCache}
    );

})();

//Ability to set the dimension of the board of the gameboard dimxdim
//Right now it's 3x3
const GameBoard = (function (dim){

    let nCell = 0;
    function createCell(){
        nCell++;
        //Create element here
        const cell = {
            isTick: ''
        };

        cell.domElem = document.createElement('div');
        cell.domElem.style.border = '1px solid black';
        cell.domElem.style.padding = '30px';
        cell.domElem.textContent = 'Hello';
        cell.makeMove = function (playerID) {
            Display.toggleClass(cell.domElem, 'dark');
            cell.domElem.dataset.isTick = playerID;
            cell.isTick = playerID;
        }
        //cell.domElem.onclick =  currentPlayer.move(<thiscellindex>);

        Display.addToDomCache(Object.fromEntries([[`playCell${nCell}`, cell.domElem]]));
        Display.pushToDOM('playing-area', cell.domElem);

        return cell;
   }

    function genMultiDimArr(n){
        return Array(n).fill().map((elem,index) => Array(n).fill().map(() => createCell()));
    }

    const Board = genMultiDimArr(dim);

    return Object.assign({},
        {Board, nCell}
    );

})(3);

let nPlayer = 0;
const Player = function(name) {
    nPlayer++;

    /*
        Position is an array of arrays, with each of the array as 2 elements array.
        x, y position played.
        [[1,2],[0,1],[3,4]] Or some shit like that
    */
    let state = {
        playerID: `player${nPlayer}`,
        name: name,
        position: []
    };

    function move(x, y){
        state.position.push([x, y]);
        GameBoard.Board[x][y].makeMove(this.playerID);
    }
    
    return Object.assign(
        Object.create({move}),
        state
    );
}

//Input player position and the board dimension, out spit if they win or not. True of false
//Player position which is this
//Example: [[0,1],[0,2],[1,2]] Or some shit like that
//Assumed the position are valid move that mean it's not out of bound or duplicated, or 
//Other player are in that position.
function checkWinner(player_position, nMoveToWin, dim){

/*
Idea on the pattern checking algorithm
Check after everymove a player is made. Check the current player's position array for positions taken.
Then use this algorithm to check for winning pattern.

Tic tac toe works like this. For each move
    For each direction (Check a particular vector in a direction)
    Addition the current postion with a vector in a particular direction
    then look in the position is it there ? If it's not then stop checking
    If it it's do the same then look if it's in the position. If atleast
    3 is reach then stop. This is a winner.
    Stop the game

    Each direction vector is this starts at 0deg add 45 deg then
    [1,0] [1, -1] [0, -1] [-1,-1] [-1, 0] [-1, 1] [0, 1]
    Realizing you can get the other direction by invert them so unique is
    [1, 0],[1, -1],[0,-1],[-1,-1]

If no winning pattern is found then continue the game as usual
*/

//The other direction we can get it by invert this vector, or multiply by -1
//-vector is also called inverse element of x
const directionVector = [[1, 0] ,[1, -1], [0, -1], [-1, -1]];

player_position.forEach((move) => {
        //Check forward
        directionVector.forEach( (direction) => {
            const nextMove = vAdd(move, direction);
            const prevMove = vAdd(move, vScalarMultiply(-1,direction));
        });
    });

    //Vector addition, example: [1,2] + [3,4] = [4, 6] 
    function vAdd(...V) {
        return  V.reduce(
            (previousValue, currentValue) => previousValue.map((x,i) => x + currentValue[i])
        );
    }

    //Scalar multiplication of vector
    function vScalarMultiply(c,v) {
        return v.map((x) => c * x);
    }

    //Check if tar is in position_arr
    function isPosPresent(position_arr, target){
        return player_position.findIndex((elm) => isVEq(elm,target));
    }

    //Check if 2 vector is equal or the same.
    function isVEq(v1,v2) {
        return v1.every((x, i) => x == v2[i]);
    }

    function checkBound(x, y){
        return (x >= 0) && (x <= dim -1) && (y >=0) && (y <= dim-1);
    }

};


//const john = Player('John');
//john.move(1,2);
//john.move(0,1);

checkWinner([[1,2], [0,1], [2,2]], 3, 3);