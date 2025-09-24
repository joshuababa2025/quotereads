# FRONTEND ADVERTISEMENT INTEGRATION GUIDE

## 📋 DATABASE QUERY FOR FRONTEND

### Get Active Advertisements
```sql
SELECT 
  id,
  title,
  content,
  image_url,
  link_url,
  cta_button_text,
  cta_button_url,
  position,
  click_count,
  view_count
FROM advertisements 
WHERE is_active = true 
  AND (end_date IS NULL OR end_date > NOW())
ORDER BY created_at DESC;
```

### JavaScript/React Query
```javascript
const { data: advertisements } = await supabase
  .from('advertisements')
  .select('id, title, content, image_url, link_url, cta_button_text, cta_button_url, position, click_count, view_count')
  .eq('is_active', true)
  .or('end_date.is.null,end_date.gt.' + new Date().toISOString());
```

## 🎨 FRONTEND COMPONENT STRUCTURE

### Advertisement Component
```jsx
function Advertisement({ ad }) {
  const handleClick = async (type) => {
    // Track clicks
    await supabase
      .from('advertisements')
      .update({ click_count: supabase.raw('click_count + 1') })
      .eq('id', ad.id);
  };

  const handleView = async () => {
    // Track views (call once when component mounts)
    await supabase
      .from('advertisements')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', ad.id);
  };

  return (
    <div className="advertisement-card">
      {/* Feature Image */}
      {ad.image_url && (
        <img 
          src={ad.image_url} 
          alt={ad.title}
          className="ad-image"
        />
      )}
      
      {/* Content */}
      <h3>{ad.title}</h3>
      <p>{ad.content}</p>
      
      {/* CTA Button */}
      {ad.cta_button_text && ad.cta_button_url && (
        <a 
          href={ad.cta_button_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick('cta')}
          className="cta-button"
        >
          {ad.cta_button_text}
        </a>
      )}
      
      {/* Optional: Image Link */}
      {ad.link_url && (
        <a 
          href={ad.link_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick('image')}
        >
          View More
        </a>
      )}
    </div>
  );
}
```

## 📍 ADVERTISEMENT POSITIONS

### Sidebar Advertisements
```javascript
// Get sidebar ads
const sidebarAds = advertisements.filter(ad => ad.position === 'sidebar');
```

### Header Advertisements  
```javascript
// Get header ads
const headerAds = advertisements.filter(ad => ad.position === 'header');
```

### Footer Advertisements
```javascript
// Get footer ads
const footerAds = advertisements.filter(ad => ad.position === 'footer');
```

## 🔗 EXAMPLE ADVERTISEMENT DATA

```json
{
  "id": "uuid-here",
  "title": "Quote of the Day App",
  "content": "Get daily inspiration on your phone",
  "image_url": "https://supabase-url/storage/v1/object/public/advertisement-images/ad-123.jpg",
  "link_url": null,
  "cta_button_text": "Download App",
  "cta_button_url": "https://play.google.com/store/apps/details?id=com.quoteapp",
  "position": "sidebar",
  "click_count": 45,
  "view_count": 1250
}
```

## 📊 CLICK TRACKING IMPLEMENTATION

### Track CTA Button Clicks
```javascript
const trackCTAClick = async (adId) => {
  await supabase.rpc('increment_ad_clicks', { ad_id: adId });
};
```

### Track Advertisement Views
```javascript
const trackAdView = async (adId) => {
  await supabase.rpc('increment_ad_views', { ad_id: adId });
};
```

### Database Functions (Run in Supabase)
```sql
-- Function to increment clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE advertisements 
  SET click_count = click_count + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_ad_views(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE advertisements 
  SET view_count = view_count + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;
```

## 🎯 FRONTEND IMPLEMENTATION CHECKLIST

### ✅ Required Features:
- [x] Fetch active advertisements from database
- [x] Display feature image when available
- [x] Show title and content text
- [x] Render CTA button with custom text and URL
- [x] Handle external links (Google, TikTok, etc.)
- [x] Track advertisement views on component mount
- [x] Track CTA button clicks
- [x] Filter by position (sidebar, header, footer)
- [x] Handle missing/null values gracefully

### 🔧 Technical Requirements:
- [x] Use Supabase client for database queries
- [x] Implement proper error handling
- [x] Add loading states for advertisements
- [x] Ensure responsive design for all positions
- [x] Open external links in new tab
- [x] Add proper alt text for images

### 📱 Responsive Design:
- [x] Mobile-friendly advertisement cards
- [x] Proper image sizing and aspect ratios
- [x] Touch-friendly CTA buttons
- [x] Sidebar ads stack properly on mobile

## 🚨 IMPORTANT NOTES

1. **External Links**: All CTA button URLs can be external (Google, TikTok, Instagram, etc.)
2. **Image Required**: Feature image is essential for sponsored content display
3. **Click Tracking**: Must track both CTA clicks and image clicks separately
4. **View Tracking**: Track views when advertisement becomes visible
5. **Fallback**: Handle cases where image_url or cta_button_url is null
6. **Security**: Always use `target="_blank"` and `rel="noopener noreferrer"` for external links

## 📞 ADMIN CONTACT

If advertisements don't appear or tracking doesn't work:
1. Check if `is_active = true` in database
2. Verify `end_date` is null or in future
3. Confirm advertisement position matches frontend filter
4. Test database connection and RLS policies