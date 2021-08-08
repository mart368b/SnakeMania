import commctrl, win32gui, win32con, win32api, ctypes, math, os, shutil, time, pywintypes, keyboard, itertools, random
from vectormath import Vector2
PREFIX = '_'
RECYCLE_BIN_NAME = 'Recycle bin'

private_desktop_path = os.path.expanduser('~/Desktop').replace('\\', '/')
private_save_path = os.path.expanduser('~/Documents/SavedDesktop/private').replace('\\', '/')

public_desktop_path = 'C:/Users/Public/Desktop'
public_save_path = os.path.expanduser('~/Documents/SavedDesktop/public').replace('\\', '/')

class Icon:
    def __init__(self, desktop, name, x, y):
        self.desktop = desktop
        self.name = name
        self.x = x
        self.y = y
        self.order = -1

class Desktop:
    def __init__(self, width, height):
        self.desktop = Desktop.create_desktop()

        self.width = width
        self.height = height

        spacing = win32gui.SendMessage(self.desktop, commctrl.LVM_GETITEMSPACING, 0)
        (self.icon_width, self.icon_height) = split_word(spacing)

        self.board_width = math.floor(width / self.icon_width)
        self.board_height = math.floor(height / self.icon_height)

        print(self.board_width, self.board_height)

        self.board = [[None for y in range(0, self.board_height)] for x in range(0, self.board_width)]
        self.update_order = []
    
    @staticmethod
    def create_desktop():
        """Get the window of the icons, the desktop window contains this window"""
        shell_window = ctypes.windll.user32.GetShellWindow()
        shell_dll_defview = win32gui.FindWindowEx(shell_window, 0, "SHELLDLL_DefView", "")
        if shell_dll_defview == 0:
            sys_listview_container = []
            try:
                win32gui.EnumWindows(Desktop._callback, sys_listview_container)
            except pywintypes.os.error as e:
                if e.winerror != 0:
                    raise
            sys_listview = sys_listview_container[0]
        else:
            sys_listview = win32gui.FindWindowEx(shell_dll_defview, 0, "SysListView32", "FolderView")
        return sys_listview
    
    @staticmethod
    def _callback(hwnd, extra):
        class_name = win32gui.GetClassName(hwnd)
        if class_name == "WorkerW":
            child = win32gui.FindWindowEx(hwnd, 0, "SHELLDLL_DefView", "")
            if child != 0:
                sys_listview = win32gui.FindWindowEx(child, 0, "SysListView32", "FolderView")
                extra.append(sys_listview)
                return False
        return True

    @staticmethod
    def save():
        ensure_exist(private_save_path)
        ensure_exist(public_save_path)

        try:
            move_dir_content(private_desktop_path, private_save_path)
            move_dir_content(public_desktop_path, public_save_path)
        except Exception as e:
            Desktop.restore()
            raise e

    @staticmethod
    def restore():
        try:
            if os.path.exists(private_save_path):
                move_dir_content(private_save_path, private_desktop_path, force=True)
            if os.path.exists(public_save_path):
                move_dir_content(public_save_path, public_desktop_path, force=True)
        except:
            raise 'Failed to restore desktop\n to restore move ' + private_save_path + ' to ' + private_desktop_path + '\n and ' + public_save_path + ' to ' + public_desktop_path
        finally:
            if os.path.exists(private_save_path):
                os.rmdir(private_save_path)
            if os.path.exists(public_save_path):
                os.rmdir(public_save_path)

    @staticmethod
    def clear_icons():
        for filename in os.listdir(private_desktop_path):
            if filename.startswith(PREFIX):
                os.rmdir(os.path.join(private_desktop_path, filename).replace('\\', '/'))

    def check_collision(self, x, y):
        if x < 0 or x > self.board_width:
            raise IndexError(str(x) + ' out of range ' + str(self.board_width))
        if y < 0 or y > self.board_height:
            raise IndexError(str(y) + ' out of range ' + str(self.board_height))
        return self.board[x][y]

    def check_pos(self, x, y):
        if x < 0 or x > self.board_width:
            raise IndexError(str(x) + ' out of range ' + str(self.board_width))
        if y < 0 or y > self.board_height:
            raise IndexError(str(y) + ' out of range ' + str(self.board_height))
        if not self.board[x][y] is None:
            raise MemoryError('Found icon collision on ' + str((x, y)))
    
    def get_free_spot(self):
        spots = []
        for (x, row) in enumerate(self.board):
            for (y, tile) in enumerate(row):
                if tile is None:
                    spots.append((x, y))
        return random.choice(spots)

    def check_icon(self, icon):
        if not icon.desktop == self:
            raise AssertionError('Recieved foreign icon')
        if not self.board[icon.x][icon.y]:
            raise MemoryError('Invalid icon position ' + str((icon.x, icon.y)) + ' no icon is registered there')
    
    def move_icon(self, icon, x, y):
        self.check_icon(icon)
        self.check_pos(x, y)
        self.board[icon.x][icon.y] = None
        self.board[x][y] = icon
        icon.x = x
        icon.y = y
        if icon.order == -1:
            raise AssertionError('Recieved uninitialized icon')
        self._move_icon(icon.order, x, y)
        return icon

    def _move_icon(self, i, x, y):
        win32gui.SendMessage(self.desktop, commctrl.LVM_SETITEMPOSITION, i, create_word(y * self.icon_height, x * self.icon_width))

    def icon_count(self):
        return win32gui.SendMessage(self.desktop, commctrl.LVM_GETITEMCOUNT)

    def create_icon(self, name, x, y, wrapper=False):
        return self.create_icons([name], [x], [y], wrapper=wrapper)[0]

    def create_icons(self, names, xs, ys, wrapper=False):
        icons = []
        for (name, x, y) in zip(names, xs, ys):
            self.check_pos(x, y)
            if any( icn.name == name for icn in self.update_order):
                raise NameError('Cannot create ' + name + '  as it already exists')
            if not wrapper:
                name = PREFIX + name + PREFIX
                path = os.path.join(private_desktop_path, name).replace('\\', '/')
                if not os.path.exists(path):
                    os.mkdir(path)
            new_icon = Icon(self, name, x, y)
            icons.append(new_icon)
            self.board[x][y] = new_icon
        
        self.update_order.extend(icons)
        self._update_order()
        for icn in icons:
            time.sleep(0.4)
            self._move_icon(icn.order, x, y)
        return icons

    def remove_icon(self, icn):
        self.check_icon(icn)
        self.board[icn.x][icn.y] = None
        path = os.path.join(private_desktop_path, icn.name)
        os.rmdir(path)
        del self.update_order[icn.order]
        self._update_order()

    def _update_order(self):
        self.update_order.sort(key=lambda icn: icn.name)
        for (order, icn) in enumerate(self.update_order):
            icn.order = order

def create_word(hi, lo):
    return (hi << 16) | (lo & 0xFFFF)

def split_word(word):
    return (word & 0xFFFF, word >> 16)

def move_dir_content(src, dst, force = False):
    for filename in os.listdir(src):
        if force or not filename.startswith(PREFIX):
            current_path = os.path.join(src, filename).replace('\\', '/')
            new_path = os.path.join(dst, filename).replace('\\', '/')
            shutil.move(current_path, new_path)

def ensure_exist(path):
    if not os.path.exists(path):
        os.makedirs(path)

desktop = Desktop(1920, 1080)
desktop.save()
desktop.clear_icons()

class Food:
    def __init__(self, desktop):
        (x, y) = desktop.get_free_spot()
        self.icon = desktop.create_icon('Recycle bin', x, y, wrapper=True)

    def reallocate(self, desktop):
        global running
        free_spot = desktop.get_free_spot()
        if not free_spot :
            running = False
            print('You win!!!!!')
        (x, y) = free_spot
        desktop.move_icon(self.icon, x, y)
class Snake:
    def __init__(self, desktop, x, y):
        self.pos = Vector2(x, y)
        self.direction = Vector2(0, 0)
        self.need_tail = False
        self.icon = desktop.create_icon('Player', x, y)
        self.tail = []

        keyboard.on_press_key('d', self.on_press(Vector2(1, 0)))
        keyboard.on_press_key('a', self.on_press(Vector2(-1, 0)))
        keyboard.on_press_key('s', self.on_press(Vector2(0, 1)))
        keyboard.on_press_key('w', self.on_press(Vector2(0, -1)))

    @property
    def x(self):
        return int(self.pos.x)

    @property
    def y(self):
        return int(self.pos.y)

    def tick(self, desktop):
        global running
        if self.direction.length > 0:
            self.pos = self.pos + self.direction
            self.pos = Vector2(self.x % desktop.board_width, self.y % desktop.board_height)

            collision = desktop.check_collision(self.x, self.y)
            if collision:
                if collision == food.icon:
                    self.need_tail = True
                    food.reallocate(desktop)
                else:
                    running = False
                    print('You died')
                    return
            
            last_pos = (self.icon.x, self.icon.y)
            desktop.move_icon(self.icon, self.x, self.y)
            for tail in self.tail:
                tmp = (tail.x, tail.y)
                desktop.move_icon(tail, last_pos[0], last_pos[1])
                last_pos = tmp

            if self.need_tail:
                new_tail = desktop.create_icon('Tail' + str(len(self.tail)), last_pos[0], last_pos[1])
                self.tail.append(new_tail)
                self.need_tail = False
    def on_press(self, dir):
        def _on_press(e):
            self.direction = dir
        return _on_press

    def on_release(self):
        def _on_release(e):
            self.direction = Vector2(0, 0)
        return _on_release

head = Snake(desktop, 0, 0)

food = Food(desktop)

running = True
while running:
    head.tick(desktop)
    time.sleep(0.1)

desktop.clear_icons()
desktop.restore()

#restore_desktop()


#init()

#recycle_bin = Icon(RECYCLE_BIN_NAME, max_x, max_y, exists=True)

#while True:
#    time.sleep(0.5)
#    recycle_bin.x = (recycle_bin.x + 1) % 10
#    recycle_bin.y = (recycle_bin.y + 1) % 10
#    recycle_bin.update()

#clear_icons()

#
#24 - 10
#total_count = (max_x + 1) * max_y - 1
#print((max_x + 1), max_y)
#for i in range(0, total_count):
#    x = int(i % (max_x + 1))
#    y = int(math.floor(i / (max_x + 1)))
#    Icon(str(x) + '_' + str(y) , x, y)

#time.sleep(2)
#Icon.update_screen()





