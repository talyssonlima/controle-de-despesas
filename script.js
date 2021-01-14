const transactionUl = document.querySelector('#transactions');
const balanceDisplay = document.querySelector('#balance');
const expenseDisplay = document.querySelector('#money-minus');
const incomeDisplay = document.querySelector('#money-plus');
const form = document.querySelector('#form');

const localStorageTransaction = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransaction : [];

const numberAbs = (number) => Math.abs(number);

const addTransactionIntoDom = ({ id, name, amount }) => {
  const operator = (amount < 0 ? '-' : '+');
  const CSSClass = (amount < 0 ? 'minus' : 'plus');
  const amountWithoutOperator = Math.abs(amount);

  const li = document.createElement('li');
  li.classList.add(CSSClass);
  li.innerHTML = `
        ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
        <button className="delete-btn" onclick="removeTransaction(${id})">x</button>
    `;
  transactionUl.prepend(li);
};

const getExpenses = (transactionsAmounts) => transactionsAmounts
  .filter((value) => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2);

const getIncome = (transactionsAmounts) => transactionsAmounts
  .filter((value) => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2);

const getTotal = (transactionsAmounts) => transactionsAmounts
  .reduce((accumulator, amount) => accumulator + amount, 0)
  .toFixed(2);

const updateBalanceValue = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  const total = getTotal(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `+ R$${numberAbs(total)}`;
  incomeDisplay.textContent = `+ R$${numberAbs(income)}`;
  expenseDisplay.textContent = `- R$${numberAbs(expense)}`;
};

const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDom);
  updateBalanceValue();
};
init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
};

const addToTransactionArray = (nameLaunch, valueLaunch) => {
  transactions.push({
    id: generateID(),
    name: nameLaunch,
    amount: Number(valueLaunch),
  });
};

const cleanInputs = (nameLaunch, valueLaunch) => {
  nameLaunch.value = '';
  valueLaunch.value = '';
};

const handlerFormSubmit = (event) => {
  event.preventDefault();

  const nameLaunch = document.forms.createInvoice.nameLaunch.value.trim();
  const valueLaunch = document.forms.createInvoice.valueLaunch.value.trim();

  if (nameLaunch === '' || valueLaunch === '') {
    alert('Por favor preencha o nome e o valor da transação');
    return;
  }

  addToTransactionArray(nameLaunch, valueLaunch);

  init();
  updateLocalStorage();
  cleanInputs(nameLaunch, valueLaunch);
};

form.addEventListener('submit', handlerFormSubmit);
