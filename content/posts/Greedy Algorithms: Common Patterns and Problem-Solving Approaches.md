---
title: "Greedy Algorithms: Common Patterns and Problem-Solving Approaches"
description: "Master greedy algorithms with common patterns like Activity Selection, Fractional Knapsack, and Job Sequencing."
date: 2026-03-25
author: Rahul Kumar
tags: [DSA, Greedy Algorithms, Algorithms, Competitive Programming]
category: "DSA"
cover: ""
readingTime: "15 min read"
draft: false
slug: "greedy-algorithm-patterns"
---

# Greedy Algorithms: Common Patterns and Problem-Solving Approaches


---

## 🚀 Introduction: Why Greedy Algorithms?

Greedy algorithms are a class of algorithms that make locally optimal choices at each step with the hope of finding a globally optimal solution. They are **simple, intuitive, and efficient** for many problems, especially in competitive programming and technical interviews. However, not all problems can be solved greedily—it requires a **specific structure** where local optimality leads to global optimality.

### **When to Use Greedy Algorithms?**

- The problem has an **optimal substructure** (optimal solution contains optimal solutions to subproblems).

- The problem can be **solved by making a sequence of choices**, each of which looks best at the moment.

- The problem is **not NP-hard** (greedy algorithms typically solve problems in polynomial time).

### **Why This Blog?**

This blog will:

1. Break down **common patterns** in greedy algorithms.

2. Provide a **step-by-step framework** to approach greedy problems.

3. Offer **Java and Python implementations** for each pattern.

4. Highlight **edge cases, pitfalls, and interview questions**.

---

---

## 💡 Intuition Building: The "Shortest Job First" Analogy

Imagine you are a **scheduling manager** in a factory. You have multiple tasks to assign to workers, but each task takes a different amount of time. To maximize efficiency, you would always pick the **shortest task first**—this way, all tasks are completed as quickly as possible.

- **Greedy Choice:** Always pick the task with the shortest duration.

- **Global Optimality:** This ensures the **minimum total completion time** for all tasks.

This is the essence of greedy algorithms: **make the locally optimal choice at each step to achieve a globally optimal solution**.

---

---

## 🐢 Brute Force Approach: Exhaustive Search

### **Problem Statement: Activity Selection Problem**

Given a set of activities with start and finish times, select the **maximum number of non-overlapping activities** that can be performed by a single person.

### **Brute Force Approach**

1. **Generate all possible subsets** of activities.

2. **Check for overlaps** in each subset.

3. **Count the maximum number of non-overlapping activities**.

#### **Pseudocode**

```plaintext
for each subset of activities:
    if no two activities overlap:
        count = max(count, size of subset)
return count
```

### **Limitations**

- **Exponential time complexity** (O(2^n)).

- **Not feasible** for large inputs.

### **Time & Space Complexity**

|        |        |
| ------ | ------ |
| Metric | Value  |
| Time   | O(2^n) |
| Space  | O(n)   |

---

---

## ⚡ Optimized Approach: Greedy Algorithm

### **Step-by-Step Reasoning**

1. **Sort activities by finish time** (earliest first).

2. **Select the first activity** (earliest finish time).

3. **Skip all activities that overlap** with the selected one.

4. **Repeat** until all activities are processed.

### **Why Does This Work?**

- Sorting ensures we always pick the **earliest finishing activity**, leaving more room for other activities.

- This **greedy choice** leads to a **globally optimal solution**.

### **Dry Run**

|          |       |        |           |
| -------- | ----- | ------ | --------- |
| Activity | Start | Finish | Selected? |
| A1       | 1     | 4      | Yes       |
| A2       | 3     | 5      | No        |
| A3       | 0     | 6      | No        |
| A4       | 5     | 7      | Yes       |
| A5       | 8     | 9      | Yes       |

**Result:** Activities A1, A4, A5 are selected.

### **Java Implementation**

```java
import java.util.*;

public class ActivitySelection {
    public static int maxActivities(int[] start, int[] finish) {
        int n = start.length;
        // Create list of activities as pairs
        int[][] activities = new int[n][2];
        for (int i = 0; i < n; i++) {
            activities[i][0] = start[i];
            activities[i][1] = finish[i];
        }
        // Sort by finish time
        Arrays.sort(activities, (a, b) -> a[1] - b[1]);
        int count = 1;
        int lastFinish = activities[0][1];
        for (int i = 1; i < n; i++) {
            if (activities[i][0] >= lastFinish) {
                count++;
                lastFinish = activities[i][1];
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[] start = {1, 3, 0, 5, 8};
        int[] finish = {4, 5, 6, 7, 9};
        System.out.println("Maximum activities: " + maxActivities(start, finish));
    }
}
```

### **Python Implementation**

```python
def max_activities(start, finish):
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    count = 1
    last_finish = activities[0][1]
    for s, f in activities[1:]:
        if s >= last_finish:
            count += 1
            last_finish = f
    return count

start = [1, 3, 0, 5, 8]
finish = [4, 5, 6, 7, 9]
print("Maximum activities:", max_activities(start, finish))
```

### **Time & Space Complexity**

|        |            |
| ------ | ---------- |
| Metric | Value      |
| Time   | O(n log n) |
| Space  | O(1)       |

---

---

## 🛠️ How to Think: A Framework for Greedy Problems

### **Step 1: Identify the Problem Type**

Ask:

- Is the problem **optimal substructure**?

- Can it be **solved by making greedy choices**?

- Is the problem **not NP-hard**?

### **Step 2: Sort or Order the Input**

- **Sort by a key** (e.g., finish time, weight, value).

- **Order matters** in greedy algorithms.

### **Step 3: Make the Greedy Choice**

- **Always pick the locally optimal choice**.

- **Skip overlapping or conflicting choices**.

### **Step 4: Verify Optimality**

- **Test with edge cases**.

- **Check if the greedy choice leads to a global optimum**.

### **Step 5: Implement and Optimize**

- Use **efficient data structures** (e.g., priority queues).

- **Avoid unnecessary computations**.

---

---

## 🔗 Common Greedy Patterns

|                          |                                       |                                                      |
| ------------------------ | ------------------------------------- | ---------------------------------------------------- |
| Pattern                  | Problem Type                          | Key Idea                                             |
| **Activity Selection**   | Interval scheduling                   | Sort by finish time, pick earliest first             |
| **Fractional Knapsack**  | Maximize value with weight constraint | Sort by value/weight, pick highest first             |
| **Huffman Coding**       | Optimal prefix-free encoding          | Use a priority queue to merge least frequent symbols |
| **Dijkstra’s Algorithm** | Shortest path in weighted graphs      | Always pick the shortest path first                  |
| **Job Sequencing**       | Maximize profit with deadlines        | Sort by profit, schedule latest possible             |

---

---

## ⚠️ Edge Cases and Pitfalls

|                              |                               |                                      |
| ---------------------------- | ----------------------------- | ------------------------------------ |
| Edge Case                    | Description                   | Solution                             |
| **Empty Input**              | No activities/tasks           | Return 0 or handle gracefully        |
| **All Activities Overlap**   | No non-overlapping activities | Return 1 (the first activity)        |
| **Equal Start/Finish Times** | Ambiguity in selection        | Sort by finish time, then start time |
| **Large Input Size**         | Performance issues            | Use efficient sorting and iteration  |
| **Negative Values**          | Invalid for some problems     | Validate input before processing     |

---

---

## 🎯 Tips and Tricks

1. **Always sort the input** by a relevant key (e.g., finish time, value/weight).

2. **Use a priority queue** for problems like Huffman coding.

3. **Think greedily first, then optimize** (e.g., use dynamic programming for verification).

4. **Test with small inputs** to verify correctness.

5. **Be cautious with greedy choices**—not all problems are solvable greedily!

---

## **Interview Q&A: Common Greedy Problems**

---

## ❓ Interview Q&A: Greedy Edition

Greedy algorithms are a favorite in interviews because they test a candidate’s ability to **identify optimal substructure**, **make locally optimal choices**, and **justify their decisions**. Below, we dissect **three classic greedy problems** with detailed problem statements, solutions, and conceptual discussions.

---

### **Problem 1: Activity Selection**

**Problem Statement:**  
Given `n` activities with their start and finish times, select the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time.

**Input:**
- `start[] = {1, 3, 0, 5, 8, 5}`
- `finish[] = {2, 4, 6, 7, 9, 9}`

**Output:**
- `4` (Activities: [1, 2], [3, 4], [5, 7], [8, 9])

**Explanation:**  
The person can perform at most 4 activities. If they pick activity [0, 6], they can't do any other activity until time 6. By picking [1, 2], they finish early and can start the next activity [3, 4], and so on.

#### **Greedy Approach**
1. Sort activities by **finish time**.
2. Select the first activity from the sorted list.
3. For the remaining activities, if the start time of the current activity is greater than or equal to the finish time of the previously selected activity, select it.

#### **Conceptual & Edge-Case Q&A**

**Q: [Conceptual] Why does sorting by finish time guarantee optimality?**  
**A:** By selecting the activity that finishes earliest, we leave the maximum possible time for the remaining activities. This "greedy" choice ensures we don't block later activities unnecessarily.

**Q: [Edge-Case] What if all activities overlap?**  
**A:** If every activity overlaps with every other activity, only **one** activity can be selected (specifically, the one that finishes first in our sorted list).

**Q: [Edge-Case] How do you handle activities that start and end at the same time (e.g., [5, 5])?**  
**A:** Usually, an activity with zero duration is considered valid as long as it doesn't overlap. In most interview contexts, `start >= lastFinish` allows these "instant" activities to be included.

**Q: [Follow-up] What if activities have different values/profits?**  
**A:** If activities have profits and we want to maximize total profit (not just count), simple greedy finishing-time won't work. We would need **Dynamic Programming** or a **Weighted Interval Scheduling** approach.

**Q: [Follow-up] Can we sort by start time instead?**  
**A:** No. Sorting by start time doesn't guarantee the maximum number of activities because a very long activity starting early could block many shorter ones that start slightly later.

---

### **Problem 2: Fractional Knapsack**

**Problem Statement:**  
Given weights and values of `n` items, we need to put these items in a knapsack of capacity `W` to get the maximum total value in the knapsack. Items can be broken into smaller pieces.

**Input:**
- `Item[] = {(value: 60, weight: 10), (value: 100, weight: 20), (value: 120, weight: 30)}`
- `W = 50`

**Output:**
- `240.0`

**Explanation:**  
- Item 1 (v/w = 6): Full item (10kg, 60 value)
- Item 2 (v/w = 5): Full item (20kg, 100 value)
- Item 3 (v/w = 4): 2/3rd item (20kg, 80 value)
- Total = 240.0

#### **Greedy Approach**
1. Calculate the **value/weight ratio** for each item.
2. Sort items based on this ratio in **descending order**.
3. Take as much of the highest ratio item as possible.

#### **Conceptual & Edge-Case Q&A**

**Q: [Conceptual] Why does the greedy approach fail for 0/1 Knapsack?**  
**A:** In 0/1 Knapsack, you cannot break items. A high-ratio item might be very heavy and take up space that could be better used by two smaller items with slightly lower ratios but higher combined value. Greedy choices don't "look ahead" to see if a combination of less-optimal local choices yields a better global result.

**Q: [Edge-Case] What if multiple items have the same ratio?**  
**A:** The selection order among them doesn't matter; the total value will remain the same.

**Q: [Edge-Case] What if the knapsack capacity is larger than the total weight of all items?**  
**A:** Simply take every item. The total value will be the sum of all item values, and the remaining capacity stays empty.

**Q: [Follow-up] How would you modify this for a "Limited supply" fractional knapsack (e.g., only 3 units of Item 1)?**  
**A:** The logic remains the same: sort by ratio. The only change is that when you pick an item, you are limited by `min(remaining_capacity, available_units_of_item)`.

---

### **Problem 3: Job Sequencing with Deadlines**

**Problem Statement:**  
Given a set of `n` jobs where each job has a deadline and profit, find the maximum profit if only one job can be scheduled at a time. Each job takes 1 unit of time.

**Input:**
- `Jobs = {(ID: 'a', Deadline: 2, Profit: 100), (ID: 'b', Deadline: 1, Profit: 19), (ID: 'c', Deadline: 2, Profit: 27), (ID: 'd', Deadline: 1, Profit: 25), (ID: 'e', Deadline: 3, Profit: 15)}`

**Output:**
- `142` (Jobs: c, a, e)

**Explanation:**  
- Sort by profit: a(100), c(27), d(25), b(19), e(15)
- Slot 2: Job 'a' (at time 2)
- Slot 1: Job 'c' (at time 1)
- Slot 3: Job 'e' (at time 3)
- Total Profit = 100 + 27 + 15 = 142.

#### **Greedy Approach**
1. Sort all jobs in **descending order of profit**.
2. Find the maximum deadline to determine the number of available time slots.
3. For each job, try to schedule it in the **latest possible slot** before its deadline.

#### **Conceptual & Edge-Case Q&A**

**Q: [Conceptual] Why schedule in the *latest* possible slot?**  
**A:** Scheduling a job as late as possible leaves earlier slots free for jobs with tighter deadlines. This maximizes the utilization of available time.

**Q: [Edge-Case] What if all jobs have a deadline of 1?**  
**A:** Only **one** job can be completed (the one with the highest profit).

**Q: [Edge-Case] What if the number of jobs is much larger than the maximum deadline?**  
**A:** Many jobs will inevitably be skipped. The algorithm will only fill the available slots up to the maximum deadline with the most profitable jobs.

**Q: [Follow-up] How can we optimize the "find slot" step for large N?**  
**A:** We can use a **Disjoint Set Union (DSU)**. Initially, every slot points to itself. When a slot `i` is filled, we union it with `i-1`. This allows us to find the next available free slot in nearly constant time (inverse Ackermann function α(N)).

**Q: [Follow-up] What if jobs have varying durations (e.g., Job A takes 2 hours)?**  
**A:** This transforms the problem into a variant of **Interval Scheduling with Profits**, which usually requires Dynamic Programming.

---


---

## 🔬 Advanced Insights

### **When Greedy Fails: Counterexamples**


1. **Coin Change Problem (Non-canonical coin systems)**
   
   - Greedy works for canonical systems (e.g., US coins).
   
   - Fails for arbitrary systems (e.g., coins = [1, 3, 4], amount = 6).

2. **Minimum Spanning Tree (Prim’s vs. Kruskal’s)**
   
   - Both use greedy choices, but **Prim’s** starts from a vertex, while **Kruskal’s** sorts edges.

### **Greedy + Dynamic Programming Hybrids**

- Some problems require **both greedy and DP** (e.g., "Minimum Cost to Hire K Workers").

- Use greedy for **local optimization** and DP for **global verification**.

---

---

## 📝 Summary: Key Takeaways


|                                 |                                                                    |
| ------------------------------- | ------------------------------------------------------------------ |
| Concept                         | Takeaway                                                           |
| **Greedy Choice Property**      | Local optimality → Global optimality (if problem structure allows) |
| **Optimal Substructure**        | Optimal solution contains optimal solutions to subproblems         |
| **Sorting is Key**              | Always sort by a relevant key (e.g., finish time, value/weight)    |
| **Edge Cases Matter**           | Handle empty inputs, overlaps, and negative values                 |
| **Not All Problems Are Greedy** | Test with counterexamples before assuming                          |

### **Final Advice**

- **Practice is key**—solve as many greedy problems as possible.

- **Understand the problem structure** before jumping to code.

- **Think greedily first, then optimize** (e.g., use DP for verification).

---

**Happy Coding!** 🚀

---

*Do you want to dive deeper into a specific greedy pattern or problem? Let me know!*
