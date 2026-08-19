---
title: "Является ли число простым"
outline: [2, 3]
---

# Является ли число простым

**Источник:** Improved table Java  
**Вопросов:** 4

## 1. Найти нужное число в последовательности Фибоначчи

<span class="source-badge">Источник: Таблица</span>

//через формулу Бине
     public static long fibonacci(int index) {
         double fi = (1 + Math.sqrt(5)) / 2;
         return Math.round(Math.pow(fi, index) / Math.sqrt(5));
     }

---

## 2. Вычислить квадратный корень числа, возвращая только целую часть корня.

<span class="source-badge">Источник: Таблица</span>

public static int sqrt(int numb) {
          for (int i = 1; i &lt; numb; i++) {
              if (i*i == numb) return i;
              if (i*i &gt; numb) return i-1;
           }
          return 0;
}

---

## 3. Последовательность Фибоначчи

<span class="source-badge">Источник: Таблица</span>

public static void fibonachi(int beforePreviousValue, int previousValue, int maxValue) {
    if (previousValue &lt;= maxValue) {
       System.out.println(previousValue);
      int currentValue = beforePreviousValue + previousValue;
      fibonachi(previousValue, currentValue, maxValue);
    }
}

---

## 4. пузырьковая сортировка

<span class="source-badge">Источник: Таблица</span>

// метод пузырьковой сортировки
    public static void bubbleSort(int[] num) {
        int j;
        boolean flag = true;   // устанавливаем наш флаг в true для первого прохода по массиву
        int temp;   // вспомогательная переменная
 
        while (flag) {
            flag = false;    // устанавливаем флаг в false в ожидании возможного свопа (замены местами)
            for (j = 0; j &lt; num.length - 1; j++) {
                if (num[j] &lt; num[j + 1]) { // измените на &gt; для сортировки по возрастанию
                    temp = num[j];         // меняем элементы местами
                    num[j] = num[j + 1];
                    num[j + 1] = temp;
                    flag = true;  // true означает, что замена местами была проведена
                }
            }
        }
    }

---
