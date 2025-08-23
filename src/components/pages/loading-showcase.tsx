import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Import all our loading components
import { LoadingSpinner } from "@/components/shared/loading-screen";
import {
  TestCardSkeleton,
  QuestionCardSkeleton,
  TableSkeleton,
  DashboardStatsSkeleton,
  FormSkeleton, NavigationSkeleton,
  ListItemSkeleton,
  TestResultsSkeleton,
  QuestionEditorSkeleton,
  GridSkeleton
} from "@/components/ui/skeleton-loaders";
import {
  LoadingDots,
  LoadingText,
  PulsingContainer,
  LoadingButton,
  RefreshButton,
  ContentPlaceholder, LoadingCard,
  LoadingProgress,
  SectionLoadingOverlay,
  SkeletonLines,
  LoadingStateWrapper
} from "@/components/ui/loading-states";
import { useLoading, useFormLoading, useAsyncButton } from "@/hooks/use-loading";

export function LoadingShowcase() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(45);
  const { loading, startLoading, stopLoading, withLoading } = useLoading();
  const { isSubmitting, submitWithLoading } = useFormLoading();
  
  const { isLoading: isButtonLoading, handleClick } = useAsyncButton(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  const handleAsyncOperation = async () => {
    await withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }, 'demo');
  };

  const handleFormSubmit = async () => {
    await submitWithLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Loading States Showcase</h1>
        <p className="text-gray-600">
          Comprehensive demonstration of all loading states and components available in the application.
        </p>
      </div>

      <Tabs defaultValue="components" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        {/* Basic Components */}
        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading Spinners & Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                </div>
                <Separator />
                <LoadingDots />
                <LoadingText text="Processing" />
                <LoadingText text="Saving changes" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button loading={true} loadingText="Saving...">
                  Save Changes
                </Button>
                <LoadingButton loading={isButtonLoading} loadingText="Processing...">
                  Async Button
                </LoadingButton>
                <Button onClick={handleClick} disabled={isButtonLoading}>
                  {isButtonLoading ? "Loading..." : "Click Me"}
                </Button>
                <RefreshButton onRefresh={() => {}} loading={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Placeholders</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentPlaceholder 
                  title="Loading data..." 
                  description="Please wait while we fetch your information"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress & Overlays</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LoadingProgress progress={progress} />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                  >
                    -10%
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                  >
                    +10%
                  </Button>
                </div>
                <Button 
                  onClick={() => {
                    setShowOverlay(true);
                    setTimeout(() => setShowOverlay(false), 3000);
                  }}
                >
                  Show Overlay (3s)
                </Button>
                <div className="relative h-32 border rounded-lg">
                  <div className="p-4">Sample content behind overlay</div>
                  <SectionLoadingOverlay 
                    visible={showOverlay} 
                    message="Processing request..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skeleton Loaders */}
        <TabsContent value="skeletons" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Card Skeletons</h3>
              <TestCardSkeleton />
              <QuestionCardSkeleton />
              <LoadingCard />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Skeletons</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Form Skeleton</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormSkeleton />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dashboard Skeletons</h3>
              <DashboardStatsSkeleton />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Navigation & Lists</h3>
              <Card>
                <CardContent className="p-4">
                  <NavigationSkeleton />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <ListItemSkeleton showAvatar />
                  <ListItemSkeleton showAvatar />
                  <ListItemSkeleton showAvatar />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-full space-y-4">
              <h3 className="text-lg font-semibold">Data Table</h3>
              <TableSkeleton rows={4} columns={5} />
            </div>

            <div className="col-span-full space-y-4">
              <h3 className="text-lg font-semibold">Complex Layouts</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="scale-75 origin-top-left">
                      <TestResultsSkeleton />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Question Editor Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuestionEditorSkeleton />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Interactive Examples */}
        <TabsContent value="interactive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hook Demos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button onClick={handleAsyncOperation} disabled={loading}>
                    {loading ? "Processing..." : "Start Async Operation"}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Uses useLoading hook with 3s delay
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleFormSubmit} 
                    loading={isSubmitting}
                    loadingText="Submitting..."
                  >
                    Submit Form
                  </Button>
                  <p className="text-sm text-gray-600">
                    Uses useFormLoading hook
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading State Wrapper</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadingStateWrapper
                  isLoading={loading}
                  data={loading ? null : "Sample data loaded!"}
                  loadingComponent={<SkeletonLines lines={3} />}
                >
                  {(data) => (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800">{data}</p>
                    </div>
                  )}
                </LoadingStateWrapper>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manual Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button size="sm" onClick={() => startLoading('manual')}>
                  Start Loading
                </Button>
                <Button size="sm" variant="outline" onClick={() => stopLoading('manual')}>
                  Stop Loading
                </Button>
              </div>
              
              <PulsingContainer isLoading={loading}>
                <div className="p-4 border rounded-lg">
                  This container pulses when loading state is active
                </div>
              </PulsingContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="prose max-w-none">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">When to use each loading state:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Skeleton Loaders:</strong> For predictable layouts (cards, tables, forms)</li>
                    <li><strong>Loading Spinners:</strong> For unpredictable content or quick operations</li>
                    <li><strong>Progress Bars:</strong> For operations with known duration/progress</li>
                    <li><strong>Loading Overlays:</strong> For section-specific loading without navigation</li>
                    <li><strong>Content Placeholders:</strong> For empty states with context</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Performance Tips:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Use skeleton loaders for perceived performance improvement</li>
                    <li>Add delays to prevent flash of loading states for fast operations</li>
                    <li>Use minimum duration for better UX on very fast operations</li>
                    <li>Batch loading states to prevent UI jumping</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grid of Different Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <GridSkeleton items={6} columns={3} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}