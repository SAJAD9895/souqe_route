# Admin Panel Database Setup

## Update the Leads Table

Run this SQL in your Supabase SQL Editor to add the status column and fix permissions:

```sql
-- Add status column to leads table
ALTER TABLE leads 
ADD COLUMN status TEXT DEFAULT 'new';

-- Update existing rows to have 'new' status
UPDATE leads 
SET status = 'new' 
WHERE status IS NULL;

-- Drop the old restrictive SELECT policy if it exists
DROP POLICY IF EXISTS "Allow individual read access" ON leads;

-- Create policy to allow ANYONE (anon) to read leads
-- This is needed for the admin panel to work
CREATE POLICY "Allow public read access" 
ON leads 
FOR SELECT 
TO anon 
USING (true);

-- Create policy to allow ANYONE (anon) to update leads
-- This is needed for status updates in admin panel
CREATE POLICY "Allow public updates" 
ON leads 
FOR UPDATE 
TO anon 
USING (true);
```

## Status Options
The admin panel will support these statuses:
- **new** - Fresh lead (default)
- **contacted** - Lead has been contacted
- **qualified** - Lead is qualified
- **converted** - Lead converted to customer
- **rejected** - Lead rejected

That's it! The admin panel will handle the rest.

