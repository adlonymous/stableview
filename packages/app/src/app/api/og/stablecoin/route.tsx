import { ImageResponse } from 'next/og';
import { fetchStablecoinBySlugWithFallback } from '@/lib/api';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const name = searchParams.get('name');
    const token = searchParams.get('token');
    const supply = searchParams.get('supply');
    const volume = searchParams.get('volume');

    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    let stablecoin;
    try {
      stablecoin = await fetchStablecoinBySlugWithFallback(slug);
    } catch (error) {
      // Fallback to provided parameters
      stablecoin = {
        name: name || 'Unknown Stablecoin',
        token: token || 'UNKNOWN',
        totalSupply: supply || '0',
        transactionVolume30d: volume || '0',
        logoUrl: null,
      };
    }

    const formatNumber = (num: string) => {
      const value = parseFloat(num);
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return value.toFixed(0);
    };

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
            {/* Logo or Token Symbol */}
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
                {stablecoin.token?.charAt(0) || 'S'}
              </span>
            </div>

            {/* Token Name and Symbol */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                {stablecoin.name}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#3b82f6',
                    backgroundColor: '#1e40af',
                    padding: '8px 16px',
                    borderRadius: '12px',
                  }}
                >
                  {stablecoin.token}
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    color: '#9ca3af',
                  }}
                >
                  Solana Stablecoin
                </span>
              </div>
            </div>

            {/* Stats */}
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
                }}
              >
                <span
                  style={{
                    fontSize: '24px',
                    color: '#9ca3af',
                    marginBottom: '8px',
                  }}
                >
                  Total Supply
                </span>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#10b981',
                  }}
                >
                  ${formatNumber(stablecoin.totalSupply)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '24px',
                    color: '#9ca3af',
                    marginBottom: '8px',
                  }}
                >
                  30D Volume
                </span>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#8b5cf6',
                  }}
                >
                  ${formatNumber(stablecoin.transactionVolume30d)}
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
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
