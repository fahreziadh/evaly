import { useTranslations } from 'next-intl'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const ImportQuestions = () => {
  const t = useTranslations('Questions')

  return (
    <div className="flex flex-col border border-dashed p-4">
      <p className="font-medium">{t('importQuestions')}</p>
      <p className="text-muted-foreground mb-4">{t('uploadDocument')}</p>
      <div className="flex flex-row gap-2">
        <Input
          type="file"
          className="mt-2"
          accept=".pdf,.xlsx,.xls,.csv,.json,.docx,.doc,.txt,.md,.pptx,.ppt"
        />
        <Button className="mt-2">{t('upload')}</Button>
      </div>
      <div className="text-muted-foreground mt-4 flex flex-row flex-wrap space-x-2 text-sm">
        <Tooltip>
          <TooltipTrigger className="text-primary font-medium underline underline-offset-4">
            {t('supportedFormatsTitle')}
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('supportedFormats')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default ImportQuestions
