
-- roles
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TYPE public.payment_method AS ENUM ('cash','online');
CREATE TYPE public.record_status AS ENUM ('active','reversed','archived');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by members" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "roles readable" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- first user becomes admin, others user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cnt INT;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  SELECT count(*) INTO cnt FROM public.user_roles;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, CASE WHEN cnt = 0 THEN 'admin'::public.app_role ELSE 'user'::public.app_role END);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- chicken types
CREATE TABLE public.chicken_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.chicken_types TO authenticated;
GRANT ALL ON public.chicken_types TO service_role;
ALTER TABLE public.chicken_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read chicken types" ON public.chicken_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "members write chicken types" ON public.chicken_types FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "members update chicken types" ON public.chicken_types FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_chicken_types BEFORE UPDATE ON public.chicken_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.chicken_types (name) VALUES ('Broiler'), ('Scout');

-- suppliers
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT, address TEXT, gstin TEXT, notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert suppliers" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "members update suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_suppliers BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- expense categories
CREATE TABLE public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL DEFAULT 'operating',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.expense_categories TO authenticated;
GRANT ALL ON public.expense_categories TO service_role;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read categories" ON public.expense_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert categories" ON public.expense_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "members update categories" ON public.expense_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_expense_categories BEFORE UPDATE ON public.expense_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.expense_categories (name, kind) VALUES
 ('Rent','operating'),('Electricity','operating'),('Water','operating'),
 ('Masala & Ingredients','direct'),('Daily Worker','direct'),('Chicken Feed','direct'),
 ('Transport','direct'),('Fuel','operating'),('Packaging','direct'),('Ice','direct'),
 ('Cleaning','operating'),('Maintenance','operating'),('Equipment','operating'),('Other','operating');

-- documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  doc_date DATE,
  category TEXT,
  supplier_id UUID REFERENCES public.suppliers(id),
  invoice_number TEXT,
  amount NUMERIC(12,2),
  related_type TEXT,
  related_id UUID,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "members update documents" ON public.documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- sales
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key TEXT UNIQUE,
  business_date DATE NOT NULL,
  sold_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  chicken_type_id UUID REFERENCES public.chicken_types(id),
  weight_kg NUMERIC(10,3) NOT NULL CHECK (weight_kg > 0),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  rate_per_kg NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(amount / NULLIF(weight_kg,0), 2)) STORED,
  payment_method public.payment_method NOT NULL,
  upi_reference TEXT,
  customer_name TEXT,
  notes TEXT,
  status public.record_status NOT NULL DEFAULT 'active',
  reversal_reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_date ON public.sales (business_date DESC);
GRANT SELECT, INSERT, UPDATE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read sales" ON public.sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "members update sales" ON public.sales FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_sales BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- purchases
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key TEXT UNIQUE,
  business_date DATE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  chicken_type_id UUID REFERENCES public.chicken_types(id),
  gross_weight_kg NUMERIC(10,3) NOT NULL DEFAULT 0,
  tare_weight_kg NUMERIC(10,3) NOT NULL DEFAULT 0,
  net_weight_kg NUMERIC(10,3) GENERATED ALWAYS AS (gross_weight_kg - tare_weight_kg) STORED,
  listed_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_per_kg NUMERIC(12,2) NOT NULL DEFAULT 0,
  effective_rate NUMERIC(12,2) GENERATED ALWAYS AS (listed_rate - discount_per_kg) STORED,
  other_charges NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_cost NUMERIC(14,2) GENERATED ALWAYS AS (ROUND((gross_weight_kg - tare_weight_kg) * (listed_rate - discount_per_kg) + other_charges, 2)) STORED,
  invoice_number TEXT,
  gstin TEXT, hsn TEXT,
  taxable_amount NUMERIC(12,2), cgst NUMERIC(12,2), sgst NUMERIC(12,2), igst NUMERIC(12,2),
  payment_method public.payment_method,
  amount_paid NUMERIC(14,2) NOT NULL DEFAULT 0,
  document_id UUID REFERENCES public.documents(id),
  notes TEXT,
  status public.record_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_purchases_date ON public.purchases (business_date DESC);
GRANT SELECT, INSERT, UPDATE ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read purchases" ON public.purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert purchases" ON public.purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "members update purchases" ON public.purchases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_purchases BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- expenses
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key TEXT UNIQUE,
  business_date DATE NOT NULL,
  category_id UUID REFERENCES public.expense_categories(id),
  category_name_snapshot TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  payment_method public.payment_method NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  payee TEXT,
  description TEXT,
  invoice_number TEXT,
  document_id UUID REFERENCES public.documents(id),
  notes TEXT,
  status public.record_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_expenses_date ON public.expenses (business_date DESC);
GRANT SELECT, INSERT, UPDATE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read expenses" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "members update expenses" ON public.expenses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_expenses BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- wastage
CREATE TABLE public.wastage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key TEXT UNIQUE,
  business_date DATE NOT NULL,
  chicken_type_id UUID REFERENCES public.chicken_types(id),
  weight_kg NUMERIC(10,3) NOT NULL CHECK (weight_kg > 0),
  reason TEXT NOT NULL DEFAULT 'Other',
  estimated_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  document_id UUID REFERENCES public.documents(id),
  status public.record_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wastage_date ON public.wastage (business_date DESC);
GRANT SELECT, INSERT, UPDATE ON public.wastage TO authenticated;
GRANT ALL ON public.wastage TO service_role;
ALTER TABLE public.wastage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read wastage" ON public.wastage FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert wastage" ON public.wastage FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "members update wastage" ON public.wastage FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_wastage BEFORE UPDATE ON public.wastage FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- stock counts
CREATE TABLE public.stock_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_date DATE NOT NULL,
  chicken_type_id UUID NOT NULL REFERENCES public.chicken_types(id),
  actual_closing_kg NUMERIC(10,3) NOT NULL,
  expected_closing_kg NUMERIC(10,3),
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_date, chicken_type_id)
);
GRANT SELECT, INSERT, UPDATE ON public.stock_counts TO authenticated;
GRANT ALL ON public.stock_counts TO service_role;
ALTER TABLE public.stock_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read stock" ON public.stock_counts FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert stock" ON public.stock_counts FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "members update stock" ON public.stock_counts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_stock BEFORE UPDATE ON public.stock_counts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- cash days
CREATE TABLE public.cash_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_date DATE NOT NULL UNIQUE,
  opening_cash NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_cash NUMERIC(12,2),
  verified_online NUMERIC(12,2),
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.cash_days TO authenticated;
GRANT ALL ON public.cash_days TO service_role;
ALTER TABLE public.cash_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read cash" ON public.cash_days FOR SELECT TO authenticated USING (true);
CREATE POLICY "members insert cash" ON public.cash_days FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "members update cash" ON public.cash_days FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER t_cash BEFORE UPDATE ON public.cash_days FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- audit log
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_created ON public.audit_logs (created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read audit" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "members write audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);

-- settings
CREATE TABLE public.business_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
  business_name TEXT NOT NULL DEFAULT 'Brothers Chicken Adda',
  address TEXT DEFAULT 'Bengaluru, Karnataka, India',
  phone TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  weight_unit TEXT NOT NULL DEFAULT 'kg',
  stock_tolerance_kg NUMERIC(10,3) NOT NULL DEFAULT 1.0,
  variable_cost_per_kg NUMERIC(10,2) NOT NULL DEFAULT 12,
  target_margin_per_kg NUMERIC(10,2) NOT NULL DEFAULT 20,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.business_settings TO authenticated;
GRANT ALL ON public.business_settings TO service_role;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read settings" ON public.business_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins update settings" ON public.business_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins insert settings" ON public.business_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.business_settings (id) VALUES (true);
