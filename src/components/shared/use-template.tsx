import { useTranslations } from 'next-intl'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const UseTemplate = () => {
  const t = useTranslations('Questions')
  return (
    <div className="flex flex-col border border-dashed p-4">
      <p className="font-medium">{t('useTemplate')}</p>
      <p className="text-muted-foreground mb-4">{t('uploadTemplateExcelFile')}</p>
      <div className="flex flex-row gap-2">
        <Input type="file" className="mt-2" accept=".xlsx,.xls" />
        <Button className="mt-2">{t('upload')}</Button>
      </div>
      <div className="mt-4">
        <Button variant="link" size="sm" className="p-0 underline underline-offset-4">
          {t('downloadTemplateExcel')}
        </Button>
      </div>
    </div>
  )
}

export default UseTemplate
