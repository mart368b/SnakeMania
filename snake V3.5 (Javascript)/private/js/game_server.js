var io;
module.exports = {
	run: function(socket) {
		io = socket;
		init();
	}
}

function init() {
	io.on('connection', function(socket){
		console.log('a user connected');

		socket.on('player_input', function(i, x, y) {
			console.log(i);
		});
		
		socket.on('disconnect', function(socket){
			console.log('a user disconnect');
		});
	});
}

