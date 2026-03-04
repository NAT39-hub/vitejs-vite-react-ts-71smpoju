import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Transaction, WeeklyStats, Category } from './types';

export const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), 'dd/MM/yyyy', { locale: vi });
};

export const getWeeklyStats = (transactions: Transaction[], targetDate: Date = new Date()): WeeklyStats => {
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyTransactions = transactions.filter((t) => {
    const tDate = parseISO(t.date);
    return tDate >= weekStart && tDate <= weekEnd;
  });

  const total = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);

  const dailyBreakdown = daysInWeek.map((day) => {
    const dayTotal = weeklyTransactions
      .filter((t) => isSameDay(parseISO(t.date), day))
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      date: format(day, 'EEEE', { locale: vi }),
      amount: dayTotal,
    };
  });

  const categoryBreakdown = weeklyTransactions.reduce((acc, t) => {
    const existing = acc.find((c) => c.category === t.category);
    if (existing) {
      existing.amount += t.amount;
    } else {
      acc.push({ category: t.category, amount: t.amount });
    }
    return acc;
  }, [] as { category: Category; amount: number }[]);

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    total,
    dailyBreakdown,
    categoryBreakdown,
  };
};