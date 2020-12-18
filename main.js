'use strict'

class Calculator {
	constructor() {
		this.result = null;
		this.express = ''
		this.memory = {
			result: ''
		},
			this.calcStatus = false
		this.operStatus = false
		this.resStatus = false
		this.expressBuffer = ''
	}

	express() {
		return this.express
	}

	memRes() {
		return this.memory.result
	}

	formatNumber(number) { //func for cut number to 10 symbols after dot
		let formattedNumber = number.toString()
		if (formattedNumber.indexOf('.') !== -1) {
			return formattedNumber.substr(0, formattedNumber.indexOf('.') + 11)
		} else {
			return formattedNumber
		}
	}

	myEval(arr) {
		let indMulti = arr.indexOf("*")
		let indDel = arr.indexOf("/")
		let indPlus = arr.indexOf("+")
		let indMinus = arr.indexOf("-")
		let newNumber = null
		if (arr.indexOf('Infinity') === -1) {

			if (indMulti !== -1 && indDel !== -1) { //div and mult
				if (indMulti < indDel) { //mult
					newNumber = arr[indMulti - 1] * arr[indMulti + 1]
					arr.splice(indMulti - 1, 3) //delete of two numbers and operator between them
					arr.splice(indMulti - 1, 0, `${newNumber}`) //insert of one new number insted of two num and oper
				} else {
					newNumber = arr[indDel - 1] / arr[indDel + 1]
					newNumber = this.formatNumber(newNumber)
					arr.splice(indDel - 1, 3)
					arr.splice(indDel - 1, 0, `${newNumber}`)
				}
			} else if (indMulti !== -1 && indDel === -1) { //mult
				newNumber = arr[indMulti - 1] * arr[indMulti + 1]
				arr.splice(indMulti - 1, 3)
				arr.splice(indMulti - 1, 0, `${newNumber}`)
			} else if (indMulti === -1 && indDel !== -1) { //div
				newNumber = arr[indDel - 1] / arr[indDel + 1] //.toFixed(10)
				if (newNumber == 'Infinity') {
					return ['Infinity']
				}
				newNumber = this.formatNumber(newNumber)
				arr.splice(indDel - 1, 3)
				arr.splice(indDel - 1, 0, `${newNumber}`)
			} else if (indMulti == -1 && indDel == -1) { //addit and substr case check
				if (indMinus === -1) {
					newNumber = parseInt(arr[indPlus - 1]) + parseInt(arr[indPlus + 1])
					arr.splice(indPlus - 1, 3)
					arr.splice(indPlus - 1, 0, `${newNumber}`)
				} else {
					newNumber = arr[indMinus - 1] - arr[indMinus + 1]
					arr.splice(indMinus - 1, 3)
					arr.splice(indMinus - 1, 0, `${newNumber}`)
				}
			}

			if (arr.length !== 1) {
				this.myEval(arr)
			} else {
				console.log("here", arr)
				return arr[0]
			}
			return arr[0]
		} else {
			return ['Infinity']
		}
	}

	parseExpress(str) {
		const arr = str.split(" ")
		if (arr.length === 1) {
			return arr[0]
		} else {
			return this.myEval(arr)
		}
	}

	resetCalc() {
		this.express = ''
		this.result = null;
		this.memory.result = null;
	}

	clearDisplay() {
		this.calcStatus = false
		displayInput.value = "0"
		this.express = ''
		this.result = null
	}

	compute() {
		if (this.express === '') {
			displayInput.value = "0"
		} else {
			if (this.expressBuffer === '') {
				this.expressBuffer = this.express
			}

			if (this.resStatus) {

				let expressBufferArr = this.expressBuffer.split(' ')

				expressBufferArr.shift() 
				console.log(expressBufferArr)
				console.log(expressBufferArr)
				let newExp = this.express + ` ${expressBufferArr.join(' ')}`
				console.log(newExp)

				this.express = this.parseExpress(newExp)
				this.result = parseInt(this.express)
			} else {
				this.express = this.parseExpress(this.express)
				this.result = parseInt(this.express)
			}
		}
		this.calcStatus = true
		this.resStatus = true
	}

	appendNumber(number) {
		if (this.resStatus) {
			console.log('here ')
			this.clearDisplay()
			this.express += number
			this.calcStatus = false
			this.resStatus = false
		} else {
			this.express += number
			this.calcStatus = false
		}
	}

	appendOperation(operation) {
		let arr = this.express.split(" ")

		if (arr[arr.length - 1] === '') { 
			arr.pop()
			arr.pop()
			operation === "x"
				? arr.push('* ')
				: arr.push(`${operation} `)
			this.express = arr.join(' ')
			this.calcStatus = false
			this.resStatus = false
		} else {
			operation === "x"
				? this.express += ' * '
				: this.express += ` ${operation} `
			this.calcStatus = false
			this.resStatus = false
		}
		this.expressBuffer = ''
	}

	saveInMemory() {
		if (this.calcStatus) {
			this.memory.result = this.express
			memoryIndicator.style.backgroundColor = 'green'
		}
	}

	readFromMemory() {
		if (this.memory.result) {
			this.express += this.memory.result
		}
	}

	clearMemory() {
		this.memory.result = ''
		memoryIndicator.style.backgroundColor = 'red'
	}

	clearAC() {
		this.calcStatus = false
		displayInput.value = "0"
		this.resetCalc()
		memoryIndicator.style.backgroundColor = 'red'
	}

	updateDisplay() {
		if (this.express == 'Infinity' || this.express == '-Infinity') {
			displayInput.value = "ERROR"
			this.resetCalc()
			this.calcStatus = false
		}
		else {
			displayInput.value = this.express
		}
	}

	checkForFirst() {
		if (this.express === '') {
			displayInput.value = 0
		}
	}
}

const numberButtons = document.querySelectorAll('.data-number')
const operationButtons = document.querySelectorAll('.data-operation')
const equalButton = document.querySelector('.data-equals')
const deleteButton = document.querySelector('.data-delete')
const allClearButton = document.querySelector('.data-all-clear')
const memoryButton = document.querySelector('.data-memory')
const memoryReadButton = document.querySelector('.data-memory-read')
const memoryClearButton = document.querySelector('.data-memory-clear')
const memoryIndicator = document.getElementById('memory-indicator')
const displayInput = document.getElementById('display')
const prevOperand = document.querySelector('.data-previous-operand')
const curOperand = document.querySelector('.data-current-operand')

const Calc = new Calculator()

numberButtons.forEach(button => {
	button.addEventListener('click', () => {
		Calc.appendNumber(button.value)
		Calc.updateDisplay()
	})
})

operationButtons.forEach(button => {
	button.addEventListener('click', () => {
		if (Calc.express !== '') {
			Calc.appendOperation(button.value)
			Calc.updateDisplay()
		}
	})
})

equalButton.addEventListener('click', button => {
	if (Calc.express !== '') {
		Calc.compute()
		Calc.updateDisplay()
	}
})

allClearButton.addEventListener('click', button => {
	if (Calc.express !== '') {
		Calc.clearAC()
	}
})

deleteButton.addEventListener('click', button => {
	if (Calc.express !== '') {
		Calc.clearDisplay()
	}
})

memoryButton.addEventListener('click', button => {
	if (Calc.express !== '') {
		Calc.saveInMemory()
		Calc.updateDisplay()
	}
})

memoryReadButton.addEventListener('click', button => {
	if (Calc.memRes() !== '') {
		Calc.readFromMemory()
		Calc.updateDisplay()
	}
})

memoryClearButton.addEventListener('click', button => {
	if (Calc.express !== '') {
		Calc.clearMemory()
		Calc.updateDisplay()
	}
})