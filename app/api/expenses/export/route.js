import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Expense from '@/models/expense'
import { format as dateFormat } from 'date-fns'
import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'farmer') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const exportFormat = searchParams.get('format') || 'excel'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const query = { farmer: session.user.id }
    if (startDate) query.date = { $gte: new Date(startDate) }
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) }
    if (type && type !== 'all') query.type = type
    if (category && category !== 'all') query.category = category

    const expenses = await Expense.find(query).sort({ date: -1 })

    if (exportFormat === 'excel') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Expenses')

      // Add headers
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Description', key: 'description', width: 30 },
      ]

      // Add data
      expenses.forEach((expense) => {
        worksheet.addRow({
          date: dateFormat(new Date(expense.date), 'yyyy-MM-dd'),
          type: expense.type.charAt(0).toUpperCase() + expense.type.slice(1),
          category: expense.category.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          amount: expense.amount,
          description: expense.description,
        })
      })

      // Add summary
      const totalIncome = expenses
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0)
      const totalExpense = expenses
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0)
      const profit = totalIncome - totalExpense

      worksheet.addRow({})
      worksheet.addRow({ date: 'Total Income:', amount: totalIncome })
      worksheet.addRow({ date: 'Total Expense:', amount: totalExpense })
      worksheet.addRow({ date: 'Profit/Loss:', amount: profit })

      // Style the summary rows
      const lastRow = worksheet.rowCount
      worksheet.getRow(lastRow - 2).font = { bold: true }
      worksheet.getRow(lastRow - 1).font = { bold: true }
      worksheet.getRow(lastRow).font = { bold: true }

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer()

      return new NextResponse(buffer, {
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=expenses.xlsx',
        },
      })
    } else {
      // PDF format
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(20)
      doc.text('Expense Report', 105, 20, { align: 'center' })

      // Add date range if specified
      let y = 30
      if (startDate || endDate) {
        doc.setFontSize(12)
        doc.text(
          `Date Range: ${startDate ? dateFormat(new Date(startDate), 'PPP') : 'Start'} to ${
            endDate ? dateFormat(new Date(endDate), 'PPP') : 'End'
          }`,
          14,
          y
        )
        y += 10
      }

      // Add filters if specified
      if (type || category) {
        doc.text('Filters:', 14, y)
        y += 7
        if (type && type !== 'all') {
          doc.text(`Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`, 20, y)
          y += 7
        }
        if (category && category !== 'all') {
          doc.text(`Category: ${category.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`, 20, y)
          y += 7
        }
      }

      // Prepare table data
      const tableData = expenses.map((expense) => [
        dateFormat(new Date(expense.date), 'yyyy-MM-dd'),
        expense.type.charAt(0).toUpperCase() + expense.type.slice(1),
        expense.category.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        `₹${expense.amount.toLocaleString()}`,
        expense.description,
      ])

      // Add table
      autoTable(doc, {
        startY: y + 10,
        head: [['Date', 'Type', 'Category', 'Amount', 'Description']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 20 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 80 },
        },
      })

      // Add summary
      const totalIncome = expenses
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0)
      const totalExpense = expenses
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0)
      const profit = totalIncome - totalExpense

      const finalY = doc.lastAutoTable.finalY || y + 10
      doc.setFontSize(12)
      doc.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 14, finalY + 20)
      doc.text(`Total Expense: ₹${totalExpense.toLocaleString()}`, 14, finalY + 30)
      doc.text(
        `Profit/Loss: ₹${profit.toLocaleString()} (${
          profit >= 0 ? 'Profit' : 'Loss'
        })`,
        14,
        finalY + 40
      )

      // Generate buffer
      const buffer = doc.output('arraybuffer')

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=expenses.pdf',
        },
      })
    }
  } catch (error) {
    console.error('Error exporting expenses:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to export expenses' },
      { status: 500 }
    )
  }
}