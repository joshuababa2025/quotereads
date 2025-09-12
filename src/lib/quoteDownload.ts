interface DownloadQuoteParams {
  quote: string;
  author: string;
  category?: string;
  variant?: string;
}

export const downloadQuoteImage = (params: DownloadQuoteParams) => {
  const { quote, author, category = "INSPIRATION", variant = "blue" } = params;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Canvas dimensions
  canvas.width = 1080;
  canvas.height = 1080;

  // Background gradient based on variant
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  switch (variant) {
    case 'purple':
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#A855F7');
      break;
    case 'green':
      gradient.addColorStop(0, '#10B981');
      gradient.addColorStop(1, '#059669');
      break;
    case 'orange':
      gradient.addColorStop(0, '#F59E0B');
      gradient.addColorStop(1, '#D97706');
      break;
    case 'pink':
      gradient.addColorStop(0, '#EC4899');
      gradient.addColorStop(1, '#DB2777');
      break;
    case 'blue':
    default:
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#2563EB');
      break;
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bible-style heading at top
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // Generate random verse-like reference
  const randomChapter = Math.floor(Math.random() * 30) + 1;
  const randomVerse = Math.floor(Math.random() * 20) + 1;
  const endVerse = randomVerse + Math.floor(Math.random() * 10) + 1;
  const bibleReference = `${category.toUpperCase()} ${randomChapter}:${randomVerse}–${endVerse}`;
  
  ctx.fillText(bibleReference, canvas.width / 2, 80);

  // Main quote text in the middle
  ctx.fillStyle = 'white';
  ctx.font = 'bold 42px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Word wrap for quote
  const maxWidth = 900;
  const words = quote.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw quote lines
  const lineHeight = 55;
  const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  // Bottom attribution section
  const attributionY = canvas.height - 200;
  
  // Author name
  ctx.font = 'bold 32px serif';
  ctx.fillText(`— ${author}`, canvas.width / 2, attributionY);
  
  // Social handle
  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('@ANEWPORTALS', canvas.width / 2, attributionY + 50);
  
  // Website/Logo
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('QuoteReads.com', canvas.width / 2, attributionY + 90);

  // Download the image
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${author.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, 'image/png', 1.0);
};