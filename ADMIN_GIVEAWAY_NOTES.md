# Admin Notes for Giveaway Management

## Overview
The giveaway system has been updated to use real database data instead of mock content. All custom requests from users are now sent to admin for review and approval.

## Database Tables

### 1. additional_packages
- **Purpose**: Admin-manageable packages that appear in the "Additional Packages" section
- **Admin Control**: Full CRUD access to manage packages by category and price
- **Columns**:
  - `name`: Package display name
  - `description`: Package description text
  - `base_price`: Base price for the package
  - `category`: Category (food, kids, spiritual, etc.)
  - `addons`: Array of addon options (each costs +$25)
  - `addon_price`: Price per addon (default $25)
  - `is_active`: Toggle to show/hide package

### 2. custom_giveaway_requests  
- **Purpose**: Stores all custom requests from users for admin review
- **Admin Control**: View, approve, reject, and manage all user requests
- **Request Types**:
  - `prayer`: Prayer requests from users
  - `special`: Special instructions or requests
  - `handwritten`: Handwritten note requests
  - `design`: Custom design/logo requests
  - `name`: Name to be included on items
  - `file`: File uploads (photos, documents, designs)

## Admin Management Features

### Managing Additional Packages
**To add a new package:**
1. Access the `additional_packages` table in Supabase
2. Insert new record with required fields:
   - `name`, `description`, `base_price`, `category`
   - Optionally add `addons` array for extra options
3. Set `is_active` to true to display

**To organize by categories:**
- Use consistent category names: 'food', 'kids', 'spiritual', 'education', etc.
- Categories auto-group packages in the UI

### Managing Custom Requests
**Admin Review Process:**
1. Check `custom_giveaway_requests` table for new requests (status: 'pending')
2. Review request content and attached files
3. Update status to: 'approved', 'completed', or 'rejected'
4. Add `admin_notes` for internal tracking

**Request Workflow:**
- User fills form → Creates requests → Admin reviews → Status updated → User notified

## Current Sample Packages
The system includes these initial packages:
1. **Jollof Rice Package** - $150 (food category)
   - Full bags of Jollof rice, turkey, 200 takeaway packs
   - Addons: Prayer from pastors, Documentation video, Printout cloths

2. **Kids Sweet Package** - $75 (kids category) 
   - 20 packs of sweet candies and biscuits
   - Addons: Kids gathering prayer, Photo design, Handwritten notes, Signatures

3. **Prayer & Spiritual Support** - $50 (spiritual category)
   - Dedicated prayer sessions and spiritual guidance
   - Addons: Personal prayer request, Blessed items, Prayer documentation

## User Form Fields That Go to Admin

### Reason for Giveaway
- Dropdown with predefined reasons: Prayer, Blessings, Mercy, etc.
- Optional personalized reason text field

### Custom Requests (All sent to admin)
1. **Prayer Request**: User's specific prayer request
2. **Special Request**: Any special instructions or requirements
3. **Handwritten Note**: Message for handwritten note
4. **Custom Design/Logo**: Design description and requirements
5. **Name for Items**: Name to include on items/packages
6. **File Uploads**: Photos, designs, documents (images, PDF, DOC)

### Enrollment Options
- Earn money through tasks
- Display ranking membership
- Participate in charity activities

## Admin Access Points

### Supabase Dashboard
- **SQL Editor**: Direct database access for bulk operations
- **Table Editor**: GUI for managing individual records
- **Authentication**: View user details for orders

### Recommended Admin Workflow
1. **Daily Review**: Check for new custom requests
2. **Package Management**: Update seasonal or special packages
3. **Order Processing**: Review completed orders and invoicing
4. **User Communication**: Follow up on special requests

## Security Notes
- All tables have proper RLS (Row Level Security) policies
- Admins have full access, users can only view their own data
- File uploads are logged but files need separate storage setup
- Custom requests are immediately visible to admin upon submission

## Future Enhancements
- Admin notification system for new requests
- Automated invoicing integration
- File storage with Supabase Storage buckets
- Email templates for request status updates
- Bulk actions for managing multiple requests