---
title: "Complete Guide to Bit Manipulation for DSA & Interviews"
description: "Master high-ROI bit manipulation techniques for coding interviews. Learn core bitwise operators, bit masking, and essential tricks like removing the lowest set bit."
date: 2026-03-25
author: Rahul Kumar
tags: [DSA, Bit Manipulation, Algorithms, Interviews]
category: "DSA"
cover: "/assets/images/posts/bit-manipulation-cover.png"
readingTime: "10 min read"
draft: false
slug: "bit-manipulation-guide"
---

# Complete Guide to Bit Manipulation for DSA & Interviews

Bit manipulation is one of the highest ROI topics in coding interviews. It appears in arrays, math, dynamic programming, and more. Strong bit manipulation skills help write faster solutions and recognize hidden patterns.

---

## Introduction

A brief overview of why bit manipulation is crucial for performance and advanced algorithms.

---

## Binary Basics

Computers store everything in binary (0 and 1).

Example:

| Decimal | Binary |
| ------- | ------ |
| 0       | 0000   |
| 1       | 0001   |
| 2       | 0010   |
| 3       | 0011   |
| 4       | 0100   |
| 5       | 0101   |
| 6       | 0110   |
| 7       | 0111   |
| 8       | 1000   |

Each position represents a power of 2.

Example:

```text
13 = 1101

= 1*8 + 1*4 + 0*2 + 1*1
= 13
```

---

---

## Important Terminology

| Term      | Meaning                           |
| --------- | --------------------------------- |
| Bit       | Single binary digit               |
| LSB       | Least Significant Bit (rightmost) |
| MSB       | Most Significant Bit (leftmost)   |
| Set Bit   | Bit = 1                           |
| Unset Bit | Bit = 0                           |

---

---

## Core Bitwise Operators

These are the foundation of everything.

---

### AND (&)

Rule:

```text
1 & 1 = 1
otherwise = 0
```

Example:

```text
5  = 0101
3  = 0011
-------------
&  = 0001 = 1
```

#### Java

```java
int a = 5;
int b = 3;

System.out.println(a & b); // 1
```

#### Python

```python
a = 5
b = 3

print(a & b)  # 1
```

## Uses

- Check if bit is set

- Masking

- Extracting bits

---

### OR (|)

Rule:

```text
0 | 0 = 0
otherwise = 1
```

Example:

```text
5 = 0101
3 = 0011
-----------
| = 0111 = 7
```

#### Java

```java
System.out.println(5 | 3); // 7
```

#### Python

```python
print(5 | 3)  # 7
```

## Uses

- Turn ON bits

- Merge bit masks

---

### XOR (^)

Rule:

```text
same bits -> 0
different bits -> 1
```

Example:

```text
5 = 0101
3 = 0011
-----------
^ = 0110 = 6
```

#### Java

```java
System.out.println(5 ^ 3); // 6
```

#### Python

```python
print(5 ^ 3)  # 6
```

---

## Extremely Important XOR Properties

```text
a ^ a = 0
a ^ 0 = a
a ^ b ^ a = b
```

These properties power many interview problems.

---

### NOT (~)

Flips all bits.

Example:

```text
~5
5 = 00000101

~ = 11111010
```

## Important Concept: Two's Complement

In most systems:

- Negative numbers use two’s complement representation.

Formula:

```text
~x = -(x + 1)
```

Example:

```text
~5 = -6
```

#### Java

```java
System.out.println(~5); // -6
```

#### Python

```python
print(~5)  # -6
```

---

### Left Shift (<<)

Shifts bits left.

```text
x << n = x * (2^n)
```

Example:

```text
5 = 0101

5 << 1 = 1010 = 10
5 << 2 = 10100 = 20
```

#### Java

```java
System.out.println(5 << 1); // 10
```

#### Python

```python
print(5 << 1)  # 10
```

---

### Right Shift (>>)

Shifts bits right.

```text
x >> n = x / (2^n)
```

Example:

```text
20 = 10100

20 >> 1 = 1010 = 10
20 >> 2 = 101 = 5
```

#### Java

```java
System.out.println(20 >> 2); // 5
```

#### Python

```python
print(20 >> 2)  # 5
```

---

### Unsigned Right Shift (>>>)

The Unsigned Right Shift operator (only available in Java and some other languages) moves bits right and always fills the leftmost empty spots with **zeros**, regardless of whether the original number was positive or negative.

This treats the number as a raw bit pattern rather than a mathematical quantity.

#### Java Example
```java
System.out.println(-8 >> 1);  // Output: -4 (Sign preserved)
System.out.println(-8 >>> 1); // Output: 2147483644 (Sign bit becomes 0, huge positive number)
```

> [!IMPORTANT]
> Python does not have a `>>>` operator because Python integers have arbitrary precision (they don't have a fixed bit-width like 32-bit `int` in Java).

---

---

## Bit Masking Fundamentals

Bit masking means using bits as flags.

Example:

```text
101101
```

Each bit can represent:

- ON/OFF

- Present/Absent

- True/False

---

---

## Important Operations on Bits

These are MUST KNOW interview operations.

---

### Check if ith Bit is Set

Formula:

```text
(number & (1 << i)) != 0
```

Example:  
Check if 2nd bit of 5 is set.

```text
5 = 0101

1 << 2 = 0100

0101 & 0100 = 0100
```

YES.

#### Java

```java
int num = 5;
int i = 2;

boolean isSet = (num & (1 << i)) != 0;
System.out.println(isSet);
```

#### Python

```python
num = 5
i = 2

is_set = (num & (1 << i)) != 0
print(is_set)
```

---

# 5.2 Set ith Bit

Formula:

```text
number | (1 << i)
```

## Example

Set 1st bit in 5.

```text
5 = 0101

1 << 1 = 0010

0101 | 0010 = 0111 = 7
```

#### Java

```java
int result = 5 | (1 << 1);
System.out.println(result); // 7
```

#### Python

```python
result = 5 | (1 << 1)
print(result)
```

---

# 5.3 Unset ith Bit

Formula:

```text
number & ~(1 << i)
```

#### Java

```java
int result = 7 & ~(1 << 1);
System.out.println(result); // 5
```

#### Python

```python
result = 7 & ~(1 << 1)
print(result)
```

---

# 5.4 Toggle ith Bit

Formula:

```text
number ^ (1 << i)
```

#### Java

```java
int result = 5 ^ (1 << 1);
System.out.println(result); // 7
```

#### Python

```python
result = 5 ^ (1 << 1)
print(result)
```

---

# 5.5 Remove Lowest Set Bit

One of the MOST IMPORTANT tricks.

Formula:

```text
x & (x - 1)
```

Example:

```text
12 = 1100

11 = 1011

1100 & 1011 = 1000
```

Lowest set bit removed.

---

## Why This Matters

Used in:

- Counting set bits

- Power of two

- Subset generation

- Fenwick tree

- Advanced optimizations

---

# 5.6 Extract Lowest Set Bit

Formula:

```text
x & (-x)
```

Example:

```text
12 = 1100

-12 = 0100 (two's complement effect)

1100 & 0100 = 0100
```

Result = lowest set bit.

---

# 6. Count Set Bits (Population Count)

Extremely common interview topic.

---

# Method 1: Naive

#### Java

```java
int countBits(int n) {
    int count = 0;

    while (n > 0) {
        count += (n & 1);
        n >>= 1;
    }

    return count;
}
```

#### Python

```python
def count_bits(n):
    count = 0

    while n > 0:
        count += (n & 1)
        n >>= 1

    return count
```

Time Complexity:

```text
O(number of bits)
```

---

# Method 2: Brian Kernighan Algorithm

VERY IMPORTANT FOR INTERVIEWS.

Idea:  
Every operation removes one set bit.

Formula:

```text
n = n & (n - 1)
```

#### Java

```java
int countBits(int n) {
    int count = 0;

    while (n > 0) {
        n = n & (n - 1);
        count++;
    }

    return count;
}
```

#### Python

```python
def count_bits(n):
    count = 0

    while n:
        n = n & (n - 1)
        count += 1

    return count
```

Complexity:

```text
O(number of set bits)
```

Very efficient.

---

# 7. Check Power of Two

MOST ASKED BIT QUESTION.

Observation:  
Power of two has exactly ONE set bit.

Examples:

```text
8  = 1000
16 = 10000
```

Formula:

```text
n > 0 && (n & (n - 1)) == 0
```

#### Java

```java
boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}
```

#### Python

```python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
```

---

# 8. XOR Based Interview Problems

These are SUPER IMPORTANT.

---

# 8.1 Find Unique Element

Problem:  
Every element appears twice except one.

Example:

```text
[2, 3, 2, 4, 4]
```

Answer = 3

Why XOR works:

```text
2 ^ 2 = 0
4 ^ 4 = 0
0 ^ 3 = 3
```

#### Java

```java
int singleNumber(int[] nums) {
    int ans = 0;

    for (int num : nums) {
        ans ^= num;
    }

    return ans;
}
```

#### Python

```python
def single_number(nums):
    ans = 0

    for num in nums:
        ans ^= num

    return ans
```

---

# 8.2 Swap Without Extra Variable

Classic question.

#### Java

```java
int a = 5;
int b = 7;

a = a ^ b;
b = a ^ b;
a = a ^ b;
```

#### Python

```python
a = 5
b = 7

a = a ^ b
b = a ^ b
a = a ^ b
```

Interview Note:

- Modern compilers optimize temp-variable swaps well.

- Mostly educational today.

---

---

## Generate All Subsets Using Bits

VERY IMPORTANT FOR DSA.

If array size = n:

- total subsets = `2^n`

Each number from:

```text
0 to (2^n - 1)
```

represents a subset.

---

## Example

Array:

```text
[a, b, c]
```

Binary mask:

```text
000 -> {}
001 -> {a}
010 -> {b}
011 -> {a,b}
100 -> {c}
```

---

#### Java

```java
void generateSubsets(int[] arr) {
    int n = arr.length;

    for (int mask = 0; mask < (1 << n); mask++) {

        for (int i = 0; i < n; i++) {

            if ((mask & (1 << i)) != 0) {
                System.out.print(arr[i] + " ");
            }
        }

        System.out.println();
    }
}
```

---

#### Python

```python
def generate_subsets(arr):
    n = len(arr)

    for mask in range(1 << n):

        subset = []

        for i in range(n):

            if mask & (1 << i):
                subset.append(arr[i])

        print(subset)
```

---

---

## Advanced Bit Tricks

These separate strong candidates from average ones.

---

### Check Odd or Even

Last bit determines parity.

```text
odd  -> last bit = 1
even -> last bit = 0
```

#### Java

```java
boolean isOdd(int n) {
    return (n & 1) == 1;
}
```

#### Python

```python
def is_odd(n):
    return (n & 1) == 1
```

---

### Multiply by 2

```text
x << 1
```

---

### Divide by 2

```text
x >> 1
```

---

### Check if Number is Multiple of 2^k

Example:  
Multiple of 8 (`2^3`)

Formula:

```text
(n & (8 - 1)) == 0
```

General:

```text
(n & ((1 << k) - 1)) == 0
```

---

### Count Total Bits Required

#### Java

```java
int bits = Integer.toBinaryString(n).length();
```

Better:

```java
int bits = 32 - Integer.numberOfLeadingZeros(n);
```

#### Python

```python
bits = n.bit_length()
```

---

### Fast Exponentiation

Important in:

- Binary exponentiation

- Modular arithmetic

- Competitive programming

Idea:  
Use binary representation of exponent.

---

#### Java

```java
long power(long a, long b) {

    long result = 1;

    while (b > 0) {

        if ((b & 1) == 1) {
            result *= a;
        }

        a *= a;
        b >>= 1;
    }

    return result;
}
```

---

#### Python

```python
def power(a, b):

    result = 1

    while b > 0:

        if b & 1:
            result *= a

        a *= a
        b >>= 1

    return result
```

Complexity:

```text
O(log b)
```

---

---

## Two's Complement Deep Dive

Very important for advanced interviews.

Negative numbers are stored using:

- Two’s complement

Formula:

```text
-x = ~x + 1
```

Example:

```text
5  = 00000101
~5 = 11111010
+1 = 11111011 = -5
```

---

---

## Signed vs Unsigned Issues

Important in Java/C++.

#### Java Types

```java
byte   = 8 bits
short  = 16 bits
int    = 32 bits
long   = 64 bits
```

---

---

## Important Built-in Functions

---

# Java

## Count Set Bits

```java
Integer.bitCount(n)
```

## Leading Zeros

```java
Integer.numberOfLeadingZeros(n)
```

## Highest One Bit

```java
Integer.highestOneBit(n)
```

## Lowest One Bit

```java
Integer.lowestOneBit(n)
```

---

# Python

## Count Set Bits

```python
n.bit_count()
```

## Binary Representation

```python
bin(n)
```

---

---

## Bit Manipulation Patterns in Interviews

These are EXTREMELY IMPORTANT.

---

# Pattern 1: XOR Cancellation

Used in:

- Single number

- Missing number

- Duplicate number

---

# Pattern 2: Bit Masking

Used in:

- Subsets

- State compression DP

- Permissions

- Flags

---

# Pattern 3: Power of Two

Used in:

- Segment tree

- Heap sizes

- Memory alignment

---

# Pattern 4: Remove Lowest Set Bit

Used in:

- Counting bits

- Optimization

- Fenwick tree

---

# Pattern 5: Trie + Bits

Used in:

- Maximum XOR pair

- XOR queries

---

# Pattern 6: Bit DP (Advanced)

State compression.

Example:

- Traveling Salesman Problem

- Assignment problems

---

---

## Advanced Interview Topics

For senior interviews and competitive programming.

---

# 15.1 Gray Code

Only one bit changes between adjacent numbers.

Formula:

```text
gray = n ^ (n >> 1)
```

---

# 15.2 Bitset Optimization

Used in:

- Competitive programming

- Large boolean arrays

- Graph optimizations

---

# 15.3 State Compression DP

Represent states using bits.

Example:

```text
mask = 1011
```

Represents:

- city1 visited

- city2 visited

- city4 visited

Core technique in:

- TSP

- Hamiltonian paths

---

# 15.4 Maximum XOR Problems

Common hard interview topic.

Usually solved using:

- Bit Trie

---

---

## Common Interview Problems

Must practice these.

---

# Beginner

1. Check odd/even

2. Count set bits

3. Power of two

4. Single number

5. Reverse bits

---

# Intermediate

1. Missing number

2. Subsets

3. Two unique numbers

4. Bitwise AND range

5. Counting bits DP

---

# Advanced

1. Maximum XOR pair

2. Trie XOR problems

3. Bitmask DP

4. TSP

5. SOS DP

---

---

## Common Mistakes

---

# Mistake 1: Operator Precedence

Wrong:

```java
if (n & 1 == 1)
```

Correct:

```java
if ((n & 1) == 1)
```

---

# Mistake 2: Overflow

```java
1 << 31
```

Can become negative.

Use:

```java
1L << 31
```

---

# Mistake 3: Negative Numbers in Right Shift

Understand:

- arithmetic shift

- logical shift

---

---

## Mental Models for Experts

These improve problem solving.

---

# Think in Terms of Information

Bits represent compressed information.

Example:

- boolean array → integer mask

---

# Think About Bit Independence

Many problems become easier when each bit is processed independently.

Example:

- XOR sum problems

- AND range problems

---

# Think in Powers of Two

Many hidden patterns involve:

- parity

- ranges

- powers of two

---

---

## Interview Tricks Cheat Sheet

Memorize these.

| Trick              | Meaning                |
| ------------------ | ---------------------- |
| `x & 1`            | odd/even               |
| `x & (x-1)`        | remove lowest set bit  |
| `x & -x`           | extract lowest set bit |
| `(x & (x-1)) == 0` | power of two           |
| `x ^ x = 0`        | XOR cancel             |
| `x << k`           | multiply by 2^k        |
| `x >> k`           | divide by 2^k          |

---

---

## Best Problems to Practice

On platforms like:

- [LeetCode](https://leetcode.com/?utm_source=chatgpt.com)

- [Codeforces](https://codeforces.com/?utm_source=chatgpt.com)

- [AtCoder](https://atcoder.jp/?utm_source=chatgpt.com)

- [GeeksforGeeks](https://www.geeksforgeeks.org/?utm_source=chatgpt.com)

Practice these topics:

| Topic                | Importance |
| -------------------- | ---------- |
| XOR problems         | VERY HIGH  |
| Bitmask subsets      | VERY HIGH  |
| Counting bits        | HIGH       |
| Trie XOR             | HIGH       |
| State compression DP | VERY HIGH  |
| Gray code            | MEDIUM     |
| Bitset optimization  | ADVANCED   |

---

---

## Recommended Learning Order

## Phase 1 — Fundamentals

- Binary

- AND OR XOR

- Shift operators

- Set/unset/toggle bits

---

## Phase 2 — Interview Core

- Count bits

- Power of two

- XOR tricks

- Subset generation

---

## Phase 3 — Intermediate

- Range bitwise problems

- Missing/single numbers

- Bitmasking

---

## Phase 4 — Advanced

- Trie XOR

- Bit DP

- State compression

- SOS DP

---

---

## Final Interview Advice

During interviews:

1. Always write binary examples on paper.

2. Track one bit at a time.

3. Use XOR properties aggressively.

4. Watch precedence carefully.

5. Practice masks until intuitive.

6. Learn to recognize:
   
   - powers of two
   
   - parity
   
   - subset representation

7. Master:
   
   - `x & (x-1)`
   
   - `x & -x`
   
   - XOR cancellation

These alone solve many problems.

---

---

## Most Important Concepts for DSA Interviews

If time is limited, prioritize THESE:

## MUST MASTER

- XOR properties

- Count set bits

- Power of two

- Bit masking

- Subset generation

- `x & (x-1)`

- `x & -x`

## HIGH VALUE

- Binary exponentiation

- Trie XOR

- Bit DP

- State compression

## EXPERT LEVEL

- SOS DP

- Bitset optimization

- Gray code

- Advanced XOR mathematics

---

---

## Final Cheat Sheet

```text
Check odd:
x & 1

Check power of 2:
x > 0 && (x & (x-1)) == 0

Remove lowest set bit:
x & (x-1)

Extract lowest set bit:
x & (-x)

Set ith bit:
x | (1 << i)

Unset ith bit:
x & ~(1 << i)

Toggle ith bit:
x ^ (1 << i)

Check ith bit:
(x & (1 << i)) != 0

Multiply by 2:
x << 1

Divide by 2:
x >> 1
```

---

# Final Recommendation

For interview preparation:

## Practice Order

1. Easy XOR problems

2. Bit masking basics

3. Subset generation

4. Counting bits

5. Trie XOR problems

6. Bitmask DP

# 
