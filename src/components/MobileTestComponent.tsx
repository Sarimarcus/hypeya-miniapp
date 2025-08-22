export default function MobileTestComponent() {
  return (
    <div className="container">
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
        <h2 className="text-lg font-bold mb-2">Mobile-First Test</h2>
        <p className="text-sm mb-4">This component tests mobile-first responsive design.</p>

        {/* Test mobile breakpoints */}
        <div className="grid gap-2">
          <div className="bg-green-400 p-2 rounded text-xs xs:bg-yellow-400 sm:bg-red-400 md:bg-purple-400">
            <span className="xs:hidden">Default (under 375px)</span>
            <span className="hidden xs:inline sm:hidden">XS (375px+)</span>
            <span className="hidden sm:inline md:hidden">SM (425px+)</span>
            <span className="hidden md:inline">MD (768px+)</span>
          </div>

          {/* Test touch targets */}
          <button className="bg-white text-blue-500 px-4 py-3 rounded font-medium min-h-[44px]">
            Touch-friendly Button
          </button>

          {/* Test mobile spacing */}
          <div className="space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs">Compact mobile spacing</div>
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded text-sm">Medium mobile spacing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
