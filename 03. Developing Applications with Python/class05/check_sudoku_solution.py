"""
This script checks whether a given Sudoku solution is valid
"""

def is_valid(grid):
    """Check whether a given Sudoku solution is valid"""
    for i in range(9):
        for j in range(9):
            if grid[i][j] < 1 or grid[i][j] > 9 or not is_valid_at(i, j, grid):
                return False
    return True

def is_valid_at(i, j, grid):
    """Check whether grid[i][j] is valid in its row, column, and 3x3 box"""
    
    # Check row
    for col in range(9):
        if col != j and grid[i][col] == grid[i][j]: return False
    
    # Check column
    for row in range(9):
        if row != i and grid[row][j] == grid[i][j]: return False

    # Check 3x3 box
    start_row, start_col = (i // 3) * 3, (j // 3) * 3
    for row in range(start_row, start_row + 3):
        for col in range(start_col, start_col + 3):
            if (row != i or col != j) and grid[row][col] == grid[i][j]:
                return False
            
    return True