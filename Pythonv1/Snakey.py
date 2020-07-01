import os

# Board dimensions
WIDTH = 5
HEIGHT = 5

# The heads current position
# head[0] = x-axis
# head[1] = y-axis
head = (0, 2)

# List of places the head have already been
tail = [(0, 2), (0, 0), (1, 0)]

# List of characters to display the board
EMPTY_CHAR = '#'
SNAKE_CHAR = 'O'
TAIL_CHAR = 'T'

"""
Tests wether a given coordinat is hitting a piece of the tail
False = no tail at that coordinat
True = a tail is at that coordinat
"""
def You_an_ass_eater(x, y):
    for i in tail:
        if i == (x, y):
            return True
    return False


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
    for y in range(0, HEIGHT):
        line = []
        for x in range(0, WIDTH):
            # Check if the grid collides with the head
            if x == head[0] and y == head[1]:
                line.append(SNAKE_CHAR)
            elif You_an_ass_eater(x, y):
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
running = True
while running:
    # Show the current board
    display_board()

    # Let user pick the next direction
    user_input = input('direction: ')

    # Clear the terminal to avoid clutter
    clear_screen()
    print('User typed ' + user_input)

    dx = 0
    dy = 0

    # Control head moving direction
    if user_input == 'right': dx = 1
    if user_input == 'left': dx = -1
    if user_input == 'up': dy = -1
    if user_input == 'down': dy = 1

    head = (head[0] + dx, head[1] + dy)

    # Lose if outside boundary
    if head[0] == WIDTH:
        running = False
    if head[1] == HEIGHT:
        running = False
    if head [1] == -1:
        running = False
    if head[0] == -1:
        running = False

# Display end of game screen
clear_screen()
display_board()
print('HAHAHAH YOU DIED!!! EAT SHIT AND DIE!!!!')



