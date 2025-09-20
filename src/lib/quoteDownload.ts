interface DownloadQuoteParams {
  quote: string;
  author: string;
  category?: string;
  variant?: string;
  backgroundImage?: string;
}

export const downloadQuoteImage = (params: DownloadQuoteParams) => {
  const { quote, author, category = "INSPIRATION", variant = "blue", backgroundImage } = params;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Canvas dimensions
  canvas.width = 1080;
  canvas.height = 1080;

  // Background - use image if available, otherwise gradient
  if (backgroundImage) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Add dark overlay for text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Continue with text rendering
      renderTextContent();
    };
    img.src = backgroundImage;
    return; // Exit early, text will be rendered in onload
  } else {
    // Use default background image if no backgroundImage provided
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      renderTextContent();
    };
    img.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
    return;
  }

  // Render text content
  renderTextContent();

  function renderTextContent() {

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
  }
};