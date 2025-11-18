import { Zap, Wifi, Smartphone, Home, Shield } from 'lucide-react'

export interface BankAccount {
  name: string
  type: string
  last4: string
}

export interface Bill {
  name: string
  provider: string
  payments: number
  icon: any
}

export interface BillData {
  name: string
  provider: string
  payments: number
}

export interface BoostData {
  bankAccounts: BankAccount[]
  bills: Bill[]
  periodMonths: number
  boostAmount: number
  completedAt: string
}

export const ELIGIBLE_BILLS: Bill[] = [
  { name: 'Electricity Bill', icon: Zap, provider: 'City Power Co.', payments: 24 },
  { name: 'Internet Service', icon: Wifi, provider: 'Broadband Plus', payments: 18 },
  { name: 'Mobile Phone', icon: Smartphone, provider: 'Telco Wireless', payments: 12 },
  { name: 'Rent Payment', icon: Home, provider: 'Property Management', payments: 6 },
  { name: 'Auto Insurance', icon: Shield, provider: 'Safe Auto Insurance', payments: 12 },
]

export function getCurrentScore(customerId: number): number {
  const scores = {
    1: 720,
    2: 680,
    3: 620,
  }
  return scores[customerId as keyof typeof scores] || 680
}

export function generatePeriodMonths(customerId: number | null): number {
  if (!customerId) return 9
  // Customer 1: 12-15 months, Customer 2: 9-12 months, Customer 3: 6-9 months
  const basePeriod = customerId === 1 ? 12 : customerId === 2 ? 9 : 6
  const randomOffset = Math.floor(Math.random() * 4)
  return basePeriod + randomOffset
}

export function calculateBoostAmount(bills: Bill[] | BillData[], periodMonths: number): number {
  const baseBoost = 10
  const billMultiplier = bills.length * 2
  const periodBonus = Math.floor(periodMonths / 3)
  return baseBoost + billMultiplier + periodBonus
}

export function getBillIcon(billName: string) {
  const bill = ELIGIBLE_BILLS.find(b => b.name === billName)
  return bill ? bill.icon : null
}

export function restoreBillsFromStorage(billData: BillData[]): Bill[] {
  return billData.map(data => {
    const originalBill = ELIGIBLE_BILLS.find(b => b.name === data.name)
    return {
      ...data,
      icon: originalBill?.icon || null,
    }
  })
}

