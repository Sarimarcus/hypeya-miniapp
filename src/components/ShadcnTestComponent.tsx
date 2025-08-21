import { Button } from "@/components/ui/button"

export default function ShadcnTestComponent() {
  return (
    <div className="container p-4 space-y-4">
      <h2 className="text-lg font-bold mb-4">Shadcn/ui Button Test</h2>
      
      <div className="grid gap-4">
        {/* Test different button variants */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Button Variants:</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
        
        {/* Test different button sizes */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Button Sizes:</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🔥</Button>
          </div>
        </div>
        
        {/* Test mobile-friendly button */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Mobile-Optimized:</p>
          <Button className="w-full min-h-[44px]" size="lg">
            Mobile-Friendly Touch Target
          </Button>
        </div>
      </div>
    </div>
  );
}
