import { MiniKitStatus } from '@/components/web3';

export default function FrameMetadataDemo() {
  const frameMetadata = {
    version: 'next',
    imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
    button: {
      title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
      action: {
        type: 'launch_frame',
        name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
        url: process.env.NEXT_PUBLIC_URL,
        splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
        splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Frame Metadata Successfully Configured!
          </h1>
          <p className="text-xl text-gray-600">
            Your HYPEYA miniapp now supports rich embeds and MiniKit integration
          </p>
        </div>

        {/* MiniKit Status */}
        <div className="mb-8">
          <MiniKitStatus />
        </div>

        {/* Frame Metadata Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📋 Frame Metadata Configuration
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(frameMetadata, null, 2)}
            </pre>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              ✅ What&apos;s Working
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                Frame metadata in page head
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                Rich embeds with launch button
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                MiniKit environment detection
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                Farcaster integration ready
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">•</span>
                Social media preview optimization
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">
              🚀 How to Test
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">1.</span>
                <span>Share your app URL on Farcaster or Twitter</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">2.</span>
                <span>Open the URL in Coinbase Wallet mobile app</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">3.</span>
                <span>Check for &quot;Launch HYPEYA&quot; button in embeds</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">4.</span>
                <span>Verify MiniKit detection shows &quot;MiniKit Environment&quot;</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Environment Variables Used */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">
            🔧 Environment Variables in Use
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-700">Project Name:</strong>
              <br />
              <code className="bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}
              </code>
            </div>
            <div>
              <strong className="text-gray-700">App URL:</strong>
              <br />
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_URL}
              </code>
            </div>
            <div>
              <strong className="text-gray-700">Hero Image:</strong>
              <br />
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_APP_HERO_IMAGE}
              </code>
            </div>
            <div>
              <strong className="text-gray-700">Splash Image:</strong>
              <br />
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE}
              </code>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            🎯 Next Steps
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://docs.coinbase.com/minikit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📖 MiniKit Docs
            </a>
            <a
              href="https://www.coinbase.com/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📱 Get Coinbase Wallet
            </a>
            <a
              href="https://warpcast.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              🐦 Test on Farcaster
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
