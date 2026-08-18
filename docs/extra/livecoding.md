# Лайвкодинг

В разделе: **11 вопросов**.

Ответы приведены сразу в полном виде: без отдельного «короткого ответа».

## 1. Алгоритм для высчитывания логарифма заданного числа по заданному основанию

static int isBitCount(double target, double osnovanie) {
        return (int) (Math.log(target) / Math.log(osnovanie))
}

---

## 2. Рекурсивное вычисление факториала

public static int factorial(int n) {
        return (n == 0) ? 1 : n * factorial(n - 1);
}

---

## 3. Реверс числа без использования строк

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

## 4. Проверка симметричности бинарного дерева

Сложность О(n)

---

## 5. Дан массив с числами, одно число удалили и перемешали массив. Найти удаленное число.

int before = Arrays.stream(arrayBefore).sum();
int after = Arrays.stream(arrayAfter).sum();

System.out.println(before - after);

---

## 6. Найти общее число в трёх коллекциях, не используя дополнительные структуры

public static int findCommon(List&lt;Integer&gt; first, List&lt;Integer&gt; second, List&lt;Integer&gt; third) {
        int wallSecond = 0;
        int wallThird = 0;
        for (Integer comparedEl : first) {
            int commonCount = 0;

            for (; wallSecond &lt; second.size(); wallSecond++)
            {
                if (comparedEl &lt; second.get(wallSecond)) {
                    break;
                }
                if (comparedEl.equals(second.get(wallSecond))) {
                    commonCount++;
                    break;
                }
            }
            for (; wallThird &lt; third.size(); wallThird++) {
                if (comparedEl &lt; third.get(wallThird)) {
                    break;
                }
                if (comparedEl.equals(third.get(wallThird))) {
                    commonCount++;
                    break;
                }
            }
            if (commonCount == 2) {
                return comparedEl;
            }
        }
        return -1;
    }

---

## 7. Является ли число простым

public static boolean checkNumberIsPrime(int number) {
         int factors = 0;
         int counter = 1;

         while(counter &lt;= number) {
             if(number % counter == 0) {
                 factors++;
             }
             counter++;
         }
         return (factors == 2);
     }

---

## 8. Найти нужное число в последовательности Фибоначчи

//через формулу Бине
     public static long fibonacci(int index) {
         double fi = (1 + Math.sqrt(5)) / 2;
         return Math.round(Math.pow(fi, index) / Math.sqrt(5));
     }

---

## 9. Вычислить квадратный корень числа, возвращая только целую часть корня.

public static int sqrt(int numb) {
          for (int i = 1; i &lt; numb; i++) {
              if (i*i == numb) return i;
              if (i*i &gt; numb) return i-1;
           }
          return 0;
}

---

## 10. Последовательность Фибоначчи

public static void fibonachi(int beforePreviousValue, int previousValue, int maxValue) {
    if (previousValue &lt;= maxValue) {
       System.out.println(previousValue);
      int currentValue = beforePreviousValue + previousValue;
      fibonachi(previousValue, currentValue, maxValue);
    }
}

---

## 11. пузырьковая сортировка

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

## Дополнительные материалы

[Статьи, видео и другие материалы по разделу →](/materials/extra-livecoding)
