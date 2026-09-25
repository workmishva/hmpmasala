import 'server-only'
import { cache } from 'react'
import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'

export const getSettings = cache(async () => {
  await connectDB()
  let s = await Settings.findOne().lean()
  if (!s) {
    const newSettings = await Settings.create({
      paymentEnabled:              false,
      whatsappVerificationEnabled: true,
      whatsappNumber:              process.env.WHATSAPP_NUMBER ?? '',
      storeName:                   'HMP Masala',
    })
    s = newSettings.toObject ? newSettings.toObject() : newSettings
  }
  return {
    paymentEnabled:              s?.paymentEnabled              ?? false,
    whatsappVerificationEnabled: s?.whatsappVerificationEnabled ?? true,
    whatsappNumber:              s?.whatsappNumber              ?? '',
    storeName:                   s?.storeName                   ?? 'HMP Masala',
    darkModeEnabled:             s?.darkModeEnabled             ?? false,
    lastResetAt:                 s?.lastResetAt                 ?? null,
  }
})
