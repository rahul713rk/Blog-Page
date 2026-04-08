# Binary Search: Common Patterns for DSA Problems

*A Comprehensive Guide for Beginners and Experts*

---

## **1. Introduction to Binary Search**

Binary search is a **divide-and-conquer** algorithm used to find the position of a target value within a **sorted array**. It works by repeatedly dividing the search interval in half, eliminating half of the remaining elements each time.

### **Why Binary Search?**

- **Efficiency:** O(log n) time complexity, much faster than linear search (O(n)).

- **Applications:** Used in arrays, matrices, and even external data structures like B-trees.

- **Foundation:** Many advanced algorithms (e.g., interpolation search, ternary search) are built on binary search principles.

### **Core Concept**

- **Precondition:** The array must be **sorted** (ascending or descending).

- **Steps:**
  
  1. Compare the target value with the middle element.
  
  2. If the target is equal to the middle element, return its index.
  
  3. If the target is less, search the left half.
  
  4. If the target is greater, search the right half.
  
  5. Repeat until the element is found or the search space is exhausted.

---

---

## **2. Common Patterns in Binary Search**

Binary search is not just about finding an element—it’s about **adapting** its core logic to solve a variety of problems efficiently. Below are the most common patterns with detailed explanations, code examples, and use cases.

---

### **Pattern 1: Standard Binary Search (Finding an Element)**

**Problem:** Find the index of a target value in a sorted array. If not found, return `-1`.

#### **Approach**

- Use the classic binary search logic.

- Adjust the search boundaries based on comparisons.

#### **Java Implementation**

```java
public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2; // Avoids overflow
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Target not found
}
```

#### **Python Implementation**

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

#### **Complexity Analysis**

- **Time:** O(log n)

- **Space:** O(1)

#### **Edge Cases**

- Empty array.

- Target not in the array.

- Duplicate elements (returns the first occurrence).

---

---

### **Pattern 2: Lower Bound (First Occurrence of Target or First Element ≥ Target)**

**Problem:** Find the **first index** where the element is **not less than** the target (i.e., `arr[i] >= target`).

#### **Approach**

- The target may not exist in the array.

- The answer is the first index where `arr[i] >= target`.

#### **Java Implementation**

```java
public int lowerBound(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    int result = arr.length; // Default if no element >= target

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return result;
}
```

#### **Python Implementation**

```python
def lower_bound(arr, target):
    left, right = 0, len(arr) - 1
    result = len(arr)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] >= target:
            result = mid
            right = mid - 1
        else:
            left = mid + 1
    return result
```

#### **Use Case**

- Finding the insertion point for a new element in a sorted array.

---

---

### **Pattern 3: Upper Bound (First Element > Target)**

**Problem:** Find the **first index** where the element is **greater than** the target.

#### **Approach**

- Similar to lower bound, but we look for `arr[i] > target`.

#### **Java Implementation**

```java
public int upperBound(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    int result = arr.length;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > target) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return result;
}
```

#### **Python Implementation**

```python
def upper_bound(arr, target):
    left, right = 0, len(arr) - 1
    result = len(arr)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] > target:
            result = mid
            right = mid - 1
        else:
            left = mid + 1
    return result
```

#### **Use Case**

- Finding the range of a target in a sorted array (e.g., `[lowerBound, upperBound)`).

---

---

### **Pattern 4: Finding First and Last Occurrence of a Target**

**Problem:** Find the **first and last occurrence** of a target in a sorted array with duplicates.

#### **Story**

Imagine you’re searching for a book in a **large library** with **multiple copies** of the same title. You want to find the **first and last shelf** where the book is placed.

#### **Approach**

- Use **lower bound** for the first occurrence.

- Use **upper bound - 1** for the last occurrence.

#### **Java Implementation**

```java
public int[] searchRange(int[] arr, int target) {
    int first = lowerBound(arr, target);
    int last = upperBound(arr, target) - 1;
    if (first == arr.length || arr[first] != target) {
        return new int[]{-1, -1};
    }
    return new int[]{first, last};
}
```

#### **Python Implementation**

```python
def search_range(arr, target):
    first = lower_bound(arr, target)
    last = upper_bound(arr, target) - 1
    if first == len(arr) or arr[first] != target:
        return [-1, -1]
    return [first, last]
```

#### **Complexity Analysis**

- **Time:** O(log n) for each bound.

- **Space:** O(1)

---

---

### **Pattern 5: Search in a Rotated Sorted Array**

**Problem:** Find the index of a target in a **rotated sorted array** (e.g., `[4,5,6,7,0,1,2]`).

#### **Story**

You’re searching for a friend in a **circular building** where the rooms are numbered in a rotated order. You need to figure out where to start searching.

#### **Approach**

1. Identify the **pivot** (the point where the rotation occurs).

2. Determine which half of the array is sorted.

3. Check if the target lies in the sorted half.

4. Adjust the search range accordingly.

#### **Java Implementation**

```java
public int searchRotatedArray(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        }
        // Left half is sorted
        if (arr[left] <= arr[mid]) {
            if (arr[left] <= target && target < arr[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (arr[mid] < target && target <= arr[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
```

#### **Python Implementation**

```python
def search_rotated_array(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        # Left half is sorted
        if arr[left] <= arr[mid]:
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
```

#### **Complexity Analysis**

- **Time:** O(log n)

- **Space:** O(1)

---

---

### **Pattern 6: Search in a 2D Matrix**

**Problem:** Search for a target value in a **2D matrix** where each row and column is sorted.

#### **Story**

You’re looking for a treasure in a **grid of islands**, where the islands are arranged in rows and columns. Each row and column is sorted in ascending order.

#### **Approach**

1. Start from the **top-right corner** (or bottom-left).

2. If the current element is equal to the target, return its position.

3. If the current element is greater than the target, move left.

4. If the current element is less than the target, move down.

#### **Java Implementation**

```java
public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0 || matrix[0].length == 0) return false;
    int rows = matrix.length;
    int cols = matrix[0].length;
    int row = 0, col = cols - 1;

    while (row < rows && col >= 0) {
        if (matrix[row][col] == target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--;
        } else {
            row++;
        }
    }
    return false;
}
```

#### **Python Implementation**

```python
def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    rows, cols = len(matrix), len(matrix[0])
    row, col = 0, cols - 1
    while row < rows and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    return False
```

#### **Complexity Analysis**

- **Time:** O(m + n), where m is the number of rows and n is the number of columns.

- **Space:** O(1)

---

---

### **Pattern 7: Finding a Peak Element**

**Problem:** Find a **peak element** in an array. A peak element is an element that is greater than or equal to its neighbors.

#### **Story**

You’re hiking in a **mountain range**. You want to find the highest peak where the elevation starts decreasing on both sides.

#### **Approach**

- Use binary search to find a peak.

- If the middle element is not a peak, move towards the side with the higher value.

#### **Java Implementation**

```java
public int findPeakElement(int[] arr) {
    int left = 0;
    int right = arr.length - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > arr[mid + 1]) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

#### **Python Implementation**

```python
def find_peak_element(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] > arr[mid + 1]:
            right = mid
        else:
            left = mid + 1
    return left
```

#### **Complexity Analysis**

- **Time:** O(log n)

- **Space:** O(1)

---

---

### **Pattern 8: Allocate Minimum Number of Pages**

**Problem:** Given an array of book pages and `m` students, allocate books such that the **maximum number of pages** assigned to a student is minimized.

#### **Approach**

- Use binary search on the **possible range** of page allocations.

- For each mid value, check if it’s possible to allocate books such that no student gets more than `mid` pages.

#### **Java Implementation**

```java
public int minPages(int[] pages, int m) {
    if (pages.length < m) return -1;
    int left = 0, right = 0;
    for (int page : pages) {
        left = Math.max(left, page);
        right += page;
    }
    int result = right;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (isPossible(pages, m, mid)) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return result;
}

private boolean isPossible(int[] pages, int m, int maxPages) {
    int students = 1;
    int currentPages = 0;
    for (int page : pages) {
        if (currentPages + page > maxPages) {
            students++;
            currentPages = page;
            if (students > m) return false;
        } else {
            currentPages += page;
        }
    }
    return true;
}
```

#### **Python Implementation**

```python
def min_pages(pages, m):
    if len(pages) < m:
        return -1
    left, right = max(pages), sum(pages)
    result = right

    def is_possible(max_pages):
        students = 1
        current_pages = 0
        for page in pages:
            if current_pages + page > max_pages:
                students += 1
                current_pages = page
                if students > m:
                    return False
            else:
                current_pages += page
        return True

    while left <= right:
        mid = left + (right - left) // 2
        if is_possible(mid):
            result = mid
            right = mid - 1
        else:
            left = mid + 1
    return result
```

#### **Complexity Analysis**

- **Time:** O(n log(sum(pages))) for binary search and allocation check.

- **Space:** O(1)

---

---

### **Pattern 9: Kth Smallest Element in a Sorted Matrix**

**Problem:** Find the **kth smallest element** in a **row-wise and column-wise sorted** matrix.

#### **Approach**

- Use binary search on the **value range** (from `matrix[0][0]` to `matrix[n-1][n-1]`).

- For each mid value, count how many elements are **less than or equal to** mid.

#### **Java Implementation**

```java
public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    int left = matrix[0][0];
    int right = matrix[n - 1][n - 1];

    while (left < right) {
        int mid = left + (right - left) / 2;
        int count = countLessEqual(matrix, mid);
        if (count < k) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

private int countLessEqual(int[][] matrix, int target) {
    int n = matrix.length;
    int row = n - 1, col = 0;
    int count = 0;
    while (row >= 0 && col < n) {
        if (matrix[row][col] <= target) {
            count += row + 1;
            col++;
        } else {
            row--;
        }
    }
    return count;
}
```

#### **Python Implementation**

```python
def kth_smallest(matrix, k):
    n = len(matrix)
    left, right = matrix[0][0], matrix[-1][-1]

    def count_less_equal(target):
        row, col = n - 1, 0
        count = 0
        while row >= 0 and col < n:
            if matrix[row][col] <= target:
                count += row + 1
                col += 1
            else:
                row -= 1
        return count

    while left < right:
        mid = left + (right - left) // 2
        count = count_less_equal(mid)
        if count < k:
            left = mid + 1
        else:
            right = mid
    return left
```

#### **Complexity Analysis**

- **Time:** O(n log(max - min))

- **Space:** O(1)

---

---

## **3. Tips and Tricks for Binary Search**

1. **Avoid Overflow:**
   
   Use `mid = left + (right - left) / 2` instead of `(left + right) / 2` to prevent integer overflow.

2. **Infinite Loop Prevention:**
   
   Ensure the loop condition is `left <= right` and update `left` and `right` correctly.

3. **Edge Cases:**
   
   Always handle cases where the target is not in the array, the array is empty, or all elements are the same.

4. **Practice with Variations:**
   
   Try implementing binary search on **descending arrays**, **searching for a range**, or **finding the insertion point**.

5. **Debugging:**
   
   Print the `left`, `right`, and `mid` values during debugging to understand the search flow.

6. **Real-world Analogies:**
   
   Use analogies like **searching in a dictionary**, **finding a floor in a building**, or **locating a book in a library** to understand the algorithm intuitively.

---

---

## **4. Interview Q&A: Binary Search Edition**

### **Conceptual Questions**

1. **Why is binary search efficient?**
   
   - It halves the search space in each iteration, leading to O(log n) time complexity.

2. **What are the prerequisites for binary search?**
   
   - The array must be **sorted** (ascending or descending).

3. **Can binary search be used on unsorted arrays?**
   
   - No, binary search relies on the sorted property of the array.

4. **What is the difference between lower bound and upper bound?**
   
   - **Lower bound:** First index where `arr[i] >= target`.
   
   - **Upper bound:** First index where `arr[i] > target`.

5. **How does binary search work in a rotated sorted array?**
   
   - Identify the sorted half and adjust the search range based on the target’s position relative to the sorted half.

---

### **Coding Questions**

1. **Implement binary search to find the first occurrence of a target.**
   
   *Solution:* Use the lower bound pattern.

2. **Find the smallest element in a rotated sorted array.**
   
   *Hint:* The smallest element is the pivot point.

3. **Count the number of occurrences of a target in a sorted array.**
   
   *Solution:* Use `searchRange` pattern.

4. **Find the kth smallest element in a sorted matrix.**
   
   *Solution:* Use binary search on the value range and count elements.

5. **Allocate books to students such that the maximum pages assigned is minimized.**
   
   *Solution:* Use binary search on the possible page ranges.
