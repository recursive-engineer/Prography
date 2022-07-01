#=========================================================#
# Reference From:
# https://raytracing.xyz/
# https://www.pythonguis.com/tutorials/bitmap-graphics/
# 
# Python 3.7.9 & PySide2
# Coding by Tatsuya Yamagishi
# Updated : DEC 14 2021
# Created : DEC 10 2021
#=========================================================#

import dataclasses
import math
import os
import random
import sys
import time

from perlin_noise import PerlinNoise
from PySide2 import QtCore, QtGui, QtWidgets

@dataclasses.dataclass
class Info:
    name: str = 'Y-Ray'
    version: str = 'v2.1.0'
    width: int = 400
    height: int = 200
    viewColor: QtGui.QColor = QtGui.QColor('Blue')
    refresh: int = 200

    _NO_HIT: float = float('inf')
    _EPSILON: float = 0.001
    _DEPTH_MAX: int = 10
    _VACUUM_REFRACTIVE_INDEX: float = 1.0

    @classmethod
    def NO_HIT(cls):
        return cls._NO_HIT

    @classmethod
    def EPSILON(cls):
        return cls._EPSILON

    @classmethod
    def DEPTH_MAX(cls):
        return cls._DEPTH_MAX

    @classmethod
    def VACUUM_REFRACTIVE_INDEX(cls):
        return cls._VACUUM_REFRACTIVE_INDEX

#=========================================================#
# Class
#=========================================================#
@dataclasses.dataclass
class Vec:
    x: float
    y: float
    z: float

    def add(self, v):
        return Vec(self.x + v.x, self.y + v.y, self.z + v.z)

    def add(self, v):
        return Vec(self.x + v.x, self.y + v.y, self.z + v.z)
    
    def sub(self, v):
        return Vec(self.x - v.x, self.y - v.y, self.z - v.z)
    
    def scale(self, s):
        return Vec(self.x * s, self.y * s, self.z * s)
    
    def neg(self):
        return Vec(-self.x, -self.y, -self.z)
    
    def len(self):
        return math.sqrt(self.x * self.x + self.y * self.y + self.z * self.z)
    
    def normalize(self):
        return self.scale(1.0 / self.len())
    
    def dot(self, v):
        return (self.x * v.x + self.y * v.y + self.z * v.z)
    
    def cross(self, v):
        return Vec( self.y * v.z - v.y * self.z,
                    self.z * v.x - v.z * self.x,
                    self.x * v.y - v.x * self.y)

    def reflect(self, n):
        return self.sub(n.scale(2 * self.dot(n)))

    def refract(self, n, eta: float):
        dot = self.dot(n)
        d = 1.0 - (eta**2) * (1.0 - (dot**2))
        
        if (0 < d):
            a = self.sub(n.scale(dot)).scale(eta)
            b = n.scale(math.sqrt(d))
            
            return a.sub(b)
        
        return self.reflect(n)

    def toString(self):
        return f'Vec({self.x}, {self.y}, {self.z})'

@dataclasses.dataclass
class Spectrum:
    r: float
    g: float
    b: float
  
    def add(self, v):
        return Spectrum(self.r + v.r, self.g + v.g, self.b + v.b)

    def mul(self, v):
        return Spectrum(self.r * v.r, self.g * v.g, self.b * v.b)
    
    def scale(self, s: float):
        return Spectrum(self.r * s, self.g * s, self.b * s)

    def toColor(self):
        ir = int(min(self.r * 255, 255))
        ig = int(min(self.g * 255, 255))
        ib = int(min(self.b * 255, 255))
        
        return (ir, ig, ib)

    @staticmethod
    def BLACK():
        return Spectrum(0, 0, 0)

@dataclasses.dataclass
class Ray:
    origin: Vec
    dir: Vec

    def __init__(self, origin: Vec, dir: Vec):
        self.origin = origin.add(dir.scale(Info.EPSILON()))
        self.dir = dir.normalize()

@dataclasses.dataclass
class Material:
    diffuse: Spectrum = None
    reflective: float = 0.0
    refractive = 0 # 屈折割合
    refractiveIndex = 1 # 屈折率

@dataclasses.dataclass
class Light:
    pos: Vec
    power: Spectrum

@dataclasses.dataclass
class Intersection:
    t: float = Info.NO_HIT()    # 交差点までの距離
    p: Vec = None               # 交差点
    n: Vec = None               # 法線
    material: Material = None   # マテリアル

    def hit(self):
        return self.t != Info.NO_HIT()

class Intersectable:
    def intersect(self, ray: Ray):
        pass

class Sphere(Intersectable):
    def __init__(self, center: Vec, radius: float, material: Material):
        self.center   = center
        self.radius   = radius
        self.material = material

    def intersect(self, ray: Ray) -> Intersection:
        isect = Intersection()
        v = ray.origin.sub(self.center)
        b = ray.dir.dot(v)
        c = v.dot(v) - self.radius**2
        d = b * b - c
        
        if (d >= 0):
            s = math.sqrt(d)
            t = -b - s
        
            if (t <= 0):
                t = -b + s
            
            if (0 < t):
                isect.t = t
                isect.p = ray.origin.add(ray.dir.scale(t))
                isect.n = isect.p.sub(self.center).normalize()
                isect.material = self.material

        return isect

class Cube(Intersectable):
    def __init__(self, center: Vec, edge: float, material: Material):
        self.center   = center
        self.edge   = edge
        #self.angle_z   = angle_z
        #self.angle_x   = angle_x
        self.material = material

    def intersect(self, ray: Ray) -> Intersection:
        isect = Intersection()
        
        def face(self,center:Vec,edge1:Vec,edge2:Vec):
            x1,x2,y1:Vec
            x1=center.add(self.edge/2,0,0)
            x2=center.sub(self.edge/2,0,0)
            y1=center.add(0,self.edge/2,0)
            y2=center.sub(0,self.edge/2,0)
            z1=center.add(0,0,self.edge/2)
            z2=center.sub(0,0,self.edge/2)

            

            t=-ray.origin.dot(n)/ray.dir.dot(n)

            return t

        center1,center2:Vec
        center1=self.center.add(-self.edge/2,-self.edge/2,-self.edge/2)
        center2=self.center.add(self.edge/2,self.edge/2,self.edge/2)
        t=face(center1,Vec(self.edge,0,0),Vec(0,self.edge,0))
        t=face(center1,Vec(self.edge,0,0),Vec(0,0,self.edge))
        t=face(center1,Vec(0,self.edge,0),Vec(0,0,self.edge))
        t=face(center2,Vec(-self.edge,0,0),Vec(0,-self.edge,0))
        t=face(center2,Vec(-self.edge,0,0),Vec(0,0,-self.edge))
        t=face(center2,Vec(0,-self.edge,0),Vec(0,0,-self.edge))
    

        if (d >= 0):
            t = max(t_x1,t_y1,t_z1)
            
            if (0 < t):
                isect.t = t
                isect.p = ray.origin.add(ray.dir.scale(t))
                isect.n = isect.p.sub(self.center).normalize()
                isect.material = self.material

        return isect

class Plane(Intersectable):
    def __init__(self, p: Vec, n: Vec, material: Material):
        self.n = n.normalize()
        self.d = -p.dot(self.n)
        self.material = material

    def intersect(self, ray):
        isect = Intersection()
        v = self.n.dot(ray.dir)
        t = -(self.n.dot(ray.origin) + self.d) / v
        
        if (0 < t):
            isect.t = t
            isect.p = ray.origin.add(ray.dir.scale(t))
            isect.n = self.n
            isect.material = self.material

        return isect

class CheckedObj(Intersectable):
    def __init__(
        self, obj: Intersectable, 
        gridWidth: float, material2: Material
    ):
        self.obj = obj
        self.gridWidth = gridWidth
        self.material2 = material2

    def intersect(self, ray: Ray):
        isect = self.obj.intersect(ray)

        if isect.hit():
            i = (   round(isect.p.x/self.gridWidth) +
                    round(isect.p.y/self.gridWidth) +
                    round(isect.p.z/self.gridWidth)
            )
            
            if (i % 2 == 0):
                isect.material = self.material2

        return isect

class TexturedObj(Intersectable):
    def __init__(self, obj: Intersectable, image: QtGui.QImage,
         size: float, origin: Vec, uDir: Vec, vDir:  Vec
    ):
        self.obj = obj
        self.image = image
        self.size = size
        self.origin = origin
        self.uDir = uDir
        self.vDir = vDir

    def intersect(self, ray: Ray):
        isect = self.obj.intersect(ray)

        if isect.hit():
            u = isect.p.sub(self.origin).dot(self.uDir) / self.size
            u = math.floor((u - math.floor(u)) * self.image.width())
            v = -isect.p.sub(self.origin).dot(self.vDir) / self.size
            v = math.floor((v - math.floor(v)) * self.image.height())

            c_obj = QtGui.QColor(self.image.pixel(int(u), int(v)))
            c = c_obj.getRgb()

            mtl = Material(Spectrum(c[0] / 255.0, c[1] / 255.0, c[2] / 255.0).mul(isect.material.diffuse))
            mtl.reflective = isect.material.reflective
            mtl.refractive = isect.material.refractive
            mtl.refractiveIndex = isect.material.refractiveIndex
            isect.material = mtl

        return isect

class Scene:
    def __init__(self) -> None:
        self.objList = []
        self.lightList = []

    def addIntersectable(self, obj: Intersectable):
        self.objList.append(obj)
    
    def addLight(self, light: Light):
        self.lightList.append(light)

    def trace(self, ray: Ray, depth: int):
        # トレースの最大回数に達した場合は計算を中断する
        if Info.DEPTH_MAX() < depth:
            return Spectrum.BLACK()
        
        # [1] 交点を求める
        isect = self.findNearestIntersection(ray)

        if not isect.hit():
            return Spectrum.BLACK()

        m = isect.material
        l = Spectrum.BLACK() # ここに最終的な計算結果が入る

        if (isect.n.dot(ray.dir) < 0): # [1] 物体に外部から交差した場合
            # 鏡面反射成分
            ks = m.reflective
            if (0 < ks):
                r = ray.dir.reflect(isect.n) # 反射レイを導出
                c = self.trace(Ray(isect.p, r), depth + 1) # 反射レイを飛ばす
                l = l.add(c.scale(ks).mul(m.diffuse)) # 計算結果に鏡面反射成分を足す

            # [2] 屈折成分
            kt = m.refractive
            if (0 < kt):
                r = ray.dir.refract(isect.n, Info.VACUUM_REFRACTIVE_INDEX() / m.refractiveIndex)# 屈折レイを導出
                c = self.trace(Ray(isect.p, r), depth + 1) # 屈折レイを飛ばす
                l = l.add(c.scale(kt).mul(m.diffuse)) # 計算結果に屈折成分を足す

            #  拡散反射成分
            kd = 1.0 - ks - kt # エネルギー保存則の計算
            if (0 < kd):
                c = self.lighting(isect.p, isect.n, isect.material) # 拡散反射面の光源計算を行う
                l = l.add(c.scale(kd)) # 計算結果に拡散反射成分を足す

        else: # [3] 物体から出ていく場合
            r = ray.dir.refract(isect.n.neg(), m.refractiveIndex / Info.VACUUM_REFRACTIVE_INDEX()) # 屈折レイを導出
            l = self.trace(Ray(isect.p, r), depth + 1) # 屈折レイを飛ばす
        
        return l

    def findNearestIntersection(self, ray: Ray):
        isect = Intersection()
        for obj in self.objList:
            tisect = obj.intersect(ray)
            
            if ( tisect.t < isect.t ):
                isect = tisect
            
        return isect

    def lighting(self, p: Vec, n: Vec, m: Material):
        L = Spectrum.BLACK()

        for light in self.lightList:
            c = self.diffuseLighting(p, n, m.diffuse, light.pos, light.power)
            L = L.add(c)

        return L

    def diffuseLighting(
            self, p: Vec,
            n: Vec,
            diffuseColor: Spectrum,
            lightPos: Vec,
            lightPower: Spectrum
        ):

        v = lightPos.sub(p)
        l = v.normalize()
        dot = n.dot(l)

        if (dot > 0):
            if (self.visible(p, lightPos)):
                r = v.len()
                factor = dot / (4 * math.pi * r * r)
                return lightPower.scale(factor).mul(diffuseColor)

        return Spectrum.BLACK()

    def visible(self, org: Vec , target: Vec ):
        v = target.sub(org).normalize()
        shadowRay = Ray(org, v)
        for obj in self.objList:
            if (obj.intersect(shadowRay).t < v.len()):
                return False

        return True
#=========================================================#
# Core
#=========================================================#
class Core:
    def __init__(self):
        self.info = Info()

        # シーン作成
        self.scene = Scene()
        # 視点の定義
        self.eye = Vec(0, 2, 5)

        self.imageTest = QtGui.QImage(r'C:\Users\ta_yamagishi\Pictures\shibuya.png')

        self.initScene()

    #===========================================#
    # InitScene
    #===========================================#
    def initScene(self):
        scene = self.scene

        # 球
        mtlSphere = Material(Spectrum(0.5, 0.5, 0.5))
        mtlSphere.refractive = 0.9
        mtlSphere.refractiveIndex = 2.0
        scene.addIntersectable(
            Cube(
                Vec(0, 0, 0),
                1,
                mtlSphere
            )
        )

        # チェック柄の床
        mtlFloor1 = Material(Spectrum(0.5, 0.5, 0.5))
        mtlFloor2 = Material(Spectrum(0.2, 0.2, 0.2))
        scene.addIntersectable(
            CheckedObj(
                Plane(
                    Vec(0, -1, 0), # 位置
                    Vec(0, 1, 0), # 法線
                    mtlFloor1 # 材質1
                ),
                1, # グリッド幅
                mtlFloor2 # 材質2
            )
        )

        # 点光源
        scene.addLight(
            Light(
                Vec(100, 100, 100), # 位置
                Spectrum(2000000, 2000000, 2000000) # パワー（光源色）
            )
        )
    #===========================================#
    # Set / Get
    #===========================================#
    def setWidth(self, w: int):
        self.info.width = w

    def width(self):
        return self.info.width

    def setHeight(self, h: int):
        self.info.height = h

    def height(self):
        return self.info.height

    def setSize(self, w: int, h: int):
        self.setWidth(w)
        self.setHeight(h)

    def size(self):
        return (self.width(), self.height())

    def name(self):
        return self.info.name

    def version(self):
        return self.info.version

    def viewColor(self):
        return self.info.viewColor

    def refresh(self):
        return self.info.refresh

    #=====================================#
    # Method
    #=====================================#
    def calcPixelColor(self, x, y):
        ray = self.calcPrimaryRay(x, y)
        l = self.scene.trace(ray, 0)
        return l.toColor()
        
    def calcPrimaryRay(self, x, y):
        w = self.width()
        h = self.height()

        imagePlane = h
        dx = x + 0.5 - w / 2
        dy = -(y + 0.5 - h / 2)
        dz = -imagePlane
        
        return Ray(
            self.eye,
            Vec(dx, dy, dz).normalize()
        )

    def intersectRaySphere(self, rayDir):
        v = self.eye.sub(self.sphereCenter)
        b = rayDir.dot(v)
        c = v.dot(v) - self.sphereRadius**2
        d = b*b-c

        if (0<=d): # 交差した場合、交点までの距離を計算
            s = math.sqrt(d)
            t = -b-s
            
            if t <= 0:
                t = -b+s
            if 0<t:
                return t

        return Info.NO_HIT()

    def diffuseLighting(self, p: Vec, n: Vec,):
        v = self.lightPos.sub(p)
        l = v.normalize()
        
        dot = n.dot(l)

        if (dot > 0):
            r = v.len()
            factor = dot / (4 * math.pi * r * r)
            return self.lightPower.scale(factor).mult(self.diffuseColor)
        else:
            return self.BLACK
    
    def uv(self, x, y):
        w = self.width()
        h = self.height()

        r = (x+0.5)/w
        g = (y+0.5)/h
        b = 0.0

        return (r, g, b)

    def random(self):
        v = random.random()
        
        return (v, v, v)

    def random_color(self):
        r = random.random()
        g = random.random()
        b = random.random()
        
        return (r, g, b)

    def pnoise(self, x, y, scale = 1.0, octaves=1, seed=1):
        grid = 100.0

        noise = PerlinNoise(octaves=octaves, seed=seed)
        v = noise([x/grid*scale, y/grid*scale])
        v += 0.5

        v = max(v, 0.0)

        return (v, v, v)
#=========================================================#
# GUI
#=========================================================#
# レンダー用Widget
class RenderWidget(QtWidgets.QWidget):
    def __init__(self, core, parent=None):
        super().__init__(parent)
        self.core = core

        self.init()
        self.initSignals()

        # Update Timer
        self.timer = QtCore.QTimer(self)
        self.timer.timeout.connect(self.update)
        self.timer.start(self.core.refresh())

    def init(self):
        layout = QtWidgets.QVBoxLayout(self)

        # Rendering Button
        self.button_render = QtWidgets.QPushButton('Rendering')
        self.button_render.setMinimumHeight(30)
        font = QtGui.QFont()
        font.setFamily('Arial Black')
        font.setPointSize(11)
        self.button_render.setFont(font)

        layout.addWidget(self.button_render)

        # View
        w, h = self.core.size()
        self.image = QtGui.QImage(w, h, QtGui.QImage.Format_RGB888)
        self.image.fill(self.core.viewColor())
        self.pixmap = QtGui.QPixmap(self.image)
        self.view = QtWidgets.QLabel()
        self.view.setPixmap(self.pixmap)
        self.view.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(self.view)

        # Log
        self.log = QtWidgets.QTextEdit()
        layout.addWidget(self.log)

    def initSignals(self):
        self.button_render.pressed.connect(self.draw)

    #=====================================#
    # Set / Get
    #=====================================#
    def setLog(self, text):
        self.log.moveCursor(QtGui.QTextCursor.End)
        self.log.insertPlainText(str(text)+'\n')
        self.log.ensureCursorVisible()
        print(text)

    def setImage(self, file):
        self.image = QtGui.QImage(file)
        
        self.updateByImage()

    #=====================================#
    # Method
    #=====================================#
    def updateByImage(self):
        size = self.image.size()
        w = size.width()
        h = size.height()

        self.core.setSize(w, h)
        self.pixmap = QtGui.QPixmap(self.image)
        self.view.setPixmap(self.pixmap)

        self.parent().setup()
        
    #=====================================#
    # Draw
    #=====================================#
    def draw(self):
        start = time.time()
        self.setLog('> Start Render.')

        w, h = self.core.size() 
        self.pixmap = self.view.pixmap()
        self.pixmap.fill(self.core.viewColor())
        painter = QtGui.QPainter(self.pixmap)
        pen = QtGui.QPen()
        pen.setWidth(1)

        for y in range(h):
            for x in range(w):
                r, g, b = self.core.calcPixelColor(x, y)

                color = QtGui.QColor(r, g, b)
                pen.setColor(color)
                painter.setPen(pen)
                painter.drawPoint(x, y)
                
                QtWidgets.QApplication.processEvents()

        painter.end()
        self.setLog('Render Finished.')
        
        elapsed = time.time() - start
        m, s = divmod(elapsed, 60)
        log = f'Time = {int(m)}m{s:.3f}s'
        self.setLog(log)
        self.setLog('')
        self.parent().status_bar.showMessage(log)

        self.update()

# メインウィンドウ
class MainWinodw(QtWidgets.QMainWindow):
    def __init__(self, core, parent=None):
        super().__init__(parent)

        self.core = core

        self.init()
        self.setup()

    def setup(self):
        w, h = self.core.size()
        self.resize(w+100, h)

        title = f'{self.core.name()} {self.core.version()} : [{w} x {h}]'
        self.setWindowTitle(title)

    def init(self):
        #=====================================#
        # Central Widget
        #=====================================#
        self.render_widget = RenderWidget(self.core)
        self.setCentralWidget(self.render_widget)

        #=====================================#
        # Menubar
        #=====================================#
        self.menu_bar = self.menuBar()

        # File Menu
        self.menu_file = self.menu_bar.addMenu('File')
        
        # Save Menu
        action = QtWidgets.QAction('Save', self)
        action.triggered.connect(self.saveImage)
        action.setShortcut(QtGui.QKeySequence('Ctrl+S'))
        self.menu_file.addAction(action)

        action = QtWidgets.QAction('Open', self)
        action.triggered.connect(self.openImage)
        action.setShortcut(QtGui.QKeySequence('Ctrl+O'))
        self.menu_file.addAction(action)

        self.menu_file.addSeparator()

        action = QtWidgets.QAction('Exit', self)
        action.setShortcut(QtGui.QKeySequence('Ctrl+Q'))
        action.triggered.connect(self.exit)
        self.menu_file.addAction(action)

        # Edit Menu
        self.menu_edit = self.menu_bar.addMenu('Edit')

        # Copy Menu
        action = QtWidgets.QAction('Copy', self)
        action.triggered.connect(self.copyImage)
        action.setShortcut(QtGui.QKeySequence('Ctrl+C'))
        self.menu_edit.addAction(action)

        action = QtWidgets.QAction('Paste', self)
        action.triggered.connect(self.pasteImage)
        action.setShortcut(QtGui.QKeySequence('Ctrl+V'))
        self.menu_edit.addAction(action)

        #=====================================#
        # Statsubar
        #=====================================#
        self.status_bar = self.statusBar()

    def saveImage(self):
        self.render_widget.setLog('> Save Image')

        path = os.path.dirname(os.path.abspath(__file__))
        file, ext = QtWidgets.QFileDialog.getSaveFileName(
            self,
            dir = path,
            filter = '*.png'
        )
        
        if file:
            pixmap = self.render_widget.view.pixmap()
            pixmap.save(file)
            self.render_widget.setLog(f'File = {file}\n')

    def openImage(self):
        path = os.path.dirname(os.path.abspath(__file__))
        file, ext = QtWidgets.QFileDialog.getOpenFileName(
            self,
            dir = path,
            filter = '*.png *.jpg'
        )

        if file:
            self.render_widget.setLog('> Open Image')
            self.render_widget.setLog(f'File = {file}\n')

            image = QtGui.QImage(file)
            self.render_widget.setImage(image)
    
    def copyImage(self):
        self.render_widget.setLog('> Copy Image')

        cb = QtGui.QClipboard()
        pixmap = self.render_widget.pixmap

        cb.setPixmap(pixmap)

    def pasteImage(self):
        self.render_widget.setLog('> Paste Image')

        cb = QtGui.QClipboard()
        image = cb.image()

        self.render_widget.setImage(image)

    def exit(self):
        self.close()

def main():
    app = QtWidgets.QApplication(sys.argv)
    core = Core()
    view = MainWinodw(core)
    view.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()