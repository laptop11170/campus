# IIT Mandi Campus Marketplace — Deployment Guide

## 1. Prerequisites

- **Node.js 18+**
- **Git**
- A **Supabase** account (free tier works)
- A **Vercel / Railway / Render** account (or any Node.js host)

---

## 2. Supabase Setup

### 2.1 Create a new project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note down:
  - `Project URL`
  - `Project API` > `anon public` key
  - `Project API` > `service_role` key (for admin operations)

### 2.2 Run the SQL schema

In the Supabase SQL Editor, run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('product', 'service', 'event')),
  price NUMERIC,
  price_label TEXT,
  photo_url TEXT,
  contact_info TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  payment_screenshot_url TEXT,
  payment_amount NUMERIC,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings policies
CREATE POLICY "Approved listings are viewable by everyone"
  ON listings FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own listings"
  ON listings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listings"
  ON listings FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any listing"
  ON listings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any listing"
  ON listings FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
  new.id,
  new.raw_user_meta_data->>'full_name',
  new.raw_user_meta_data->>'avatar_url',
  new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2.3 Configure Google OAuth

1. Go to **Authentication > Providers > Google** in Supabase.
2. Enable Google sign-in.
3. Add your site's callback URL: `https://your-domain.com/auth/callback`
4. Also add `http://localhost:3000/auth/callback` for local dev.

### 2.4 Create Storage Buckets

1. Go to **Storage** in Supabase.
2. Create two buckets:
  - `listing-photos` — set to **public**
  - `payment-screenshots` — set to **private**
3. For each bucket, set the upload policy to allow authenticated users.

### 2.5 Set the Admin User

After you sign in for the first time, run this in the SQL Editor to make yourself admin:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

---

## 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_UPI_ID=yourname@upi
NEXT_PUBLIC_LISTING_FEE=49
NEXT_PUBLIC_FEATURED_FEE=149
NEXT_PUBLIC_CONTACT_NUMBER=+91XXXXXXXXXX

ADMIN_EMAIL=your-admin-email@gmail.com
```

---

## 4. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 5. Deploy to Railway (Recommended)

1. Push your code to GitHub.
2. Create a new project on [Railway](https://railway.app).
3. Import your GitHub repo.
4. Add all environment variables in Railway dashboard.
5. Set the build command: `npm run build`
6. Set the start command: `npm start`
7. Add a custom domain (optional).
8. Update the Supabase **Authentication > URL Configuration** with your production domain.
9. Update Google OAuth callback URLs with your production domain.

---

## 6. Post-Deployment Checklist

- [ ] Sign in with Google and verify profile is created
- [ ] Create a test listing and verify payment flow
- [ ] Check that admin can approve/reject listings
- [ ] Verify listing appears on homepage after approval
- [ ] Check image uploads work for both photos and screenshots
- [ ] Test mobile responsiveness
