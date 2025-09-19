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
            background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
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
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 16px 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            StableView
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#9ca3af',
              margin: '0 0 40px 0',
              maxWidth: '600px',
            }}
          >
            Solana Stablecoin Dashboard
          </p>

          {/* Stats Grid */}
          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  color: '#3b82f6',
                  marginBottom: '8px',
                }}
              >
                Stablecoins
              </span>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                28+
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  color: '#10b981',
                  marginBottom: '8px',
                }}
              >
                Total Supply
              </span>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                $46.5B
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(147, 51, 234, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  color: '#8b5cf6',
                  marginBottom: '8px',
                }}
              >
                30D Volume
              </span>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                $82.5B
              </span>
            </div>
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginBottom: '40px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: '#6b7280',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                padding: '8px 16px',
                borderRadius: '20px',
              }}
            >
              Real-time Data
            </span>
            <span
              style={{
                fontSize: '18px',
                color: '#6b7280',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                padding: '8px 16px',
                borderRadius: '20px',
              }}
            >
              Analytics
            </span>
            <span
              style={{
                fontSize: '18px',
                color: '#6b7280',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                padding: '8px 16px',
                borderRadius: '20px',
              }}
            >
              Market Insights
            </span>
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
            <span>Track • Analyze • Monitor</span>
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
