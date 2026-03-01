# como hacer el total diario.

```sql
CREATE OR REPLACE FUNCTION get_daily_totals(
    p_from        date,
    p_to          date,
    p_account_id  uuid    DEFAULT NULL,
    p_category_id uuid    DEFAULT NULL,
    p_type        text    DEFAULT NULL   -- 'income' | 'expense' | 'transfer'
  )
  RETURNS TABLE(day date, total bigint) AS $$
    SELECT date::date, SUM(amount)
    FROM transactions
    WHERE user_id = auth.uid()
      AND date >= p_from
      AND date <= p_to
      AND (p_account_id  IS NULL OR account_id = p_account_id OR destination_account_id = p_account_id)
      AND (p_category_id IS NULL OR category_id = p_category_id)
      AND (p_type        IS NULL OR transaction_type = p_type::transaction_type)
    GROUP BY date::date
    ORDER BY date::date DESC
  $$ LANGUAGE sql SECURITY DEFINER;

```
