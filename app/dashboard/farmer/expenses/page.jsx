'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ExpensesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
  })
  const [editingExpense, setEditingExpense] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
  })
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
    byCategory: {},
  })
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'farmer') {
      router.push('/')
    } else {
      fetchExpenses()
    }
  }, [status, session, router])

  const fetchExpenses = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type)
      if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category)

      const response = await fetch(`/api/expenses?${queryParams.toString()}`)
      const data = await response.json()
      if (data.success) {
        setExpenses(data.data)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingExpense ? '/api/expenses' : '/api/expenses'
      const method = editingExpense ? 'PUT' : 'POST'
      const body = editingExpense
        ? { id: editingExpense._id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save expense')
      }

      toast.success(`Expense ${editingExpense ? 'updated' : 'created'} successfully`)
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
      })
      setEditingExpense(null)
      setIsDialogOpen(false)
      fetchExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
      toast.error(`Failed to ${editingExpense ? 'update' : 'create'} expense`)
    }
  }

  const handleDelete = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      const response = await fetch(`/api/expenses?id=${expenseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      toast.success('Expense deleted successfully')
      fetchExpenses()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      ...expense,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
    })
    setIsDialogOpen(true)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyFilters = () => {
    fetchExpenses()
  }

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      category: 'all',
    })
    fetchExpenses()
  }

  const handleExport = async (format) => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type)
      if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category)
      queryParams.append('format', format)

      const response = await fetch(`/api/expenses/export?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to export expenses')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expenses.${format === 'excel' ? 'xlsx' : format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Expenses exported successfully as ${format === 'excel' ? 'Excel' : 'PDF'}`)
    } catch (error) {
      console.error('Error exporting expenses:', error)
      toast.error('Failed to export expenses')
    }
  }

  const handleNavigation = (section) => {
    setActiveSection(section)
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (session?.user?.role !== 'farmer') {
    return null
  }

  // Prepare data for charts
  const categoryData = Object.entries(summary.byCategory).map(([category, data]) => ({
    name: category,
    income: data.income,
    expense: data.expense,
  }))

  const pieData = [
    { name: 'Income', value: summary.totalIncome },
    { name: 'Expense', value: summary.totalExpense },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Bar */}
      <div className="mb-8">
        <nav className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <button
                  onClick={() => handleNavigation('overview')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    activeSection === 'overview'
                      ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleNavigation('entries')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    activeSection === 'entries'
                      ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  All Entries
                </button>
                <button
                  onClick={() => handleNavigation('analytics')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    activeSection === 'analytics'
                      ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => handleNavigation('reports')}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    activeSection === 'reports'
                      ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  Reports
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => handleExport('excel')}>
                    Export to Excel
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('pdf')}>
                    Export to PDF
                  </Button>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingExpense(null)
                        setFormData({
                          type: 'expense',
                          category: '',
                          amount: '',
                          date: format(new Date(), 'yyyy-MM-dd'),
                          description: '',
                        })
                        setIsDialogOpen(true)
                      }}>
                        Add New Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 p-6">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                          {editingExpense ? 'Edit Entry' : 'Add New Entry'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Type</label>
                            <Select
                              value={formData.type}
                              onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, type: value }))
                              }
                            >
                              <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 z-50">
                                <SelectItem value="income" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Income</SelectItem>
                                <SelectItem value="expense" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, category: value }))
                              }
                            >
                              <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 z-50">
                                <SelectItem value="seeds" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Seeds</SelectItem>
                                <SelectItem value="fertilizers" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Fertilizers</SelectItem>
                                <SelectItem value="pesticides" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Pesticides</SelectItem>
                                <SelectItem value="labor" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Labor</SelectItem>
                                <SelectItem value="machinery" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Machinery</SelectItem>
                                <SelectItem value="transport" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Transport</SelectItem>
                                <SelectItem value="irrigation" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Irrigation</SelectItem>
                                <SelectItem value="land_rent" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Land Rent</SelectItem>
                                <SelectItem value="crop_sales" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Crop Sales</SelectItem>
                                <SelectItem value="government_subsidies" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                  Government Subsidies
                                </SelectItem>
                                <SelectItem value="other" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</label>
                            <Input
                              type="number"
                              name="amount"
                              value={formData.amount}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                              placeholder="Enter amount"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Date</label>
                            <Input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 min-h-[100px]"
                            placeholder="Enter description"
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {editingExpense ? 'Update Entry' : 'Add Entry'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Overview Section */}
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                ₹{summary.totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                ₹{summary.totalExpense.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{summary.profit.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  width={500}
                  height={300}
                  data={categoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#00C49F" />
                  <Bar dataKey="expense" name="Expense" fill="#FF8042" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PieChart width={500} height={300}>
                  <Pie
                    data={pieData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reports Section */}
      <section id="reports" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reports</h2>
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => handleExport('excel')}>
                Export to Excel
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                Export to PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* All Entries Section */}
      <section id="entries">
        <h2 className="text-2xl font-bold mb-4">All Entries</h2>
        <Card>
          <CardHeader>
            <CardTitle>All Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="border-b">
                      <td className="py-2">
                        {format(new Date(expense.date), 'PPP')}
                      </td>
                      <td className="py-2 capitalize">{expense.type}</td>
                      <td className="py-2 capitalize">
                        {expense.category.replace('_', ' ')}
                      </td>
                      <td
                        className={`py-2 ${
                          expense.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-2">{expense.description}</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(expense._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
} 