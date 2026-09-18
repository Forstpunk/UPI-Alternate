export type TransactionStatus = 'success' | 'pending' | 'failed'

export interface Transaction {
  id: string
  upiId: string
  name: string
  amount: number
  chunks: number[]
  status: TransactionStatus
  timestamp: number
}

export interface Contact {
  id: string
  name: string
  upiId: string
  avatar?: string
}

export interface SplitBillParticipant {
  contactId: string
  name: string
  upiId: string
  amount: number
  paid: boolean
}

export interface SplitBill {
  id: string
  title: string
  totalAmount: number
  participants: SplitBillParticipant[]
  timestamp: number
}
