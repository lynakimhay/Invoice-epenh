// Initialize the invoice
document.addEventListener("DOMContentLoaded", () => {
  // Set current date
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("invoiceDate").value = today
  document.getElementById("signatureDate").textContent = formatDate(new Date())

  // Set due date (30 days from today)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30)
  document.getElementById("dueDate").value = dueDate.toISOString().split("T")[0]

  // Add event listeners for calculation
  addCalculationListeners()

  // Initial calculation
  calculateTotals()
})

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString("en-US", options)
}

function addCalculationListeners() {
  const table = document.getElementById("invoiceTable")
  table.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input") || e.target.classList.contains("rate-input")) {
      calculateRowTotal(e.target.closest("tr"))
      calculateTotals()
    }
  })
}

function calculateRowTotal(row) {
  const qtyInput = row.querySelector(".qty-input")
  const rateInput = row.querySelector(".rate-input")
  const amountCell = row.querySelector(".amount-cell")

  const qty = Number.parseFloat(qtyInput.value) || 0
  const rate = Number.parseFloat(rateInput.value) || 0
  const amount = qty * rate

  if (amount < 0) {
    amountCell.textContent = `($${Math.abs(amount).toFixed(2)})`
  } else {
    amountCell.textContent = `$${amount.toFixed(2)}`
  }
}

function calculateTotals() {
  const rows = document.querySelectorAll(".invoice-row")
  let subtotal = 0

  rows.forEach((row) => {
    const qtyInput = row.querySelector(".qty-input")
    const rateInput = row.querySelector(".rate-input")
    const qty = Number.parseFloat(qtyInput.value) || 0
    const rate = Number.parseFloat(rateInput.value) || 0
    const amount = qty * rate
    subtotal += amount
  })

  // Calculate deposit (60% of subtotal)
  const deposit = subtotal * 0.6

  // Calculate VAT (10% of deposit)
  const vat = deposit * 0.1

  // Calculate grand total
  const grandTotal = deposit + vat

  // Exchange rate (USD to Riel)
  const exchangeRate = 4019
  const grandTotalRiel = grandTotal * exchangeRate

  // Update display
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("deposit").textContent = `$${deposit.toFixed(2)}`
  document.getElementById("vat").textContent = `$${vat.toFixed(2)}`
  document.getElementById("grandTotal").textContent = `$${grandTotal.toFixed(2)}`
  document.getElementById("grandTotalRiel").textContent = `៛ ${grandTotalRiel.toLocaleString()}`
}

function addRow() {
  const tbody = document.getElementById("invoiceItems")
  const rowCount = tbody.children.length + 1
  const newRow = document.createElement("tr")
  newRow.className = "invoice-row"
  newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" class="item-input" placeholder="Enter item name"></td>
        <td><textarea class="desc-input" placeholder="Enter description"></textarea></td>
        <td><input type="number" class="qty-input" value="1" min="0"></td>
        <td><input type="number" class="rate-input" value="0.00" min="0" step="0.01"></td>
        <td class="amount-cell" style="margin-top:5px;">$0.00</td>
        <td class="no-print"><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
    `
  tbody.appendChild(newRow)
  calculateTotals()
}

function removeRow(button) {
  const row = button.closest("tr")
  row.remove()
  // Renumber rows
  const rows = document.querySelectorAll(".invoice-row")
  rows.forEach((row, index) => {
    row.children[0].textContent = index + 1
  })
  calculateTotals()
}

// Enhanced print functionality
function printInvoice() {
  // Hide any elements that shouldn't be printed
  const printControls = document.querySelector(".print-controls")
  if (printControls) {
    printControls.style.display = "none"
  }

  // Trigger print
  window.print()

  // Show controls again after print dialog
  setTimeout(() => {
    if (printControls) {
      printControls.style.display = "block"
    }
  }, 1000)
}

// Add keyboard shortcut for printing
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "p") {
    e.preventDefault()
    printInvoice()
  }
})