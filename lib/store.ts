import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Contact, SplitBill, Transaction } from './types'

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
  splitBills: SplitBill[]
  myUpiId: string
  myName: string
  addTransaction: (transaction: Transaction) => void
  deductBalance: (amount: number) => void
  getRecentTransactions: (count?: number) => Transaction[]
  addSplitBill: (bill: SplitBill) => void
  toggleParticipantPaid: (billId: string, contactId: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      balance: 50000,
      transactions: [],
      contacts: seedContacts,
      splitBills: [],
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

      addSplitBill: (bill) =>
        set((state) => ({
          splitBills: [bill, ...state.splitBills],
        })),

      toggleParticipantPaid: (billId, contactId) =>
        set((state) => ({
          splitBills: state.splitBills.map((bill) =>
            bill.id !== billId
              ? bill
              : {
                  ...bill,
                  participants: bill.participants.map((p) =>
                    p.contactId === contactId ? { ...p, paid: !p.paid } : p
                  ),
                }
          ),
        })),
    }),
    {
      name: 'upi-split-store',
    }
  )
)
