// Test file to verify our project structure and imports work
import { cn } from '@/lib';
import type { WordPressArticle, WordPressCategory } from '@/types/wordpress';

export default function ProjectStructureTest() {
  // Test that cn utility works
  const testClasses = cn("bg-blue-500", "text-white", "p-4");

  // Test TypeScript import (suppress unused variable warning)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _testArticle: WordPressArticle = {} as WordPressArticle;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _testCategory: WordPressCategory = {} as WordPressCategory;

  return (
    <div className={testClasses}>
      <h3 className="font-bold">Project Structure Test</h3>
      <p className="text-sm">✅ Directory structure created</p>
      <p className="text-sm">✅ Barrel exports working</p>
      <p className="text-sm">✅ WordPress API types defined</p>
      <p className="text-sm">✅ TypeScript imports working</p>
      <p className="text-sm">✅ Utility functions accessible</p>
    </div>
  );
}
