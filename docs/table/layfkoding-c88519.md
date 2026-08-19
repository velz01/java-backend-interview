---
title: "Лайфкодинг"
outline: [2, 3]
---

# Лайфкодинг

**Источник:** Improved table Java  
**Вопросов:** 3

## 1. Алгоритм для высчитывания логарифма заданного числа по заданному основанию

<span class="source-badge">Источник: Таблица</span>

static int isBitCount(double target, double osnovanie) {
        return (int) (Math.log(target) / Math.log(osnovanie))
}

---

## 2. Рекурсивное вычисление факториала

<span class="source-badge">Источник: Таблица</span>

public static int factorial(int n) {
        return (n == 0) ? 1 : n * factorial(n - 1);
}

---

## 3. Реверс числа без использования строк

<span class="source-badge">Источник: Таблица</span>

public static int reverse(int numb) {
         int local = 0;
         while (numb &gt; 0) {
             local *= 10;
             local += numb % 10;
             numb /= 10;

         }
         return local;
     }

---
