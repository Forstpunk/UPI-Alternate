import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Contact, Transaction } from './types'

const seedContacts: Contact[] = [
  { id: 'c1', name: 'Aarav Sharma', upiId: 'aarav.sharma@okaxis' },
  { id: 'c2', name: 'Priya Nair', upiId: 'priya.nair@okicici' },
  { id: 'c3', name: 'Rohan Mehta', upiId: 'rohan.mehta@oksbi' },
  { id: 'c4', name: 'Ananya Iyer', upiId: 'ananya.iyer@ybl' },
  { id: 'c5', name: 'Vikram Singh', upiId: 'vikram.singh@okhdfcbank' },
]

interface StoreState {
  balance: number
  transactions: Transaction[]
  contacts: Contact[]
  myUpiId: string
  myName: string
  addTransaction: (transaction: Transaction) => void
  deductBalance: (amount: number) => void
  getRecentTransactions: (count?: number) => Transaction[]
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      balance: 50000,
      transactions: [],
      contacts: seedContacts,
      myUpiId: 'you@okicici',
      myName: 'You',

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      deductBalance: (amount) =>
        set((state) => ({
          balance: state.balance - amount,
        })),

      getRecentTransactions: (count = 5) =>
        get()
          .transactions.slice()
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, count),
    }),
    {
      name: 'upi-split-store',
    }
  )
)
