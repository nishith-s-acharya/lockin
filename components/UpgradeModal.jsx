"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { AlertCircle } from 'lucide-react'
import { PricingTable } from '@clerk/nextjs'

const UpgradeModal = ({ open, onOpenChange, reason }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"border-amber-200/10 min-w-[70vw] max-h-[90vh] overflow-y-scroll"}>
        <DialogHeader>
          <AlertCircle className='flex items-start gap-2 mb-2'/>
          <div>
            <DialogTitle className={"font-serif text-2xl"}>
              Upgrade Your Plan
            </DialogTitle>
            {reason ? (
              <DialogDescription className={"text-amber-400 mt-1"}>
                {reason}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                Choose a plan to upgrade your account
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        <div className='px-2 pb-6'>
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  }
                }
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpgradeModal;
