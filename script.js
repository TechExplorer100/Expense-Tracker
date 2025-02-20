document.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
    document.getElementById("add-btn").addEventListener("click", addExpense);
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let myChart = null;

function addExpense() {
    let amount = parseFloat(document.getElementById("amount").value);
    let category = document.getElementById("category").value.trim();
    let date = document.getElementById("date").value;

    if (!amount || !category || !date) {
        alert("Please fill all fields!");
        return;
    }

    expenses.push({ amount, category, date });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";

    loadExpenses();
}

function loadExpenses() {
    let expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";
    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;
        expenseList.innerHTML += `
            <tr>
                <td>₹${exp.amount.toFixed(2)}</td>
                <td>${exp.category}</td>
                <td>${exp.date}</td>
                <td><button onclick="deleteExpense(${index})">X</button></td>
            </tr>
        `;
    });

    document.getElementById("total-expense").innerHTML = `<strong>Total Expense: ₹${total.toFixed(2)}</strong>`;
    updateChart();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

function updateChart() {
    if (!expenses.length) {
        if (myChart) {
            myChart.destroy();
        }
        return;
    }

    let categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    let labels = Object.keys(categoryTotals);
    let data = Object.values(categoryTotals);

    let ctx = document.getElementById("expenseChart").getContext("2d");

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses by Category",
                data: data,
                backgroundColor: ["red", "blue", "green", "yellow", "purple", "violet", "black", "indigo", "pink", "orange", "gray", "lime", "ivory", "olive", "brown", "gold", "aliceblue", "seagreen"],
            }]
        }
    });
}