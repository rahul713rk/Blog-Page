---
title: "The Java Saga: A Journey Through Code, Stories, and Challenges"
description: "Join a journey through the Java world. Explore OOP pillars, SOLID principles, Collections, Concurrency, and JVM internals through storytelling and practical code."
date: 2026-06-10
author: Rahul Kumar
tags: [Java, Programming, OOP, SOLID, Concurrency]
category: "Programming"
cover: "/assets/images/posts/java-saga-cover.png"
readingTime: "25 min read"
draft: false
slug: "java-saga"
---

# The Java Saga: A Journey Through Code, Stories, and Challenges

Explore the depths of Java development through a collection of chapters covering essential concepts, best practices, and advanced topics.

---

## Table of Contents

1. [Chapter 1: The Kingdom of Objects (OOP)](#chapter-1-the-kingdom-of-objects--object-oriented-programming-oop)
2. [Chapter 2: The Five Commandments (SOLID)](#chapter-2-the-five-commandments--solid-principles)
3. [Chapter 3: The Library of Scrolls (Collections)](#chapter-3-the-library-of-scrolls--collections-framework)
4. [Chapter 4: The Alchemist’s Potion (Generics)](#chapter-4-the-alchemists-potion--generics)
5. [Chapter 5: The Guardian’s Shield (Exceptions)](#chapter-5-the-guardians-shield--exception-handling)
6. [Chapter 6: The Oracle’s Vision (Java 8+)](#chapter-6-the-oracles-vision--java-8-features)
7. [Chapter 7: The Threads of Fate (Concurrency)](#chapter-7-the-threads-of-fate--multithreading--concurrency)
8. [Chapter 8: The Architect’s Blueprint (JVM Memory)](#chapter-8-the-architects-blueprint--jvm-memory-model)

---

---

---

## Chapter 1: The Kingdom of Objects – Object-Oriented Programming (OOP)

### **The Tale of the Four Pillars**

In the **Kingdom of Objects**, four ancient pillars stood tall: **Encapsulation**, **Inheritance**, **Polymorphism**, and **Abstraction**. Each pillar was guarded by a sage who taught the villagers (developers) how to build robust castles (applications).

---

#### **Encapsulation: The Vault of Secrets**

The sage **Encapsulo** guarded the kingdom’s treasures. "Never expose your gold directly," he warned. "Use gates (getters) and guards (setters) to control access."

**Code Example:**

```java
public class TreasureVault {
    private String treasure; // Hidden from outsiders

    public String getTreasure() {
        return treasure;
    }

    public void setTreasure(String newTreasure) {
        if (newTreasure != null) {
            this.treasure = newTreasure;
        }
    }
}
```

*One day, a thief tried to steal the treasure, but the gates of `getTreasure()` and `setTreasure()` protected it.*

---

#### **Inheritance: The Legacy of the Blacksmith**

The blacksmith **Inherito** forged weapons for the kingdom. His apprentice, **SwordMaster**, inherited his skills and added his own.

**Code Example:**

```java
class Blacksmith {
    void forgeWeapon() {
        System.out.println("Forging a sword...");
    }
}

class SwordMaster extends Blacksmith {
    void sharpenBlade() {
        System.out.println("Sharpening the blade...");
    }
}
```

*SwordMaster could now forge AND sharpen blades, thanks to inheritance.*

---

#### **Polymorphism: The Magician’s Trick**

The magician **Poly** could take many forms. He appeared as a **Circle** one day and a **Square** the next, but his magic (`draw()`) worked the same.

**Code Example:**

```java
class Shape {
    void draw() {
        System.out.println("Drawing a shape");
    }
}

class Circle extends Shape {
    @Override
    void draw() {
        System.out.println("Drawing a circle");
    }
}

public class Main {
    public static void main(String[] args) {
        Shape shape = new Circle(); // Polymorphism
        shape.draw(); // Output: Drawing a circle
    }
}
```

*The kingdom marveled as Poly’s magic adapted to any form.*

---

#### **Abstraction: The Hidden Blueprint**

The architect **Abstracto** hid the kingdom’s blueprints. "Only show what’s necessary," he said.

**Code Example:**

```java
abstract class Blueprint {
    abstract void build();
}

class Castle extends Blueprint {
    @Override
    void build() {
        System.out.println("Building a castle...");
    }
}
```

*The kingdom thrived, its secrets protected by abstraction.*

---

---

## Q&A: The Royal Interview

1. **What is the difference between method overloading and method overriding?**
   
   - *Overloading* involves multiple methods with the same name but different parameters. *Overriding* involves a subclass providing a specific implementation of a method already defined in its superclass.

2. **Why is encapsulation important in OOP?**
   
   - Encapsulation protects an object’s internal state from unintended interference and misuse. It allows controlled access via methods, ensuring data integrity.

3. **Can you override a static method in Java?**
   
   - No. Static methods belong to the class, not the object. If a subclass defines a static method with the same signature, it hides the superclass method rather than overriding it.

---

---

## Chapter 2: The Five Commandments – SOLID Principles

### **The Temple of SOLID**

The high priest **SOLID** preached five commandments to the kingdom’s developers. Each commandment ensured that the kingdom’s structures were built to last:

---

#### **Single Responsibility Principle (SRP)**

"A class should have only one reason to change," declared the priest.

**Code Example:**

```java
class Book {
    private String title;
    private String author;

    public Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    public String getTitle() { return title; }
    public String getAuthor() { return author; }
}

class BookPrinter {
    public void printBook(Book book) {
        System.out.println("Title: " + book.getTitle());
        System.out.println("Author: " + book.getAuthor());
    }
}
```

*The Book knows its title and author. The Printer prints. Never mix their duties.*

---

#### **Open/Closed Principle (OCP)**

"Software entities should be open for extension but closed for modification," said the second priest.

**Code Example:**

```java
interface Shape {
    double area();
}

class Rectangle implements Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}

class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}
```

*New shapes can be added without changing the `Shape` interface.*

---

#### **Liskov Substitution Principle (LSP)**

"Subtypes must be substitutable for their base types," explained the third priest.

**Code Example:**

```java
class Bird {
    void fly() {
        System.out.println("Flying...");
    }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}
```

*This violates LSP. A `Penguin` cannot substitute a `Bird` if it cannot fly.*

---

#### **Interface Segregation Principle (ISP)**

"Clients should not be forced to depend on interfaces they do not use," said the fourth priest.

**Code Example:**

```java
interface Worker {
    void work();
}

interface Eater {
    void eat();
}

class HumanWorker implements Worker, Eater {
    @Override
    public void work() { System.out.println("Working..."); }
    @Override
    public void eat() { System.out.println("Eating..."); }
}

class RobotWorker implements Worker {
    @Override
    public void work() { System.out.println("Working..."); }
}
```

*Robots don’t eat, so they shouldn’t implement `Eater`.*

---

#### **Dependency Inversion Principle (DIP)**

"High-level modules should not depend on low-level modules. Both should depend on abstractions," concluded the fifth priest.

**Code Example:**

```java
interface Switch {
    void turnOn();
    void turnOff();
}

class LightBulb implements Switch {
    @Override
    public void turnOn() { System.out.println("LightBulb: On"); }
    @Override
    public void turnOff() { System.out.println("LightBulb: Off"); }
}

class Fan implements Switch {
    @Override
    public void turnOn() { System.out.println("Fan: On"); }
    @Override
    public void turnOff() { System.out.println("Fan: Off"); }
}

class Electrician {
    private Switch device;

    public Electrician(Switch device) {
        this.device = device;
    }

    public void operate() {
        device.turnOn();
        device.turnOff();
    }
}
```

*The `Electrician` depends on the `Switch` abstraction, not on `LightBulb` or `Fan`.*

---

---

## Q&A: The Temple’s Trial

1. **How does SRP improve maintainability?**
   
   - SRP ensures that changes to one responsibility do not affect others, reducing the risk of unintended side effects.

2. **Why is OCP important for large-scale systems?**
   
   - OCP allows systems to evolve by adding new features without modifying existing code, reducing regression risks.

3. **What is the difference between ISP and SRP?**
   
   - SRP focuses on a class having a single responsibility, while ISP focuses on clients not being forced to depend on interfaces they don’t use.

---

---

---

## Chapter 3: The Library of Scrolls – Collections Framework

### **The Keeper’s Scrolls**

In the heart of the **Kingdom of Java**, the **Keeper of Scrolls** maintained the kingdom’s records using magical containers: **Lists**, **Sets**, **Maps**, and **Queues**. Each container had its own unique power, and the Keeper taught the villagers how to use them wisely.

---

#### **ArrayList: The Scroll of Names**

The Keeper used an **ArrayList** to record the names of the kingdom’s heroes. "This scroll grows as needed," he explained, "and allows quick access to any name."

**Code Example:**

```java
List<String> heroes = new ArrayList<>();
heroes.add("Aragorn");
heroes.add("Legolas");
heroes.add("Gimli");
System.out.println(heroes); // [Aragorn, Legolas, Gimli]
```

*The heroes’ names were recorded in order, and the Keeper could easily add or remove names as needed.*

---

#### **HashSet: The Unique Artifacts**

For the kingdom’s artifacts, the Keeper used a **HashSet**. "Only unique artifacts are stored here," he said. "Duplicates vanish like mist."

**Code Example:**

```java
Set<Integer> artifacts = new HashSet<>();
artifacts.add(1);
artifacts.add(2);
artifacts.add(1); // Duplicate, ignored
System.out.println(artifacts); // [1, 2]
```

*The HashSet ensured that only one of each artifact was preserved, no matter how many times it was added.*

---

#### **HashMap: The Treasure Map**

The kingdom’s treasures were mapped by name using a **HashMap**. "Each treasure has a key," the Keeper explained. "With the key, you can find the treasure instantly."

**Code Example:**

```java
Map<String, Integer> treasureMap = new HashMap<>();
treasureMap.put("Gold", 100);
treasureMap.put("Silver", 50);
System.out.println(treasureMap.get("Gold")); // 100
```

*The Keeper could retrieve the amount of gold or silver in constant time, thanks to the HashMap’s magic.*

---

#### **Queue: The Line of Petitioners**

For managing the line of villagers waiting to see the King, the Keeper used a **Queue**. "The first to arrive is the first to be served," he said.

**Code Example:**

```java
Queue<String> petitioners = new LinkedList<>();
petitioners.add("Farmer John");
petitioners.add("Blacksmith Tom");
petitioners.add("Merchant Alice");
System.out.println(petitioners.poll()); // Farmer John
```

*The Queue ensured fairness, as villagers were served in the order they arrived.*

---

---

## Q&A: The Keeper’s Challenges

1. **What is the difference between `ArrayList` and `LinkedList`?**
   
   - `ArrayList` is backed by a dynamic array, providing fast random access (O(1)) but slower insertions/deletions (O(n)). `LinkedList` is backed by a doubly-linked list, providing fast insertions/deletions (O(1)) but slower random access (O(n)).

2. **How does a `HashSet` ensure uniqueness?**
   
   - A `HashSet` uses the `hashCode()` and `equals()` methods to determine if two objects are the same. If two objects have the same hash code and are equal, only one is stored in the set.

3. **What is the time complexity of inserting into a `HashMap`?**
   
   - On average, inserting into a `HashMap` is O(1), assuming a good hash function and proper resizing. In the worst case (e.g., all keys collide), it can degrade to O(n).

---

---

---

## Chapter 4: The Alchemist’s Potion – Generics

### **The Potion of Flexibility**

In the **Tower of Alchemy**, the alchemist **Generico** brewed potions that could adapt to any ingredient. "Generics allow you to write flexible, reusable code," he explained, stirring a bubbling cauldron.

---

#### **The Generic Potion**

Generico demonstrated how to create a potion that could hold any type of ingredient, whether it was a herb, a crystal, or a drop of dragon’s blood.

**Code Example:**

```java
class Potion<T> {
    private T ingredient;

    public void setIngredient(T ingredient) {
        this.ingredient = ingredient;
    }

    public T getIngredient() {
        return ingredient;
    }
}

public class Main {
    public static void main(String[] args) {
        Potion<String> herbPotion = new Potion<>();
        herbPotion.setIngredient("Mandrake Root");
        System.out.println(herbPotion.getIngredient()); // Mandrake Root

        Potion<Integer> crystalPotion = new Potion<>();
        crystalPotion.setIngredient(42);
        System.out.println(crystalPotion.getIngredient()); // 42
    }
}
```

*The Potion class could now adapt to any ingredient type, making it incredibly versatile.*

---

#### **Bounded Generics: The Restricted Elixir**

Generico also showed how to restrict the types of ingredients that could be used in a potion. "Only magical ingredients are allowed in this elixir," he said.

**Code Example:**

```java
interface MagicalIngredient {}
class DragonBlood implements MagicalIngredient {}

class Potion<T extends MagicalIngredient> {
    private T ingredient;

    public void setIngredient(T ingredient) {
        this.ingredient = ingredient;
    }

    public T getIngredient() {
        return ingredient;
    }
}

public class Main {
    public static void main(String[] args) {
        Potion<DragonBlood> elixir = new Potion<>();
        elixir.setIngredient(new DragonBlood());
        // elixir.setIngredient("Mandrake Root"); // Compile-time error
    }
}
```

*The bounded generic ensured that only ingredients implementing `MagicalIngredient` could be used.*

---

#### **Wildcards: The Mysterious Vial**

Generico pulled out a mysterious vial labeled with a question mark. "This is a wildcard," he explained. "It can hold any type of potion, but with restrictions."

**Code Example:**

```java
class PotionPrinter {
    public void printPotion(List<?> potions) {
        for (Object potion : potions) {
            System.out.println(potion);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        List<String> herbPotions = new ArrayList<>();
        herbPotions.add("Mandrake Root");
        herbPotions.add("Wolfsbane");

        PotionPrinter printer = new PotionPrinter();
        printer.printPotion(herbPotions); // [Mandrake Root, Wolfsbane]
    }
}
```

*The wildcard `?` allowed the `printPotion` method to accept a list of any type.*

---

---

## Q&A: The Alchemist’s Enigmas

1. **What is type erasure in Java Generics?**
   
   - Type erasure is the process by which the compiler removes all generic type information after compiling the code. At runtime, a generic class or method is treated as its raw type (e.g., `List<String>` becomes `List`).

2. **Why can’t you use primitive types with Generics?**
   
   - Generics in Java work only with reference types (objects), not primitive types. This is because the type information is erased at runtime, and primitives are not objects. You must use wrapper classes (e.g., `Integer` instead of `int`).

3. **What is the difference between `List<?>` and `List<Object>`?**
   
   - `List<?>` is a list of unknown type, meaning you can’t add any elements to it (except `null`). `List<Object>` is a list that can hold any object, so you can add any object to it. `List<?>` is more restrictive and used for reading, while `List<Object>` is used for writing.

---

---

---

## Chapter 5: The Guardian’s Shield – Exception Handling

### **The Trials of the Kingdom**

In the **Kingdom of Java**, the **Guardian of Stability** protected the villagers from chaos using the power of **Exception Handling**. "Errors will come," he warned, "but with the right shields, the kingdom will stand."

---

#### **Try-Catch: The Shield and Sword**

The Guardian demonstrated how to catch exceptions before they could harm the kingdom.

**Code Example:**

```java
public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 0; // ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero is forbidden!");
        }
    }
}
```

*The Guardian caught the `ArithmeticException` and prevented the kingdom from crashing.*

---

#### **Finally: The Unbreakable Oath**

The Guardian also taught the villagers about the `finally` block. "No matter what happens," he said, "this oath will always be fulfilled."

**Code Example:**

```java
public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 2;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            System.out.println("This oath is always fulfilled.");
        }
    }
}
```

*The `finally` block executed regardless of whether an exception occurred, ensuring resources were always released.*

---

#### **Custom Exceptions: The Guardian’s Decree**

For special cases, the Guardian created **custom exceptions** to enforce the kingdom’s rules.

**Code Example:**

```java
class KingdomRuleException extends Exception {
    public KingdomRuleException(String message) {
        super(message);
    }
}

public class Main {
    public static void main(String[] args) {
        try {
            enforceRule(false);
        } catch (KingdomRuleException e) {
            System.out.println("Guardian’s Decree: " + e.getMessage());
        }
    }

    public static void enforceRule(boolean isRuleFollowed) throws KingdomRuleException {
        if (!isRuleFollowed) {
            throw new KingdomRuleException("The rule must be followed!");
        }
    }
}
```

*The custom exception `KingdomRuleException` ensured that the kingdom’s rules were never broken without consequence.*

---

---

## Q&A: The Guardian’s Trials

1. **What is the difference between `throw` and `throws` in Java?**
   
   - `throw` is used to explicitly throw an exception from a method or block. `throws` is used in a method signature to declare that the method might throw one or more exceptions.

2. **Why is it bad practice to catch `Exception`?**
   
   - Catching `Exception` (or its superclass `Throwable`) is too broad and can mask unexpected errors, making debugging difficult. It’s better to catch specific exceptions to handle errors precisely.

3. **What is exception propagation?**
   
   - Exception propagation is the process by which an uncaught exception moves up the call stack until it is caught or reaches the top level, where it terminates the program. If a method doesn’t handle an exception, it propagates to the caller.

---

---

---

---

## Chapter 6: The Oracle’s Vision – Java 8+ Features

### **The Streams of Prophecy**

Deep in the **Temple of the Oracle**, the seers revealed the future of Java: **Streams**, **Lambdas**, and **Optional**. "These tools will change how you see data," the Oracle whispered.

---

#### **Streams: The River of Data**

The Oracle showed how to process collections of data as a flowing river, filtering and transforming elements with ease.

**Code Example:**

```java
List<String> heroes = Arrays.asList("Aragorn", "Legolas", "Gimli", "Boromir");
List<String> filteredHeroes = heroes.stream()
    .filter(name -> name.startsWith("A"))
    .collect(Collectors.toList());
System.out.println(filteredHeroes); // [Aragorn]
```

*The river of data flowed, and only the names starting with "A" were collected.*

---

#### **Lambdas: The Oracle’s Whisper**

The Oracle demonstrated how to write concise, functional code using **lambdas**.

**Code Example:**

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
numbers.forEach(number -> System.out.println(number * 2));
// Output:
// 2
// 4
// 6
// 8
// 10
```

*The Oracle’s whispers transformed each number, doubling its value.*

---

#### **Optional: The Cursed Chest**

The Oracle warned of the dangers of `null` and introduced **Optional** as a safer alternative.

**Code Example:**

```java
Optional<String> cursedChest = Optional.ofNullable(null);
System.out.println(cursedChest.orElse("The chest is empty!")); // The chest is empty!
```

*The cursed chest was empty, but the kingdom was prepared.*

---

#### **Method References: The Oracle’s Shortcut**

The Oracle also revealed **method references**, a shorthand for lambdas.

**Code Example:**

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(System.out::println);
// Output:
// Alice
// Bob
// Charlie
```

*The Oracle’s shortcut made the code cleaner and more readable.*

---

---

## Q&A: The Oracle’s Enigmas

1. **What is the difference between `map()` and `flatMap()` in Streams?**
   
   - `map()` applies a function to each element and returns a stream of results. `flatMap()` flattens nested structures (e.g., streams of streams) into a single stream of elements.

2. **Why use `Optional` instead of `null`?**
   
   - `Optional` forces developers to explicitly handle the absence of a value, reducing the risk of `NullPointerException` and making the code more expressive.

3. **What is a functional interface?**
   
   - A functional interface is an interface with exactly one abstract method. It can be implemented using a lambda expression, method reference, or constructor reference.

---

---

---

## Chapter 7: The Threads of Fate – Multithreading & Concurrency

### **The Weavers of Time**

In the **Temple of Threads**, the **Weavers** spun threads of time, allowing the kingdom to perform multiple tasks at once.

---

#### **Creating a Thread: The Weaver’s Apprentice**

The Weavers taught the villagers how to create threads to weave their tasks concurrently.

**Code Example:**

```java
class WeaverThread extends Thread {
    @Override
    public void run() {
        System.out.println("Weaving the thread of fate...");
    }
}

public class Main {
    public static void main(String[] args) {
        WeaverThread weaver = new WeaverThread();
        weaver.start(); // Output: Weaving the thread of fate...
    }
}
```

*The apprentice wove his first thread, and the kingdom’s tasks began to run concurrently.*

---

#### **Runnable: The Weaver’s Task**

The Weavers also showed how to use the `Runnable` interface for more flexibility.

**Code Example:**

```java
Runnable weavingTask = () -> {
    System.out.println("Weaving a new fate...");
};
Thread thread = new Thread(weavingTask);
thread.start(); // Output: Weaving a new fate...
```

*The weavers’ tasks ran concurrently, each thread weaving its own fate.*

---

#### **Synchronization: The Weaver’s Lock**

The Weavers warned of the dangers of tangled threads and taught the villagers to use **synchronization** to protect shared resources.

**Code Example:**

```java
class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();

        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        };

        Thread thread1 = new Thread(task);
        Thread thread2 = new Thread(task);

        thread1.start();
        thread2.start();

        try {
            thread1.join();
            thread2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(counter.getCount()); // 2000
    }
}
```

*The weavers’ locks prevented tangled threads, ensuring the count was accurate.*

---

### **Q&A: The Weaver’s Trials**

1. **What is the difference between `Thread` and `Runnable`?**
   
   - `Thread` is a class that represents a thread of execution. `Runnable` is an interface that defines a task to be run by a thread. Using `Runnable` allows you to extend another class, while extending `Thread` does not.

2. **What is a race condition?**
   
   - A race condition occurs when multiple threads access shared data and try to change it simultaneously, leading to unpredictable results.

3. **What is the `volatile` keyword used for?**
   
   - The `volatile` keyword ensures that a variable’s value is always read from and written to the main memory, not from a thread’s local cache. This guarantees visibility of changes across threads.

---

---

---

## Chapter 8: The Architect’s Blueprint – JVM Memory Model

### **The Pillars of Memory**

The **Architect of the JVM** designed the kingdom’s memory, dividing it into **Heap**, **Stack**, and **Garbage Collection (GC)**.

---

#### **Heap: The Shared Treasury**

The Architect explained that the **Heap** stores all objects and arrays, shared by all threads.

**Code Example:**

```java
class Treasure {
    private String name;

    public Treasure(String name) {
        this.name = name;
    }
}

public class Main {
    public static void main(String[] args) {
        Treasure gold = new Treasure("Gold");
        // 'gold' is stored in the heap
    }
}
```

*The kingdom’s treasures were stored in the heap, accessible to all threads.*

---

#### **Stack: The Thread’s Ledger**

Each thread had its own **Stack**, where method calls and local variables were stored.

**Code Example:**

```java
public class Main {
    public static void main(String[] args) {
        int localVar = 42; // Stored in the stack
        methodCall();
    }

    public static void methodCall() {
        int anotherVar = 10; // Also stored in the stack
    }
}
```

*Each thread’s stack held its own ledger of method calls and variables.*

---

#### **Garbage Collection: The Cleaner’s Duty**

The Architect introduced the **Garbage Collector (GC)**, which automatically reclaimed memory by removing unreachable objects.

**Code Example:**

```java
public class Main {
    public static void main(String[] args) {
        Treasure gold = new Treasure("Gold");
        gold = null; // The 'Gold' treasure is now unreachable
        // The GC will eventually reclaim its memory
    }
}
```

*The Garbage Collector swept through the heap, freeing memory from unreachable objects.*

---

---

## Q&A: The Architect’s Challenges

1. **What is the difference between the heap and the stack?**
   
   - The **heap** stores objects and arrays and is shared across threads. The **stack** stores method calls and local variables and is thread-specific.

2. **How does the JVM decide when to run garbage collection?**
   
   - The JVM runs garbage collection automatically when it determines that memory is running low. The exact timing depends on the JVM implementation and garbage collection algorithm (e.g., Serial GC, Parallel GC, G1 GC).

3. **What is the purpose of the `finalize()` method?**
   
   - The `finalize()` method was historically called by the garbage collector before an object is reclaimed. However, it is **deprecated** since Java 9 and its use is strongly discouraged due to unpredictability, performance overhead, and potential for deadlocks. `try-with-resources` or `java.lang.ref.Cleaner` are preferred alternatives.
