// =====================================================================================
// HONEY CHAIN — QR Code Generation Utility
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import QRCode from 'qrcode';

/**
 * Generates an SVG string representation of a QR code pointing to public verification.
 */
export async function generateBatchQrCodeSvg(batchId: string, baseUrl?: string): Promise<string> {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const verifyUrl = `${host}/verify?id=${encodeURIComponent(batchId)}`;

  try {
    const svg = await QRCode.toString(verifyUrl, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#6B3F20', // Brand deep honey brown for high contrast and elegant branding
        light: '#FFFFFF',
      },
      width: 256,
      errorCorrectionLevel: 'M',
    });
    return svg;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    return '';
  }
}

/**
 * Generates a Data URL (base64 PNG) for direct image rendering and download.
 */
export async function generateBatchQrCodeDataUrl(batchId: string, baseUrl?: string): Promise<string> {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const verifyUrl = `${host}/verify?id=${encodeURIComponent(batchId)}`;

  try {
    return await QRCode.toDataURL(verifyUrl, {
      margin: 2,
      color: {
        dark: '#6B3F20',
        light: '#FFFFFF',
      },
      width: 400,
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Error generating QR code DataURL:', error);
    return '';
  }
}
