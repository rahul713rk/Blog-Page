---
title: "Common Patterns for 1-D Dynamic Programming: A Structured Approach"
description: "Master 1-D Dynamic Programming with common patterns like Fibonacci, Climbing Stairs, House Robber, and Coin Change."
date: 2026-03-20
author: Rahul Kumar
tags: [DSA, Dynamic Programming, DP, 1-D DP, Algorithms]
category: "DSA"
cover: ""
readingTime: "12 min read"
draft: false
slug: "1d-dp-patterns"
---

# Common Patterns for 1-D Dynamic Programming: A Structured Approach to Solving DSA Problems


---

## 🚀 Introduction

Dynamic Programming (DP) is a powerful technique for solving complex problems by breaking them down into simpler subproblems. **1-D DP** problems are among the most common in coding interviews and competitive programming. These problems typically involve making decisions at each step, where the solution depends on the results of previous steps.

### **Why 1-D DP Matters**

- **Efficiency**: Converts exponential-time brute-force solutions into polynomial-time algorithms.

- **Interview Relevance**: Frequently appears in coding rounds at top tech companies (e.g., FAANG).

- **Foundation**: Serves as a building block for 2-D and 3-D DP problems.

### **What This Blog Covers**

This blog outlines **common patterns** in 1-D DP, providing a structured approach to recognize, solve, and optimize such problems. We’ll explore:

- **Brute-force vs. Optimized Approaches**

- **Key Patterns** (e.g., Fibonacci, Climbing Stairs, House Robber)

- **Problem-Solving Framework**

- **Edge Cases and Pitfalls**

- **Interview Q&A**

---

---

## 🧠 1. Pattern: Fibonacci Sequence

### **Problem Statement**

Compute the nth Fibonacci number, where:

```
F(0) = 0, F(1) = 1
F(n) = F(n-1) + F(n-2) for n > 1
```

### **Intuition Building**

Imagine climbing a staircase with `n` steps. You can take either **1 or 2 steps** at a time. The number of ways to reach the nth step is the nth Fibonacci number.

### **Brute Force Approach**

**Approach**: Recursively compute Fibonacci numbers.  
**Code**:

```python
def fib_brute(n):
    if n <= 1:
        return n
    return fib_brute(n-1) + fib_brute(n-2)
```

```java
public int fibBrute(int n) {
    if (n <= 1) return n;
    return fibBrute(n-1) + fibBrute(n-2);
}
```

**Complexity Analysis**:

- **Time**: O(2^n) (exponential)

- **Space**: O(n) (recursion stack)

**Limitations**:

- Repeated calculations for the same subproblems (e.g., `fib(2)` is computed multiple times).

---

### **Optimized Approach: Memoization**

**Idea**: Store computed results to avoid redundant calculations.

**Code**:

```python
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
```

```java
public int fibMemo(int n) {
    int[] memo = new int[n+1];
    return fibMemoHelper(n, memo);
}

private int fibMemoHelper(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = fibMemoHelper(n-1, memo) + fibMemoHelper(n-2, memo);
    return memo[n];
}
```

**Dry Run**:  
For `n = 4`:

- `fibMemo(4)` → `fibMemo(3) + fibMemo(2)`

- `fibMemo(3)` → `fibMemo(2) + fibMemo(1)`

- `fibMemo(2)` → `fibMemo(1) + fibMemo(0)`

- Uses memoization to avoid recalculating `fib(2)` and `fib(1)`.

**Complexity Analysis**:

- **Time**: O(n)

- **Space**: O(n)

---

### **Optimized Approach: Tabulation (Iterative DP)**

**Idea**: Fill a table iteratively from the bottom up.

**Code**:

```python
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n+1)
    dp[1] = 1
    for i in range(2, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```java
public int fibTab(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n+1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

**Dry Run**:  
For `n = 4`:

- `dp = [0, 1, 1, 2, 3]`

- Returns `dp[4] = 3`.

**Complexity Analysis**:

- **Time**: O(n)

- **Space**: O(n) (can be optimized to O(1) by storing only the last two values)

---

---

## 🪜 2. Pattern: Climbing Stairs

### **Problem Statement**

You are climbing a staircase with `n` steps. Each time, you can take either **1 or 2 steps**. How many distinct ways can you reach the top?

### **Intuition**

This is identical to the Fibonacci problem! The number of ways to reach step `n` is the sum of ways to reach step `n-1` and `n-2`.

### **Brute Force Approach**

```python
def climb_brute(n):
    if n <= 2:
        return n
    return climb_brute(n-1) + climb_brute(n-2)
```

```java
public int climbBrute(int n) {
    if (n <= 2) return n;
    return climbBrute(n-1) + climbBrute(n-2);
}
```

**Complexity**: O(2^n) (exponential).

---

### **Optimized Approach**

Use memoization or tabulation as shown in the Fibonacci pattern.

---

---

## 🏠 3. Pattern: House Robber

### **Problem Statement**

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses cannot be robbed. What is the maximum amount you can rob?

### **Intuition**

At each house, you have two choices:

1. Rob the current house and skip the previous one.

2. Skip the current house and keep the money from the previous one.

The solution is the maximum of these two choices.

### **Brute Force Approach**

**Approach**: Explore all combinations recursively.

**Code**:

```python
def rob_brute(nums):
    def helper(i):
        if i < 0:
            return 0
        return max(nums[i] + helper(i-2), helper(i-1))
    return helper(len(nums)-1)
```

```java
public int robBrute(int[] nums) {
    return helper(nums, nums.length - 1);
}

private int helper(int[] nums, int i) {
    if (i < 0) return 0;
    return Math.max(nums[i] + helper(nums, i-2), helper(nums, i-1));
}
```

**Complexity**: O(2^n).

---

### **Optimized Approach: Memoization**

**Code**:

```python
def rob_memo(nums):
    memo = {}
    def helper(i):
        if i in memo:
            return memo[i]
        if i < 0:
            return 0
        memo[i] = max(nums[i] + helper(i-2), helper(i-1))
        return memo[i]
    return helper(len(nums)-1)
```

```java
public int robMemo(int[] nums) {
    int[] memo = new int[nums.length];
    return helper(nums, nums.length - 1, memo);
}

private int helper(int[] nums, int i, int[] memo) {
    if (i < 0) return 0;
    if (memo[i] != 0) return memo[i];
    memo[i] = Math.max(nums[i] + helper(nums, i-2, memo), helper(nums, i-1, memo));
    return memo[i];
}
```

**Complexity**:

- **Time**: O(n)

- **Space**: O(n)

---

### **Optimized Approach: Tabulation**

**Code**:

```python
def rob_tab(nums):
    if not nums:
        return 0
    dp = [0] * len(nums)
    dp[0] = nums[0]
    for i in range(1, len(nums)):
        dp[i] = max(nums[i] + (dp[i-2] if i-2 >= 0 else 0), dp[i-1])
    return dp[-1]
```

```java
public int robTab(int[] nums) {
    if (nums.length == 0) return 0;
    int[] dp = new int[nums.length];
    dp[0] = nums[0];
    for (int i = 1; i < nums.length; i++) {
        dp[i] = Math.max(nums[i] + (i-2 >= 0 ? dp[i-2] : 0), dp[i-1]);
    }
    return dp[nums.length-1];
}
```

**Complexity**:

- **Time**: O(n)

- **Space**: O(n) (can be O(1))

---

---

## 💰 4. Pattern: Coin Change

### **Problem Statement**

Given coins of different denominations, find the number of ways to make up a given amount.

### **Intuition**

For each coin, decide whether to include it or not. The total ways for amount `n` is the sum of ways for `n - coin` for all coins.

### **Brute Force Approach**

```python
def coin_change_brute(coins, amount):
    if amount == 0:
        return 1
    if amount < 0:
        return 0
    total = 0
    for coin in coins:
        total += coin_change_brute(coins, amount - coin)
    return total
```

**Complexity**: O(c^n) (exponential).

---

### **Optimized Approach: Memoization**

**Code**:

```python
def coin_change_memo(coins, amount, memo={}):
    if amount in memo:
        return memo[amount]
    if amount == 0:
        return 1
    if amount < 0:
        return 0
    memo[amount] = 0
    for coin in coins:
        memo[amount] += coin_change_memo(coins, amount - coin, memo)
    return memo[amount]
```

**Complexity**:

- **Time**: O(n * c)

- **Space**: O(n)

---

### **Optimized Approach: Tabulation**

**Code**:

```python
def coin_change_tab(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]
```

**Complexity**:

- **Time**: O(n * c)

- **Space**: O(n)

---

---

## 🛠️ How to Think About 1-D DP Problems

### **Step-by-Step Framework**

1. **Identify the Subproblem**:
   
   - What is the smallest unit of work? (e.g., `fib(n)` depends on `fib(n-1)` and `fib(n-2)`).

2. **Define the State**:
   
   - What variables define the current state? (e.g., `n` for Fibonacci, `amount` for Coin Change).

3. **Formulate the Recurrence**:
   
   - How does the current state relate to previous states?
   
   - Example: `dp[i] = dp[i-1] + dp[i-2]` for Fibonacci.

4. **Base Case**:
   
   - What is the simplest case you can solve directly? (e.g., `dp[0] = 0`, `dp[1] = 1` for Fibonacci).

5. **Choose Optimization**:
   
   - Memoization (top-down) or tabulation (bottom-up)?

6. **Edge Cases**:
   
   - Empty input, negative values, or constraints.

7. **Iterate and Validate**:
   
   - Test with small inputs and edge cases.

---

---

## 🔗 Patterns and Connections

|              |                                           |                                    |
| ------------ | ----------------------------------------- | ---------------------------------- |
| **Pattern**  | **Recurrence Relation**                   | **Use Case**                       |
| Fibonacci    | `dp[i] = dp[i-1] + dp[i-2]`               | Counting sequences, stair climbing |
| House Robber | `dp[i] = max(nums[i] + dp[i-2], dp[i-1])` | Maximizing profit with constraints |
| Coin Change  | `dp[i] += dp[i - coin]`                   | Counting combinations              |
| Min/Max Path | `dp[i] = min/max(dp[i], dp[i-1] + cost)`  | Path optimization                  |

---

---

## ⚠️ Edge Cases and Pitfalls

### **Common Edge Cases**

1. **Zero or Negative Inputs**:
   
   - Example: `n = 0` for Fibonacci, `amount = 0` for Coin Change.

2. **Single Element**:
   
   - Example: `nums = [1]` for House Robber.

3. **Large Inputs**:
   
   - Stack overflow for recursion (use iteration).
   
   - Integer overflow (use `long` in Java).

4. **Constraints**:
   
   - Example: Adjacent houses cannot be robbed (House Robber).

### **Pitfalls**

- **Incorrect Base Case**: Forgetting to handle `n = 0` or `n = 1`.

- **State Definition**: Misidentifying the state (e.g., using `dp[i][j]` for 1-D problems).

- **Optimization Overhead**: Memoization may not always be faster than tabulation for small inputs.

- **Overcounting**: In Coin Change, ensure coins are not reused unless allowed.

---

---

## 💡 Tips and Tricks

1. **Start with Recursion**: Write the brute-force solution first to understand the recurrence.

2. **Visualize the DP Table**: Draw a table for small inputs to spot patterns.

3. **Space Optimization**: Use variables instead of arrays when only the last few states are needed (e.g., Fibonacci can be O(1) space).

4. **Practice Patterns**: Master Fibonacci, House Robber, and Coin Change first—they appear in many variations.

5. **Check Constraints**: Always verify if the problem allows reusing elements (e.g., Coin Change with unlimited supply vs. limited).

---

---

## ❓ Interview Q&A: 1-D DP Edition

### **Conceptual Questions**

1. **What is the difference between memoization and tabulation?**
   
   - **Memoization**: Top-down, recursive, lazy evaluation (computes only what’s needed).
   
   - **Tabulation**: Bottom-up, iterative, computes all states upfront.

2. **When should you use DP over recursion?**
   
   - When the problem has **overlapping subproblems** and **optimal substructure**.

3. **How do you identify a 1-D DP problem?**
   
   - The solution depends on a **single variable** (e.g., `n`, `amount`).

### **Edge-Case Questions**

1. **How would you handle an empty array in House Robber?**
   
   - Return `0` (no houses to rob).

2. **What if the amount is negative in Coin Change?**
   
   - Return `0` (invalid amount).

3. **How do you handle very large `n` in Fibonacci?**
   
   - Use **iterative DP** to avoid stack overflow and modulo arithmetic to prevent integer overflow.

### **Follow-Up Questions**

1. **Can you solve House Robber with O(1) space?**
   
   - Yes! Track only the last two values instead of the entire array.

2. **How would you modify Coin Change to return the actual coins used?**
   
   - Store the coin used for each `dp[i]` and backtrack to reconstruct the solution.

### **Trade-Off Discussions**

- **Memoization vs. Tabulation**:
  
  - Memoization is easier to write but may have higher constant factors.
  
  - Tabulation is more efficient but requires careful state management.

---

---

## 🔬 Advanced Insights

### **1. State Compression**

For problems like Fibonacci, you don’t need to store the entire DP array. Use variables to store only the necessary states:

```python
def fib_optimized(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b
```

### **2. Multi-Dimensional DP**

1-D DP often transitions to 2-D DP when decisions depend on two variables (e.g., `dp[i][j]`). Example: Edit Distance.

### **3. Greedy vs. DP**

- **Greedy**: Makes locally optimal choices (e.g., Coin Change with coins `[1, 5, 10, 25]`).

- **DP**: Considers all possibilities (e.g., Coin Change with arbitrary denominations).

### **4. Mathematical Optimization**

For Fibonacci, use **matrix exponentiation** or **Binet’s formula** for O(log n) time.

---

---

## 📝 Summary

|                     |                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Concept**         | **Key Takeaway**                                                                           |
| **Fibonacci**       | Classic 1-D DP problem; use memoization or tabulation.                                     |
| **Climbing Stairs** | Identical to Fibonacci; apply the same patterns.                                           |
| **House Robber**    | Decide at each step: rob or skip; recurrence is `dp[i] = max(nums[i] + dp[i-2], dp[i-1])`. |
| **Coin Change**     | Count combinations using `dp[i] += dp[i - coin]`; space-optimized with O(n).               |
| **Problem-Solving** | Recognize patterns, define states, and optimize with memoization or tabulation.            |
| **Edge Cases**      | Always test zero, negative, and boundary inputs.                                           |
| **Interview Prep**  | Practice Fibonacci, House Robber, and Coin Change; understand trade-offs.                  |

---

### **Final Thoughts**

1-D DP problems are about **recognizing patterns** and **applying systematic optimization**. Start by writing the brute-force solution, then optimize with memoization or tabulation. With practice, you’ll develop an intuition for spotting these patterns in interviews and coding challenges.

**Next Steps**:

- Solve problems on [LeetCode](https://leetcode.com/) (e.g., 70. Climbing Stairs, 198. House Robber, 322. Coin Change).

- Experiment with edge cases and space optimizations.

- Explore 2-D DP problems to build on these patterns.
