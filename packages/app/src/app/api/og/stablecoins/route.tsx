import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(45deg, #1e1e1e 0%, #0a0a0a 50%, #1e1e1e 100%)',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              border: '3px solid #3b82f6',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#3b82f6',
              }}
            >
              S
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 16px 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            All Solana Stablecoins
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '24px',
              color: '#9ca3af',
              margin: '0 0 40px 0',
              maxWidth: '600px',
            }}
          >
            Browse and compare all stablecoins on the Solana blockchain
          </p>

          {/* Stablecoin Icons */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['USDC', 'USDT', 'PYUSD', 'FDUSD', 'USDY', 'USDS'].map((token) => (
              <div
                key={token}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '40px',
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #374151',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                {token}
              </div>
            ))}
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  color: '#3b82f6',
                  marginBottom: '4px',
                }}
              >
                Filter by Currency
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                }}
              >
                USD, EUR, GBP, etc.
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  color: '#10b981',
                  marginBottom: '4px',
                }}
              >
                Sort & Compare
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                }}
              >
                Market cap, volume
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(147, 51, 234, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  color: '#8b5cf6',
                  marginBottom: '4px',
                }}
              >
                Real-time Data
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                }}
              >
                Live prices & metrics
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#6b7280',
              fontSize: '20px',
            }}
          >
            <span>StableView</span>
            <span>•</span>
            <span>Solana Analytics</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
