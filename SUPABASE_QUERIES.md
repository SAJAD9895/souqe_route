# Supabase SQL Queries

## 🗑️ Clear All Data from Leads Table

**WARNING: This will delete ALL leads data permanently!**

```sql
-- Delete all rows from the leads table
DELETE FROM leads;

-- Optional: Reset the ID sequence to start from 1 again
ALTER SEQUENCE leads_id_seq RESTART WITH 1;
```

## 📊 Useful Queries

### View all leads
```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

### Count total leads
```sql
SELECT COUNT(*) as total_leads FROM leads;
```

### View leads by status
```sql
SELECT status, COUNT(*) as count 
FROM leads 
GROUP BY status;
```

### View recent leads (last 7 days)
```sql
SELECT * FROM leads 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Delete a specific lead by ID
```sql
DELETE FROM leads WHERE id = 123;
```

### Delete old leads (older than 30 days)
```sql
DELETE FROM leads 
WHERE created_at < NOW() - INTERVAL '30 days';
```

## 🔧 Table Maintenance

### View table structure
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
```

### Check table size
```sql
SELECT pg_size_pretty(pg_total_relation_size('leads')) as table_size;
```
