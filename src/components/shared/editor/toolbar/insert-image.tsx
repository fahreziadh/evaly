import { Editor } from '@tiptap/core'
import { ImagePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { uploadFn } from '../editor.image-upload'

interface Props {
  editor: Editor
  loading?: boolean
}

const InsertImage = ({ editor, loading }: Props) => {
  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        const pos = editor.view.state.selection.from
        uploadFn(file, editor.view, pos)
      }
    }
    input.click()
  }

  return (
    <div>
      <Button
        type="button"
        size={'icon-sm'}
        disabled={loading}
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        onClick={handleClick}
      >
        <ImagePlus size={16} />
      </Button>
    </div>
  )
}

export default InsertImage
