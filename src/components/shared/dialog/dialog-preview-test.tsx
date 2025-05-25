import { Eye } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerNavbar,
  DrawerTrigger
} from '@/components/ui/drawer'

const DialogPreviewTest = () => {
  const [open, setOpen] = useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'outline'}>
          <Eye /> Preview
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <DrawerNavbar onBack={() => setOpen(false)} title="Preview Test" />
      </DrawerContent>
    </Drawer>
  )
}

export default DialogPreviewTest
