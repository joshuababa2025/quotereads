# Admin Notes for QuoteReads Platform

## Product Categories

When adding products to the shop, please use one of the following standardized categories to ensure proper filtering and display:

### Available Categories:
- **Books & Literature** - For books, novels, poetry collections, etc.
- **Motivational Items** - For inspirational products, quote prints, etc.
- **Stationery** - For notebooks, journals, pens, etc.
- **Apparel** - For clothing items with quotes or book themes
- **Home Decor** - For wall art, decorative items, etc.
- **Accessories** - For bookmarks, bags, etc.
- **Digital Products** - For e-books, digital downloads, etc.
- **Gift Sets** - For bundled products or gift packages

### Important Notes:

1. **Category Field**: Always fill in the `category` field when adding products. This field is used for:
   - Product filtering on the shop page
   - Category badges on product cards
   - Organizing products for customers

2. **Images**: 
   - `featured_image`: Main product image (required)
   - `images`: Additional product images (optional array)
   - All images should be high quality and properly sized

3. **Product Status**:
   - `active`: Product is available for purchase
   - `coming_soon`: Product is available for pre-order
   - `inactive`: Product is hidden from shop

4. **Stock Management**:
   - Set `stock` to 0 for out-of-stock items
   - Use `launch_date` for coming soon products

5. **Pricing**:
   - Always use decimal format (e.g., 19.99, not 19)
   - Price should include currency in USD

### Shop Products Schema:

```sql
shop_products (
  id: uuid (primary key)
  name: text (required)
  description: text (required)
  price: numeric (required)
  category: text (required) -- Use categories listed above
  stock: integer (default: 0)
  status: text (default: 'active') -- 'active', 'coming_soon', 'inactive'
  featured_image: text (required)
  images: text[] (optional array of additional images)
  launch_date: timestamp (optional, for coming_soon products)
  created_at: timestamp (auto)
  updated_at: timestamp (auto)
)
```

### Best Practices:

1. **Product Names**: Use clear, descriptive names
2. **Descriptions**: Write compelling product descriptions that highlight benefits
3. **Categories**: Stick to the standardized list above for consistency
4. **Images**: Use high-resolution images, preferably 800x800px or larger
5. **Stock**: Keep stock levels updated to avoid overselling

### Frontend Integration:

- Categories are automatically fetched from the database and displayed in filters
- Product cards show category badges
- Additional images are displayed in product detail pages
- Mobile-first design ensures good user experience on all devices

---

## Quote of the Day Management

### Overview
The Quote of the Day feature allows admins to set daily inspirational quotes that appear on the `/quote-of-the-day` page. The system automatically displays today's quote and shows previous daily quotes in a grid below.

### Database Schema

```sql
quotes (
  id: uuid (primary key)
  user_id: uuid (required) -- IMPORTANT: Admin user who created the quote
  content: text (required) -- The quote text
  author: text (required) -- Quote author
  category: text (required) -- Quote category
  tags: text[] (optional) -- Array of tags
  is_quote_of_day: boolean (default: false) -- Mark as quote of the day
  quote_of_day_date: date (optional) -- Date when this was/will be quote of the day
  created_at: timestamp (auto)
  updated_at: timestamp (auto)
)
```

### Backend Admin Panel Requirements

**Admin uploads Quote of the Day through a custom admin panel, NOT Supabase directly.**

**Required Admin Panel Features:**
1. **Quote of the Day Form** with fields:
   - Quote content (textarea)
   - Author name (text input)
   - Category (dropdown: Motivation, Success, Life, Wisdom, etc.)
   - Tags (multi-select or comma-separated)
   - Date picker (default to today)
   - Submit button

2. **Backend API Endpoints:**
   - `POST /admin/quote-of-the-day` - Create new QOTD
   - `GET /admin/quote-of-the-day` - List all QOTD
   - `PUT /admin/quote-of-the-day/:id` - Update existing QOTD
   - `DELETE /admin/quote-of-the-day/:id` - Delete QOTD

3. **Business Logic:**
   - Clear existing QOTD for selected date before inserting new one
   - Validate only one QOTD per date
   - Auto-generate UUID for new quotes
   - Set `is_quote_of_day = TRUE` and `quote_of_day_date`

### Backend Implementation Guide

#### API Endpoint: POST /admin/quote-of-the-day
```javascript
// Request body
{
  "content": "The only impossible journey is the one you never begin.",
  "author": "Tony Robbins",
  "category": "Motivation",
  "tags": ["motivation", "journey", "beginning"],
  "date": "2024-01-15" // YYYY-MM-DD format
}

// Backend logic (pseudo-code)
async function createQuoteOfTheDay(data, adminUserId) {
  // 1. Clear existing QOTD for this date
  await supabase
    .from('quotes')
    .update({ is_quote_of_day: false })
    .eq('quote_of_day_date', data.date);
  
  // 2. Insert new QOTD with admin user_id
  const { data: newQuote, error } = await supabase
    .from('quotes')
    .insert({
      user_id: adminUserId, // REQUIRED: Admin user ID
      content: data.content,
      author: data.author,
      category: data.category,
      tags: data.tags,
      is_quote_of_day: true,
      quote_of_day_date: data.date
    });
  
  return newQuote;
}
```

#### SQL Queries for Backend
```sql
-- Clear existing QOTD for date
UPDATE quotes 
SET is_quote_of_day = FALSE 
WHERE quote_of_day_date = $1;

-- Insert new QOTD (IMPORTANT: Include user_id)
INSERT INTO quotes (
  user_id, content, author, category, tags, 
  is_quote_of_day, quote_of_day_date
) VALUES ($1, $2, $3, $4, $5, TRUE, $6);
```

### Admin Panel UI/UX Requirements

1. **Quote of the Day Form:**
   ```html
   <form>
     <textarea placeholder="Enter quote content" required></textarea>
     <input type="text" placeholder="Author name" required>
     <select>
       <option>Motivation</option>
       <option>Success</option>
       <option>Life</option>
       <option>Wisdom</option>
     </select>
     <input type="text" placeholder="Tags (comma-separated)">
     <input type="date" value="today">
     <button type="submit">Publish Quote of the Day</button>
   </form>
   ```

2. **Admin Dashboard Features:**
   - Calendar view showing scheduled QOTD
   - List of past QOTD with edit/delete options
   - Preview of how quote will appear on frontend
   - Bulk upload for scheduling multiple quotes

3. **Validation Rules:**
   - Quote content: 10-200 characters
   - Author: Required, max 50 characters
   - Category: Must be from predefined list
   - Date: Cannot be in the past (except for editing)
   - Only one QOTD per date allowed

4. **Content Guidelines:**
   - Keep quotes inspirational and positive
   - Verify author attribution accuracy
   - Use consistent formatting
   - Avoid controversial topics

### Frontend Features

- **Today's Quote**: Prominently displayed with large formatting
- **Previous Quotes**: Grid of past daily quotes
- **Interactions**: Users can like, favorite, share, and comment
- **Download**: Users can download quote images
- **Fallback**: If no quote is set for today, shows latest quote

### Troubleshooting

**No Quote Showing**: 
- Check if `is_quote_of_day = TRUE` for today's date
- Verify `quote_of_day_date = CURRENT_DATE`
- Ensure quote has content and author

**Multiple Quotes for Same Day**:
- Only one quote should have `is_quote_of_day = TRUE` per date
- Run cleanup query to fix duplicates

**Previous Quotes Not Showing**:
- Ensure past quotes have `is_quote_of_day = TRUE`
- Check `quote_of_day_date` is set correctly
- Verify dates are in the past

### Admin Workflow

**Daily Process:**
1. Login to custom admin panel
2. Navigate to "Quote of the Day" section
3. Fill out the QOTD form:
   - Enter quote content
   - Add author name
   - Select category
   - Add relevant tags
   - Set date (default: today)
4. Click "Publish Quote of the Day"
5. System automatically:
   - Clears any existing QOTD for that date
   - Saves new quote with QOTD flags
   - Shows success confirmation
6. Verify on frontend at `/quote-of-the-day`

**Planning Ahead:**
- Use date picker to schedule future quotes
- Bulk upload feature for multiple quotes
- Calendar view to see scheduled content

### Database Setup Required

**CRITICAL: Run `QUOTE_OF_THE_DAY_SQL.sql` first!**

This SQL file:
- Adds `is_quote_of_day` and `quote_of_day_date` columns to quotes table
- Creates performance indexes
- Sets up security policies
- NO sample data (admin creates quotes through panel)

**Without this SQL setup, the admin panel and frontend won't work.**

**Important:** The SQL no longer includes sample data to avoid foreign key errors. Admin must create the first quote through the admin panel using a real authenticated user ID.

### Backend Development Notes

**CRITICAL: user_id Field Required**
- The quotes table requires a `user_id` field (NOT NULL constraint)
- Always pass the admin user's ID when creating quotes
- Use authenticated admin user ID from session/JWT
- For system quotes, create a dedicated admin user

**Other Requirements:**
- Use parameterized queries to prevent SQL injection
- Implement proper authentication for admin endpoints
- Add input validation and sanitization
- Include error handling for duplicate dates
- Log all QOTD changes for audit trail
- Consider caching today's quote for better performance

**Example Admin Authentication:**
```javascript
// Get admin user from session/JWT
const adminUser = await getAuthenticatedUser(req);
if (!adminUser || !adminUser.isAdmin) {
  return res.status(403).json({ error: 'Admin access required' });
}

// Use admin user ID for quote creation
await createQuoteOfTheDay(quoteData, adminUser.id);
```