'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'

import Submissions from './_components/(deprecated) submissions'
import Header from './_components/header'
import Questions from './_components/questions/questions'
import Setting from './_components/setting/setting'
import Share from './_components/share'
import { useTabsState } from './_hooks/use-tabs-state'

const PageClient = () => {
  const [tab, setTab] = useTabsState('questions')

  return (
    <Tabs
      className="dashboard-margin container min-h-dvh pb-10"
      defaultValue="questions"
      value={tab}
      onValueChange={setTab}
    >
      <Header className="mb-4" />
      <TabsContent value="settings">
        <Setting />
      </TabsContent>
      <TabsContent value="submissions">
        <Submissions />
      </TabsContent>
      <TabsContent value="questions">
        <Questions />
      </TabsContent>
      <TabsContent value="share">
        <Share />
      </TabsContent>
    </Tabs>
  )
}

export default PageClient
