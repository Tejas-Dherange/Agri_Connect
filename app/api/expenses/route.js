import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import Expense from "@/models/expense"

// Get all expenses for the logged-in farmer
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "farmer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let query = { farmer: session.user.id }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    // Add type filter if provided
    if (type) {
      query.type = type
    }

    // Add category filter if provided
    if (category) {
      query.category = category
    }

    const expenses = await Expense.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })

    // Calculate summary
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      profit: 0,
      byCategory: {},
    }

    expenses.forEach((expense) => {
      if (expense.type === "income") {
        summary.totalIncome += expense.amount
      } else {
        summary.totalExpense += expense.amount
      }

      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = {
          income: 0,
          expense: 0,
        }
      }

      summary.byCategory[expense.category][expense.type] += expense.amount
    })

    summary.profit = summary.totalIncome - summary.totalExpense

    return NextResponse.json({
      success: true,
      data: expenses,
      summary,
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching expenses" },
      { status: 500 }
    )
  }
}

// Create a new expense/income entry
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "farmer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    await dbConnect()

    const expense = await Expense.create({
      ...data,
      farmer: session.user.id,
    })

    return NextResponse.json(
      { success: true, data: expense },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { success: false, message: "Error creating expense" },
      { status: 500 }
    )
  }
}

// Update an existing expense/income entry
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "farmer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, ...data } = await req.json()
    await dbConnect()

    const expense = await Expense.findOneAndUpdate(
      { _id: id, farmer: session.user.id },
      { $set: data },
      { new: true }
    )

    if (!expense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: expense })
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json(
      { success: false, message: "Error updating expense" },
      { status: 500 }
    )
  }
}

// Delete an expense/income entry
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "farmer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Expense ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()
    const expense = await Expense.findOneAndDelete({
      _id: id,
      farmer: session.user.id,
    })

    if (!expense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json(
      { success: false, message: "Error deleting expense" },
      { status: 500 }
    )
  }
} 