/*
  # Initial CRM Database Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `company` (text)
      - `status` (text)
      - `last_contact` (date)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (decimal)
      - `category` (text)
      - `stock` (integer)
      - `description` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `due_date` (date)
      - `assigned_to` (text)
      - `priority` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  company text,
  status text NOT NULL DEFAULT 'active',
  last_contact date,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own customers"
  ON customers
  USING (auth.uid() = user_id);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own products"
  ON products
  USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  assigned_to text,
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks"
  ON tasks
  USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO customers (name, email, phone, company, status, last_contact, user_id)
VALUES
  ('John Smith', 'john@example.com', '(555) 123-4567', 'Tech Corp', 'active', '2024-03-10', auth.uid()),
  ('Sarah Johnson', 'sarah@example.com', '(555) 987-6543', 'Design Co', 'active', '2024-03-08', auth.uid()),
  ('Michael Brown', 'michael@example.com', '(555) 456-7890', 'Old Corp', 'inactive', '2024-01-15', auth.uid()),
  ('Emily Davis', 'emily@example.com', '(555) 234-5678', 'Past LLC', 'inactive', '2024-02-01', auth.uid());

INSERT INTO products (name, price, category, stock, description, user_id)
VALUES
  ('Premium Software License', 299.99, 'Software', 50, 'Enterprise-grade software solution', auth.uid()),
  ('Cloud Storage Plan', 99.99, 'Services', 100, '1TB cloud storage subscription', auth.uid());

INSERT INTO tasks (title, description, status, due_date, assigned_to, priority, user_id)
VALUES
  ('Follow up with Tech Corp', 'Schedule demo for new software', 'pending', '2024-03-15', 'John Doe', 'high', auth.uid()),
  ('Update product catalog', 'Add new cloud services', 'in-progress', '2024-03-20', 'Jane Smith', 'medium', auth.uid()),
  ('Client presentation', 'Prepare slides for the quarterly review', 'completed', '2024-03-12', 'Mike Johnson', 'high', auth.uid());