-- SAFE MIGRATION: add Farm and Legacy chicken types
-- DO NOT delete or recreate existing tables/data.

-- 1. Add Farm if it does not already exist.
INSERT INTO public.chicken_types (name)
VALUES ('Farm')
ON CONFLICT (name) DO NOTHING;

-- 2. Add Legacy type for old records where chicken type was never recorded.
INSERT INTO public.chicken_types (name)
VALUES ('Unspecified / Legacy')
ON CONFLICT (name) DO NOTHING;

-- 3. Keep the old Scout type for historical integrity,
-- but don't show it as a normal current selling type.
UPDATE public.chicken_types
SET is_active = false
WHERE name = 'Scout';

-- 4. Get all legacy chicken-type IDs and assign them to
-- historical records that previously had no type.
UPDATE public.sales
SET chicken_type_id = (
  SELECT id
  FROM public.chicken_types
  WHERE name = 'Unspecified / Legacy'
)
WHERE chicken_type_id IS NULL;

UPDATE public.purchases
SET chicken_type_id = (
  SELECT id
  FROM public.chicken_types
  WHERE name = 'Unspecified / Legacy'
)
WHERE chicken_type_id IS NULL;

UPDATE public.wastage
SET chicken_type_id = (
  SELECT id
  FROM public.chicken_types
  WHERE name = 'Unspecified / Legacy'
)
WHERE chicken_type_id IS NULL;

-- 5. Indexes for fast dashboard/report filtering.
CREATE INDEX IF NOT EXISTS idx_sales_chicken_type_date
ON public.sales (chicken_type_id, business_date DESC);

CREATE INDEX IF NOT EXISTS idx_purchases_chicken_type_date
ON public.purchases (chicken_type_id, business_date DESC);

CREATE INDEX IF NOT EXISTS idx_wastage_chicken_type_date
ON public.wastage (chicken_type_id, business_date DESC);
