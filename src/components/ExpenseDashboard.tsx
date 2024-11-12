// src/components/ExpenseDashboard.tsx
import { Expense } from '../types';

interface ExpenseDashboardProps {
  expenseList: Expense[];
}

export const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({
  expenseList,
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Dashboard de Gastos</h2>
      <ul>
        {expenseList.map((expense) => (
          <li key={expense.id} className="border-b py-2">
            <div>
              <span className="font-semibold">Viajero:</span>{' '}
              {expense.travelerName}
            </div>
            <div>
              <span className="font-semibold">Fecha:</span> {expense.date}
            </div>
            <div>
              <span className="font-semibold">Tipo de Gasto:</span>{' '}
              {expense.type}
            </div>
            <div>
              <span className="font-semibold">Monto:</span> ${expense.amount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
