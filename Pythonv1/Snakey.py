import os, keyboard, time, random

# Board dimensions
WIDTH = 10
HEIGHT = 10

SLEEP_TIME = 0.5

# List of characters to display the board
EMPTY_CHAR = '#'
SNAKE_CHAR = 'O'
TAIL_CHAR = 'T'
FOOD_CHAR = 'F'

"""
Tests wether a given coordinat is hitting a piece of the tail
False = no tail at that coordinat
True = a tail is at that coordinat
"""
def You_an_ass_eater(p):
    for i in tail:
        if i == p:
            return True
    return False

"""
A simple vector class
This is based on an immutable approach where a new vector is made everytime an action is made on the vector
"""
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)
    
    def __neg__(self):
        return Vector(-self.x, -self.y)
    
    def __str__(self):
        return "({}, {})".format(self.x, self.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return self.__str__()

# The heads current position
# head[0] = x-axis
# head[1] = y-axis
head = Vector(0, 2)
head_direction = Vector(1, 0)

# List of places the head have already been
tail = []

# Constant directions
LEFT = Vector(-1, 0)
RIGHT = Vector(1, 0)
UP = Vector(0, -1)
DOWN = Vector(0, 1)

# Direction codes
RUNNING_CODE = 0
WINNING_CODE = 1
LOSING_CODE = 2

"""
Bind a key to a direction that the head can move
"""
def assign_movement(key, dir):
    def pressed(_):
        global head_direction
        if -dir != head_direction:
            head_direction = dir
    keyboard.on_press_key(key, pressed)

assign_movement('a', LEFT)
assign_movement('d', RIGHT)
assign_movement('s', DOWN)
assign_movement('w', UP)

"""
Get a list of all tiles that does not contain a tail or head 
"""
def get_food_locations():
    for x in range(0, WIDTH):
        for y in range(0, HEIGHT):
            v = Vector(x, y)
            if not v in tail and v != head:
                yield v

"""
Update the foods location to a new valid position
if no positions can be found then the running flat is set to WINNING_CODE
"""
def new_food():
    global running, food
    locs = list(get_food_locations())
    if locs:
        food = random.choice(locs)
    else:
        running = WINNING_CODE

# Update the foods location
new_food()

"""
Display how the board is currently looking

head = (1, 1)
tail = [(2, 1), (3, 1), (4, 1)]

Board coordinat system
W = WIDTH
H = HEIGHT
P = Player position
T = Tail position
    0 P T T T    W-1
    | | | | |     |
    # # # # # # # # - 0
    # O T T T # # # - P + T
    # # # # # # # #
    # # # # # # # #
    # # # # # # # # - (H - 1)
"""
def display_board():
    global food
    for y in range(0, HEIGHT):
        line = []
        for x in range(0, WIDTH):
            tile = Vector(x, y)
            # Check if the grid collides with the head
            if tile == head:
                line.append(SNAKE_CHAR)
            elif tile == food:
                line.append(FOOD_CHAR)
            elif You_an_ass_eater(tile):
                line.append(TAIL_CHAR)
            else:
                line.append(EMPTY_CHAR)

        # Write the line to console
        print(' '.join(line))

"""
Clears the terminal

Might not work in PyCharm probably use another terminal
"""
def clear_screen():
    # Works on multiple platforms
    os.system('cls' if os.name == 'nt' else 'clear')


# Determin if the game is still running
running = RUNNING_CODE
while running == RUNNING_CODE:
    clear_screen()

    # Clear the terminal to avoid clutter
    tail.append(head)
    head += head_direction

    # Lose if outside boundary
    if head in tail or head.x == WIDTH or head.y == HEIGHT or head.x == -1 or head.y == -1:
        running = LOSING_CODE
        head -= head_direction
        break

    if head != food:
        tail = tail[1:]
    else:
        new_food()

    # Show the current board
    display_board()

    time.sleep(SLEEP_TIME)

# Display the end of game screen
clear_screen()
display_board()

if running == LOSING_CODE:
    print('HAHAHAH YOU DIED!!! EAT SHIT AND DIE!!!!')
if running == WINNING_CODE:
    print('You won?')


