let totalSalary = 0;
let expenses = []; 
let myPieChart = null; 
let isUSD = false; 
let exchangeRate = 1; 

const salaryInput = document.getElementById('salary-input');
const setSalaryBtn = document.getElementById('set-salary-btn');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const displaySalary = document.getElementById('display-salary');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');
const expenseList = document.getElementById('expense-list');
const errorMsg = document.getElementById('error-msg');
const warningMsg = document.getElementById('warning-msg'); 
const downloadPdfBtn = document.getElementById('download-pdf-btn'); 
const currencyBtn = document.getElementById('currency-btn'); 
const ctx = document.getElementById('myChart'); 

function loadData() {
    const savedSalary = JSON.parse(localStorage.getItem('savedSalary'));
    const savedExpenses = JSON.parse(localStorage.getItem('savedExpenses'));
    if (savedSalary) totalSalary = savedSalary;
    if (savedExpenses) expenses = savedExpenses;
    updateUI(); 
}

function saveData() {
    localStorage.setItem('savedSalary', JSON.stringify(totalSalary));
    localStorage.setItem('savedExpenses', JSON.stringify(expenses));
}

function showError(message) {
    errorMsg.textContent = message;      
    errorMsg.classList.remove('hidden'); 
    setTimeout(() => errorMsg.classList.add('hidden'), 3000);
}

setSalaryBtn.addEventListener('click', () => {
    const salaryValue = parseFloat(salaryInput.value); 
    if (isNaN(salaryValue) || salaryValue <= 0) return showError("Valid positive salary required.");
    totalSalary = salaryValue; 
    updateUI(); 
});

addExpenseBtn.addEventListener('click', () => {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    
    if (name === "" || isNaN(amount) || amount <= 0) return showError("Valid expense name and amount required.");
    
    expenses.push({ name: name, amount: amount });
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    updateUI(); 
});

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateUI(); 
}

function updateUI() {
    let totalExpensesSum = 0;
    expenseList.innerHTML = '';
    
    const symbol = isUSD ? '$' : '₹';
    
    expenses.forEach((exp, index) => {
        totalExpensesSum += exp.amount; 
        const convertedAmount = (exp.amount * exchangeRate).toFixed(isUSD ? 2 : 0);
        
        const li = document.createElement('li');
        li.className = "flex justify-between items-center p-3 bg-white rounded shadow-sm border";

        li.innerHTML = `
            <span>${exp.name}</span> 
            <div class="flex items-center gap-4">
                <span class="font-bold text-red-500">${symbol}${convertedAmount}</span>
                <button onclick="deleteExpense(${index})" class="text-gray-600 hover:text-red-600 text-lg">🗑️</button>
            </div>
        `;
        expenseList.appendChild(li);
    });
    
    const remainingBalance = totalSalary - totalExpensesSum;
    
    if (totalSalary > 0 && remainingBalance < (totalSalary * 0.10)) {
        warningMsg.classList.remove('hidden');
        displayBalance.classList.replace('text-blue-700', 'text-red-600');
    } else {
        warningMsg.classList.add('hidden');
        displayBalance.classList.replace('text-red-600', 'text-blue-700');
    }
    
    displaySalary.textContent = `${symbol}${(totalSalary * exchangeRate).toFixed(isUSD ? 2 : 0)}`;
    displayExpenses.textContent = `${symbol}${(totalExpensesSum * exchangeRate).toFixed(isUSD ? 2 : 0)}`;
    displayBalance.textContent = `${symbol}${(remainingBalance * exchangeRate).toFixed(isUSD ? 2 : 0)}`;

    saveData(); 
    if (ctx) updateChart(remainingBalance, totalExpensesSum);
}

function updateChart(balance, expensesSum) {
    if (myPieChart) myPieChart.destroy();
    
    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Remaining Balance', 'Total Expenses'],
            datasets: [{
                data: [balance > 0 ? balance : 0, expensesSum],
                backgroundColor: ['#3b82f6', '#ef4444'],
            }]
        }
    });
}

currencyBtn.addEventListener('click', async () => {
    if (!isUSD) {
        currencyBtn.textContent = "⏳ Fetching Rate...";
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            
            exchangeRate = 1 / data.rates.INR; 
            isUSD = true;
            
            currencyBtn.textContent = "🔄 Revert to INR";
            currencyBtn.classList.replace('bg-yellow-500', 'bg-green-500');
            currencyBtn.classList.replace('hover:bg-yellow-600', 'hover:bg-green-600');
        } catch (error) {
            showError("API Error: Please check internet connection.");
            currencyBtn.textContent = "💵 Convert to USD";
        }
    } else {
        isUSD = false; 
        exchangeRate = 1;
        currencyBtn.textContent = "💵 Convert to USD";
        currencyBtn.classList.replace('bg-green-500', 'bg-yellow-500');
        currencyBtn.classList.replace('hover:bg-green-600', 'hover:bg-yellow-600');
    }
    updateUI(); 
});

downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const symbol = isUSD ? "$" : "INR ";

    doc.setFontSize(22);
    doc.text("Cash-Flow Tracker Report", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Total Salary: ${symbol} ${(totalSalary * exchangeRate).toFixed(2)}`, 20, 40);
    
    doc.text("Expense History:", 20, 60);
    let yPos = 70;
    let totalExp = 0;

    expenses.forEach((exp, index) => {
        const expAmount = (exp.amount * exchangeRate).toFixed(2);
        totalExp += exp.amount;
        doc.text(`${index + 1}. ${exp.name} : ${symbol} ${expAmount}`, 20, yPos);
        yPos += 10;
    });

    const finalBalance = ((totalSalary - totalExp) * exchangeRate).toFixed(2);
    doc.setFontSize(16);
    doc.text(`Remaining Balance: ${symbol} ${finalBalance}`, 20, yPos + 15);

    doc.save("CashFlow_Report.pdf");
});

// Start App
loadData();