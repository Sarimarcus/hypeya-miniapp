import Image from "next/image";
import Link from "next/link";
import TestComponent from "@/components/TestComponent";
import MobileTestComponent from "@/components/MobileTestComponent";
import ShadcnTestComponent from "@/components/ShadcnTestComponent";
import ProjectStructureTest from "@/components/ProjectStructureTest";
import { TypeTest } from "@/components/test/TypeTest";
import { ApiConstantsTest } from "@/components/test/ApiConstantsTest";
import { WordPressApiTest } from "@/components/test/WordPressApiTest";
import { UiComponentsTest } from "@/components/test/UiComponentsTest";

export default function DevTestPage() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Development & Testing</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Main App
          </Link>
        </div>

        {/* Demo Pages */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Demo Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/mobile-ux"
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h3 className="font-medium mb-2">📱 Mobile UX Demo</h3>
              <p className="text-sm text-gray-600">
                Pull-to-refresh, swipe gestures, haptic feedback
              </p>
            </Link>
            <Link
              href="/performance"
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h3 className="font-medium mb-2">⚡ Performance Demo</h3>
              <p className="text-sm text-gray-600">
                Web Vitals monitoring, optimization
              </p>
            </Link>
            <Link
              href="/error-handling"
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h3 className="font-medium mb-2">🐛 Error Handling Demo</h3>
              <p className="text-sm text-gray-600">
                Error boundaries, error logging
              </p>
            </Link>
            <div className="p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <h3 className="font-medium mb-2">📄 Articles (Main App)</h3>
              <p className="text-sm text-gray-600">
                WordPress API integration
              </p>
            </div>
          </div>
        </div>

        {/* Test Components */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Development Tests</h2>
          <div className="space-y-4">
        
        <TestComponent message="Test Component" count={1} />
        
        <MobileTestComponent />
        
        <ShadcnTestComponent />
        
        <ProjectStructureTest />
        
        <TypeTest />
        
        <ApiConstantsTest />
        
        <WordPressApiTest />
        
        <UiComponentsTest />
        </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
