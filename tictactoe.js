var wins = [7, 56, 448, 73, 146, 292, 273, 84];
//make new board
var ttt_game = null;

//Board constructor (this is the board game area with #game-board)
function Board(game_board_element) {
    var self = this;
    //game_board_element = #game-board
    self.game_board_element = game_board_element;
    self.available_squares = 9;
    //array for square objects
    self.game_squares = [];
    self.players = [];
    self.current_player = 0;
    //uses parametar to find the class game-square to make objects out of each square
    self.add_player = function (avatar_name) {
        if (self.players.length < 2) {
            var player = new player_template(player_avatar_specs[avatar_name]);
            self.players.push(player);
        }
        //TODO error if more players add than can play
    }
    self.init = function () {
        self.game_board_element.find('.square').each(function () {
            var square = self.make_square($(this));
            self.game_squares.push(square);
        })
    };
    //makes a square object this gets pushed into the array
    self.make_square = function (target_element) {
        var this_square = new square_template(target_element, self);
        return this_square;
    };
    self.get_current_player = function () {
        return self.players[self.current_player];
    }
    self.next_player = function () {
        if (self.current_player == 0) {
            self.current_player = 1;
        } else {
            self.current_player = 0;
        }
    };
    self.square_was_clicked = function (the_square) {
        self.available_squares--;
        self.players[self.current_player].square_value(the_square.value);
        self.win();
        self.next_player();
    };
    self.win = function () {
        for (var i = 0; i < wins.length; i++) {
            if ((wins[i] & self.players[self.current_player].total[0]) === wins[i]) {
                self.display_results(self.players[self.current_player]);
            } else if (self.available_squares == 0) {
                self.tie();
            }
        }
    };
    self.tie = function () {
        var draw_img = $('<img>').attr('src', 'images/draw.png').addClass('avatar_img');
        $('.display_results').html('');
        $('.display_results').append(draw_img);

    };
    self.display_results = function (winner) {
        var display = $('.display_results');
        var winner_img = $('<img>').attr('src', winner.avatar).addClass('avatar_img');
        $(display).html('');
        $(display).html(winner_img);

    };
    self.init();
}

//this is the square object for the tic tac toe game
var square_template = function (this_element, parent_board) {
    var self = this;
    self.game_board = parent_board;
    self.target_element = this_element;
    self.value = null;
    self.square_taken = false;
    self.init = function () {
        self.value = self.target_element.attr('value');
        self.target_element.click(function () {
            self.clicked();
        })
        return self;
    };
    self.clicked = function () {
        console.log("my value is ", self.value);
        var current_player = self.game_board.get_current_player(); //get the current player from game board
        var current_icon = current_player.get_icon(); //get image from the current player
        self.append_image(current_icon);
        // check if you can click and if you win
    };
    //Need to some how upload correct image to board
    self.append_image = function (image_src) {
        if (self.square_taken == false) {
            self.square_taken = true;
            self.image = $('<img>').attr('src', image_src).addClass('board_img');
            self.target_element.append(self.image);
            self.game_board.square_was_clicked(self);
        } else {
            alert("square taken pick another");
        }
    };
    self.init();
}

var player_template = function (avatar_specs) {
    var self = this;
    self.name = name;
    self.total = [0];
    self.square_value = function (square_value) {
        var total = 0;
        //takes the div number adds it to 0 index of sum pops the index and replaces it
        total += parseFloat(square_value);
        var new_total = self.total[0] + total;
        self.total.pop();
        self.total.push(new_total);
        console.log(self.total);

    };
    self.get_avatar = function () {
        return self.avatar;
    }
    self.get_icon = function () {
        return self.icon;
    };
    self.init = function (avatar_specs) {
        self.long_name = avatar_specs.long_name;
        self.name = avatar_specs.name;
        self.saying = avatar_specs.saying;
        self.avatar = avatar_specs.avatar;
        self.icon = avatar_specs.icon;
        $('.player1').append(self.long_name);
    };
    self.init(avatar_specs);

}
//This objects has the specs of each player
var player_avatar_specs = {
    dan: {
        name: 'Dan',
        long_name: 'Daniel Paschal',
        avatar: 'images/dan_win.png',
        'icon': 'images/markersX.png',
        saying: 'Let\'s sing a song!',
        saying_image: 'gitfire.jpg'
    },
    eric: {
        name: 'Eric',
        long_name: 'Eric Johnson',
        avatar: 'images/eric_win.png',
        'icon': 'images/coffeeO.png',
        saying: 'nope!',
        saying_image: 'coffee_logic.jpg'
    },
}

function thought_bubbles() {
    setTimeout(function () {
        $('.player1').attr('src', 'images/Dan_thought2.png');
        $('.player2').attr('src', 'images/Eric_thought2.png');
    }, 2000);
    setTimeout(function () {
        $('.player1').attr('src', 'images/Dan_thought3.png');
        $('.player2').attr('src', 'images/Eric_thought3.png');
    }, 4000);
}

$(document).ready(function () {

    ttt_game = new Board($("#game-board"));
    ttt_game.add_player("eric");
    ttt_game.add_player("dan");
    $('button').on('click', function () {
        //create a better way to restart the game.. reset all stats
        location.reload();
    })
    thought_bubbles();

})