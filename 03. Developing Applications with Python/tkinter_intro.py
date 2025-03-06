import tkinter as tk 
root = tk.Tk() 

# Tạo một cửa sổ giao diện có hai nút: "Bật" và "Tắt" để thay đổi nền của cửa sổ.
def change_background(color):
    root['bg']=color
buttonOn = tk.Button(root, text="Bật", command=change_background('blue'))
buttonOff = tk.Button(root, text="Tắt", command=change_background('red'))
buttonOn.pack()
buttonOff.pack()

root.mainloop()