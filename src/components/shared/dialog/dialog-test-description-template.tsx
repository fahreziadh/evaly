import { BookDashed } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DialogTestDescriptionTemplate = ({
  className,
  onSelect
}: {
  className?: string
  onSelect?: (template: string) => void
}) => {
  const [tabs, setTabs] = useState<'short' | 'long'>('short')
  const [open, setOpen] = useState(false)
  const onSelectTemplate = (template: string) => {
    onSelect?.(template)
    setOpen(false)
  }

  const templateList = useMemo(() => {
    return tabs === 'short' ? TemplateListShort : TemplateListLong
  }, [tabs])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'} className={className}>
          <BookDashed /> Use template
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Template for Test Description</DialogTitle>
          <div>
            <p className="text-muted-foreground text-sm">
              Choose a template to help you create a test description.
            </p>
            <Tabs
              value={tabs}
              onValueChange={value => setTabs(value as 'short' | 'long')}
            >
              <TabsList className="mt-4">
                <TabsTrigger value="short">Compact</TabsTrigger>
                <TabsTrigger value="long">Detailed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="flex flex-col gap-4">
            {templateList.map(template => (
              <Card
                key={template.title}
                className="flex flex-col gap-2 overflow-y-auto"
              >
                <CardHeader>
                  <CardTitle>
                    <Badge variant={'secondary'}>{template.title}</Badge>
                  </CardTitle>
                  <CardDescription className="">
                    <div
                      className="prose prose-sm prose-neutral dark:prose-invert overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: template.content }}
                    />
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => onSelectTemplate(template.content)}
                    variant={'default'}
                    size={'sm'}
                    className={className}
                  >
                    Use template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const TemplateListShort: { title: string; content: string }[] = [
  {
    title: 'Tech Skills Assessment',
    content: `
        <h2>Technical Skills Assessment</h2>
        <p>
          This assessment evaluates your proficiency in <strong>[technology/language]</strong> through a series of 
          <strong>[number]</strong> questions covering <strong>[topic 1]</strong>, <strong>[topic 2]</strong>, and <strong>[topic 3]</strong>. 
          You will have <strong>[time]</strong> minutes to complete this assessment. The difficulty level is set to 
          <strong>[beginner/intermediate/advanced]</strong>. Your results will help us understand your technical capabilities in 
          <strong>[specific skill area]</strong>.
        </p>
      `
  },
  {
    title: 'Academic Knowledge Test',
    content: `
        <h2>Academic Knowledge Test</h2>
        <p>
          This <strong>[subject]</strong> assessment contains <strong>[number]</strong> questions designed to evaluate your understanding of 
          <strong>[concept 1]</strong>, <strong>[concept 2]</strong>, and <strong>[concept 3]</strong>. You have <strong>[time]</strong> minutes to complete this test. 
          This assessment is aligned with <strong>[curriculum/standard]</strong> for <strong>[grade/level]</strong> students. Your score will be used to 
          <strong>[purpose of assessment]</strong>.
        </p>
      `
  },
  {
    title: 'Job Candidate Evaluation',
    content: `
        <h2>Job Candidate Screening</h2>
        <p>
          This assessment is designed to evaluate candidates for the <strong>[job title]</strong> position at <strong>[company name]</strong>. 
          It contains <strong>[number]</strong> questions focused on <strong>[skill 1]</strong>, <strong>[skill 2]</strong>, and <strong>[skill 3]</strong>, 
          which are essential for success in this role. You have <strong>[time]</strong> minutes to complete this assessment. 
          Your responses will be evaluated based on <strong>[evaluation criteria]</strong> and will be used as part of our hiring decision process.
        </p>
      `
  },
  {
    title: 'Certification Exam Prep',
    content: `
        <h2>Certification Preparation Test</h2>
        <p>
          This practice assessment simulates the official <strong>[certification name]</strong> exam. It includes <strong>[number]</strong> questions covering the exam objectives: 
          <strong>[objective 1]</strong>, <strong>[objective 2]</strong>, and <strong>[objective 3]</strong>. You have <strong>[time]</strong> minutes to complete this test. 
          Upon completion, you'll receive detailed feedback on your performance in each domain to help you prepare for the actual certification exam.
        </p>
      `
  },
  {
    title: 'Team Skills Analysis',
    content: `
        <h2>Team Skills Gap Analysis</h2>
        <p>
          This internal skills assessment for the <strong>[department/team]</strong> team evaluates proficiency in <strong>[skill area 1]</strong>, 
          <strong>[skill area 2]</strong>, and <strong>[skill area 3]</strong>. The assessment contains <strong>[number]</strong> questions and takes approximately 
          <strong>[time]</strong> minutes to complete. Results will be used to identify training opportunities and optimize resource allocation. 
          All responses are confidential and will be used solely for team development purposes.
        </p>
      `
  },
  {
    title: 'Product Knowledge Check',
    content: `
        <h2>Customer Product Knowledge Quiz</h2>
        <p>
          This quick assessment tests your understanding of <strong>[product/service]</strong> features and benefits. It includes 
          <strong>[number]</strong> questions about <strong>[feature 1]</strong>, <strong>[feature 2]</strong>, and <strong>[usage scenarios]</strong>. 
          The assessment takes approximately <strong>[time]</strong> minutes to complete. Your results will help us provide you with tailored information and support 
          to maximize the value you receive from <strong>[product/service]</strong>.
        </p>
      `
  }
]

const TemplateListLong: { title: string; content: string }[] = [
  {
    title: 'Tech Skills Assessment (Detailed)',
    content: `
        <h2>Comprehensive Technical Skills Assessment</h2>
        <p>
          This in-depth assessment is designed to evaluate your proficiency and expertise in <strong>[technology/language]</strong> 
          through a comprehensive series of <strong>[number]</strong> questions. The assessment covers multiple domains including:
        </p>
        <ul>
          <li><strong>[topic 1]</strong> - Testing your understanding of core concepts and fundamentals</li>
          <li><strong>[topic 2]</strong> - Evaluating your ability to implement advanced techniques</li>
          <li><strong>[topic 3]</strong> - Assessing your problem-solving capabilities in real-world scenarios</li>
          <li><strong>[topic 4]</strong> - Measuring your knowledge of best practices and optimization strategies</li>
        </ul>
        <p>
          You will have <strong>[time]</strong> minutes to complete this assessment. The difficulty level is calibrated for 
          <strong>[beginner/intermediate/advanced]</strong> practitioners with at least <strong>[X]</strong> years of experience.
        </p>
        <p>
          Your results will be analyzed to create a detailed profile of your technical capabilities in <strong>[specific skill area]</strong>,
          highlighting both strengths and areas for potential growth. This assessment has been developed in collaboration with industry experts
          and follows current best practices in <strong>[technology/language]</strong> development.
        </p>
      `
  },
  {
    title: 'Academic Knowledge Test (Detailed)',
    content: `
        <h2>Advanced Academic Knowledge Evaluation</h2>
        <p>
          This comprehensive <strong>[subject]</strong> assessment has been carefully designed to provide an in-depth evaluation of your 
          understanding and mastery of key concepts and principles. The assessment contains <strong>[number]</strong> questions of varying 
          difficulty levels, structured to progressively test deeper levels of knowledge.
        </p>
        <p>
          The assessment covers the following core areas:
        </p>
        <ul>
          <li><strong>[concept 1]</strong> - Including theoretical foundations and practical applications</li>
          <li><strong>[concept 2]</strong> - Testing both recall of facts and analytical reasoning</li>
          <li><strong>[concept 3]</strong> - Evaluating your ability to synthesize information and apply it to novel situations</li>
          <li><strong>[concept 4]</strong> - Assessing your understanding of advanced principles and methodologies</li>
        </ul>
        <p>
          You have <strong>[time]</strong> minutes to complete this assessment. The questions are aligned with <strong>[curriculum/standard]</strong> 
          for <strong>[grade/level]</strong> students and incorporate the latest developments in the field.
        </p>
        <p>
          Upon completion, you will receive a detailed breakdown of your performance across different knowledge domains, with specific 
          recommendations for further study. Your results will be used to <strong>[purpose of assessment]</strong> and to create a 
          personalized learning pathway tailored to your specific needs.
        </p>
      `
  },
  {
    title: 'Job Candidate Evaluation (Detailed)',
    content: `
        <h2>Detailed Job Candidate Assessment</h2>
        <p>
          This comprehensive assessment has been specifically designed to evaluate candidates for the <strong>[job title]</strong> position 
          at <strong>[company name]</strong>. It represents a critical component of our selection process, aimed at identifying candidates 
          who possess both the technical skills and soft competencies required for success in this role.
        </p>
        <p>
          The assessment contains <strong>[number]</strong> questions divided into several key competency areas:
        </p>
        <ul>
          <li><strong>[skill 1]</strong> - Testing your proficiency in core technical requirements</li>
          <li><strong>[skill 2]</strong> - Evaluating your problem-solving approach and methodology</li>
          <li><strong>[skill 3]</strong> - Assessing your ability to apply knowledge in practical scenarios</li>
          <li><strong>[skill 4]</strong> - Measuring your understanding of industry best practices</li>
          <li><strong>[skill 5]</strong> - Evaluating relevant soft skills such as communication and teamwork</li>
        </ul>
        <p>
          You have <strong>[time]</strong> minutes to complete this assessment. We recommend allocating your time strategically across 
          different sections based on your strengths and areas of expertise.
        </p>
        <p>
          Your responses will be evaluated based on <strong>[evaluation criteria]</strong> by a panel of experienced professionals. 
          The results will be considered alongside your resume, interviews, and other application materials to make a holistic hiring decision.
          All candidates will receive feedback on their performance regardless of the outcome.
        </p>
      `
  },
  {
    title: 'Certification Exam Prep (Detailed)',
    content: `
        <h2>In-Depth Certification Preparation Assessment</h2>
        <p>
          This comprehensive practice assessment has been meticulously designed to simulate the official <strong>[certification name]</strong> 
          examination in both content and format. It serves as an invaluable preparation tool for candidates planning to pursue this 
          industry-recognized credential.
        </p>
        <p>
          The assessment includes <strong>[number]</strong> questions covering all domains of the official exam blueprint:
        </p>
        <ul>
          <li><strong>[objective 1]</strong> (<strong>[percentage]%</strong> of exam) - Including sub-topics such as <strong>[sub-topic 1.1]</strong>, <strong>[sub-topic 1.2]</strong>, and <strong>[sub-topic 1.3]</strong></li>
          <li><strong>[objective 2]</strong> (<strong>[percentage]%</strong> of exam) - Covering key concepts like <strong>[concept 2.1]</strong> and <strong>[concept 2.2]</strong></li>
          <li><strong>[objective 3]</strong> (<strong>[percentage]%</strong> of exam) - Testing practical implementation of <strong>[skill 3.1]</strong> and <strong>[skill 3.2]</strong></li>
          <li><strong>[objective 4]</strong> (<strong>[percentage]%</strong> of exam) - Evaluating advanced knowledge of <strong>[topic 4.1]</strong> and <strong>[topic 4.2]</strong></li>
        </ul>
        <p>
          You have <strong>[time]</strong> minutes to complete this test, matching the timing constraints of the actual certification exam. 
          The question formats include multiple choice, scenario-based problems, and simulations that mirror those you will encounter in the 
          official examination.
        </p>
        <p>
          Upon completion, you'll receive a comprehensive performance analysis that includes:
        </p>
        <ul>
          <li>Your overall score and pass/fail indication based on the current certification threshold</li>
          <li>Detailed breakdown of performance by domain and sub-domain</li>
          <li>Specific knowledge gaps identified for further study</li>
          <li>Personalized recommendations for additional resources and practice materials</li>
          <li>Comparative analysis with other certification candidates (anonymized)</li>
        </ul>
        <p>
          This practice exam has been developed by certified professionals with extensive experience in <strong>[field]</strong> and is 
          regularly updated to reflect the latest changes to the certification requirements.
        </p>
      `
  },
  {
    title: 'Team Skills Analysis (Detailed)',
    content: `
        <h2>Detailed Team Competency Assessment</h2>
        <p>
          This comprehensive internal skills assessment for the <strong>[department/team]</strong> team has been developed as part of our 
          ongoing commitment to professional development and organizational excellence. The assessment is designed to provide a detailed 
          mapping of both individual and collective competencies across key operational areas.
        </p>
        <p>
          The assessment evaluates proficiency across multiple dimensions:
        </p>
        <ul>
          <li><strong>[skill area 1]</strong> - Including technical capabilities, theoretical knowledge, and practical application</li>
          <li><strong>[skill area 2]</strong> - Assessing both foundational understanding and advanced implementation techniques</li>
          <li><strong>[skill area 3]</strong> - Evaluating problem-solving approaches and methodological rigor</li>
          <li><strong>[skill area 4]</strong> - Measuring collaboration capabilities and cross-functional knowledge</li>
          <li><strong>[skill area 5]</strong> - Assessing awareness of industry trends and emerging best practices</li>
        </ul>
        <p>
          The assessment contains <strong>[number]</strong> questions and takes approximately <strong>[time]</strong> minutes to complete. 
          It includes a mix of technical questions, scenario-based problems, self-evaluation components, and open-ended responses to 
          capture both quantitative and qualitative insights.
        </p>
        <p>
          Results from this assessment will be used to:
        </p>
        <ul>
          <li>Identify individual and team-wide training opportunities</li>
          <li>Optimize resource allocation and project assignments</li>
          <li>Develop targeted professional development plans</li>
          <li>Inform strategic hiring decisions to complement existing team capabilities</li>
          <li>Benchmark internal capabilities against industry standards</li>
        </ul>
        <p>
          All responses are strictly confidential and will be used solely for team development purposes. Individual results will only be 
          shared with the respective team member and their direct manager. Aggregated, anonymized data will be used for team-level analysis 
          and planning.
        </p>
      `
  },
  {
    title: 'Product Knowledge Check (Detailed)',
    content: `
        <h2>In-Depth Customer Product Knowledge Assessment</h2>
        <p>
          This comprehensive assessment has been designed to thoroughly evaluate your understanding of <strong>[product/service]</strong> 
          and its ecosystem. Whether you're a new user seeking to expand your knowledge or an experienced user aiming to discover advanced 
          capabilities, this assessment will help identify your current proficiency level and opportunities for further learning.
        </p>
        <p>
          The assessment includes <strong>[number]</strong> questions covering multiple aspects of the product:
        </p>
        <ul>
          <li><strong>[feature 1]</strong> - Testing your understanding of core functionality and basic use cases</li>
          <li><strong>[feature 2]</strong> - Evaluating your knowledge of advanced features and customization options</li>
          <li><strong>[feature 3]</strong> - Assessing your familiarity with recent updates and new capabilities</li>
          <li><strong>[usage scenarios]</strong> - Measuring your ability to apply the product in different contexts</li>
          <li><strong>[integration capabilities]</strong> - Testing your knowledge of how the product works with other tools and systems</li>
          <li><strong>[troubleshooting]</strong> - Evaluating your ability to identify and resolve common issues</li>
        </ul>
        <p>
          The assessment takes approximately <strong>[time]</strong> minutes to complete. Questions are organized in increasing order of 
          complexity, allowing you to progress from fundamental concepts to more sophisticated applications.
        </p>
        <p>
          Upon completion, you will receive:
        </p>
        <ul>
          <li>A detailed proficiency score across different product domains</li>
          <li>Personalized recommendations for features you may not be fully utilizing</li>
          <li>Custom learning pathways based on your specific usage patterns and goals</li>
          <li>Access to relevant documentation, tutorials, and best practice guides</li>
          <li>Optional connection to a product specialist for areas where you might benefit from additional support</li>
        </ul>
        <p>
          Your results will help us provide you with tailored information and support to maximize the value you receive from 
          <strong>[product/service]</strong>. This assessment is part of our commitment to ensuring all users can leverage the full 
          potential of our solutions to address their specific needs.
        </p>
      `
  }
]

export default DialogTestDescriptionTemplate
