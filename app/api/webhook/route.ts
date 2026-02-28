import {
  getUserIdByCustomer,
  getUserPlan,
  revokeUserPlan,
  saveUserPlanDetails
} from '@/lib/actions/user-premium'
import { currentPlanName } from '@/lib/utils/pricing-plans'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover'
})
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()

  const signature = (await headers()).get('stripe-signature')

  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret')
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        )
        const userId = session.client_reference_id

        if (!userId) {
          console.error(
            'No client_reference_id (userId) found in session. User may not have been logged in during checkout.'
          )
          return NextResponse.json(
            { error: 'Missing client_reference_id' },
            { status: 400 }
          )
        }

        console.log('userId', userId)

        const priceId = lineItems.data[0]?.price?.id
        const planName = currentPlanName(priceId || '')
        const userEmail =
          session.customer_details?.email || session.metadata?.email
        const userName = session.customer_details?.name || 'User'

        if (userEmail) {
          await saveUserPlanDetails({
            email: userEmail,
            name: userName || '',
            priceId: priceId || '',
            planName,
            phoneNumber: session.customer_details?.phone || '',
            isActive: true,
            customerId: session.customer as string,
            userId
          })
          console.log(`Premium access granted for user ${userEmail}`)
        } else {
          console.error('No email found in session')
        }
        //Send here mail so that user can know payment is successfull
        break
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer
        const customerId = customer.id

        const userId = await getUserIdByCustomer(customerId)

        if (userId) {
          const existingData = await getUserPlan(userId)

          if (existingData) {
            await saveUserPlanDetails({
              ...existingData,
              email: customer.email || existingData.email || '',
              name: customer.name || existingData.name || '',
              phoneNumber: customer.phone || existingData.phoneNumber || ''
            })
            console.log(
              `Updated customer details for user ${existingData.email}`
            )
          } else {
            console.error(
              `Could not find existing premium data for userId: ${userId} during customer.updated`
            )
          }
        } else {
          console.error(
            `Could not find userId for customer: ${customerId} during customer.updated`
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id
        const planName = currentPlanName(priceId)
        console.log('Running this event')

        const userId = await getUserIdByCustomer(customerId)

        if (userId) {
          const existingData = await getUserPlan(userId)
          console.log('existingData', existingData)

          if (existingData) {
            await saveUserPlanDetails({
              ...existingData,
              priceId: priceId,
              planName: planName,
              isActive: true
            })

            console.log('updated data:', {
              ...existingData,
              priceId: priceId,
              planName: planName,
              isActive: true
            })
            console.log(
              `Updated premium plan to ${planName} for user ${existingData.email}`
            )
          } else {
            console.error(
              `Could not find existing premium data for userId: ${userId}`
            )
          }
        } else {
          console.error(`Could not find userId for customer: ${customerId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        let userEmail = subscription.metadata?.email

        if (!userEmail && customerId) {
          const mappedEmail = await getUserIdByCustomer(customerId)
          if (mappedEmail) {
            userEmail = mappedEmail
          }
        }

        if (userEmail) {
          await revokeUserPlan(userEmail)
          console.log(
            `Revoked premium access for user ${userEmail} (customer: ${customerId})`
          )
        } else {
          console.error(
            `Could not find email for subscription deletion. Customer: ${customerId}`
          )
        }

        break
      }

      default:
      // Unhandled event type
    }
  } catch (e: any) {
    console.error('stripe error: ' + e.message + ' | EVENT TYPE: ' + event.type)
  }

  return NextResponse.json({})
}
