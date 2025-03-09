from GeometricObject import GeometricObject
import math

class Circle(GeometricObject):
    def __init__(self, radius):
        super().__init__()
        self.__radius = radius

    def getRadius(self):
        return self.__radius
    
    def setRadius(self, radius):
        self.__radius = radius

    def getArea(self):
        return math.pi * self.__radius ** 2
    
    def getDiameter(self):
        return self.__radius * 2
    
    def getPerimeter(self):
        return 2 * self.__radius * math.pi
    
    def printCircle(self):
        print(self.__str__() + " radius: " + str(self.__radius))