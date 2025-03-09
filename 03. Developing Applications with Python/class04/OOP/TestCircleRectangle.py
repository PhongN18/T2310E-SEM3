from CircleFromGeometricObject import Circle
from RectangleFromGeometricObject import Rectangle

def main():
    circle = Circle(1.5)
    print("A circle", circle)
    print("Radius:", circle.getRadius())
    print("Area:", circle.getArea())
    print("Diameter:", circle.getDiameter())
    print("Perimeter:", circle.getPerimeter())

    rectangle = Rectangle(2, 4)
    print("A rectangle", rectangle)
    print("Area:", rectangle.getArea())
    print("Perimeter:", rectangle.getPerimeter())

main()