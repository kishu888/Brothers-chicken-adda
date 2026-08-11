
CREATE POLICY "members read bills" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'bills');
CREATE POLICY "members upload bills" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'bills' AND owner = auth.uid());
CREATE POLICY "members update bills" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'bills') WITH CHECK (bucket_id = 'bills');
