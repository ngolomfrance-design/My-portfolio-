import { Check, Copy, Download, QrCode, X } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import type { Language } from '../types/portfolio';

interface QrCodeModalProps {
  open: boolean;
  lang: Language;
  onClose: () => void;
}

export function QrCodeModal({ open, lang, onClose }: QrCodeModalProps) {
  const defaultUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-ps2tgbnezqczjm2pivzqld-555798568985.europe-west2.run.app';

  const [targetUrl, setTargetUrl] = useState(defaultUrl);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const urlToEncode = targetUrl.trim() || defaultUrl;
    QRCode.toDataURL(urlToEncode, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#101C35',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [open, targetUrl, defaultUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isFr = lang === 'fr';

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(targetUrl.trim() || defaultUrl).catch(() => {});
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'Sophie_Francette_Ngolom_Portfolio_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1426]/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#101C35] text-white">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            <h2 id="qr-modal-title" className="font-serif text-lg font-semibold">
              {isFr ? 'QR Code du Portfolio' : 'Portfolio QR Code'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isFr ? 'Fermer' : 'Close'}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Scannable QR Preview */}
          <div className="flex flex-col items-center justify-center bg-[#F4F5F7] rounded-xl p-6 border border-slate-200">
            {qrDataUrl ? (
              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                <img
                  src={qrDataUrl}
                  alt={
                    isFr
                      ? 'QR Code vers le portfolio de Sophie Francette Ngolom'
                      : 'QR Code for Sophie Francette Ngolom portfolio'
                  }
                  className="w-52 h-52 sm:w-56 sm:h-56 block"
                />
              </div>
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-xs text-[#687386]">
                {isFr ? 'Génération...' : 'Generating...'}
              </div>
            )}
            <p className="font-serif text-sm font-semibold text-[#101C35] mt-4">
              Sophie Francette Ngolom
            </p>
            <p className="text-xs text-[#687386]">DATA WORK AGENCY · Yaoundé</p>
          </div>

          {/* Editable Target URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="qr-target-url"
                className="text-xs font-semibold text-[#101C35]"
              >
                {isFr ? 'URL encodée dans le QR code' : 'Encoded URL'}
              </label>
              <button
                type="button"
                onClick={() => setTargetUrl(defaultUrl)}
                className="text-[11px] font-medium text-[#C5A46D] hover:underline cursor-pointer"
              >
                {isFr ? 'URL actuelle' : 'Current URL'}
              </button>
            </div>
            <input
              id="qr-target-url"
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm text-[#101C35] bg-[#F4F5F7] border border-slate-200 rounded-md focus:outline-none focus:border-[#C5A46D] focus:bg-white"
            />
            <p className="text-[11px] text-[#687386] leading-relaxed">
              {isFr
                ? 'Astuce : après avoir publié le site en accès public (bouton Déployer / Share en haut à droite), collez votre lien public ici pour télécharger le QR code définitif.'
                : 'Tip: after publishing your site publicly (via Deploy / Share at the top right), paste your public URL here to download the final QR code.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#101C35] hover:bg-[#1A2B4D] text-white rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              <span>{isFr ? 'Télécharger PNG' : 'Download PNG'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-slate-300 hover:border-[#C5A46D] text-[#101C35] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              )}
              <span>
                {copied
                  ? isFr
                    ? 'Copié'
                    : 'Copied'
                  : isFr
                    ? 'Copier le lien'
                    : 'Copy Link'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
