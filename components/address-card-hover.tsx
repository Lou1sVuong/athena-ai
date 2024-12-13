import { shortenAddress } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import React from 'react'
import clsx from 'clsx'
import { Copy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AddressCardHoverProps {
  address: string
  className?: string
}

export default function AddressCardHover({ address, className }: AddressCardHoverProps) {
  if (!address) {
    return <div>Invalid Address</div>
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      toast({
        description: 'Address copied to clipboard!'
      })
    })
  }

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger className={clsx('font-mono text-xs text-zinc-400 select-none', className)}>
          {shortenAddress(address)}
        </HoverCardTrigger>
        <HoverCardContent
          align='start'
          className='select-none flex items-center p-2 bg-background text-xs rounded shadow-lg border border-primary mt-2'
        >
          <span>{address}</span>
          <Copy className='ml-2 w-4 h-4 text-xs hover:text-foreground cursor-pointer' onClick={handleCopy} />
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
